import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import path from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";
import {
  incomeSchema,
  homeExpenseSchema,
  utilitiesSchema,
  servicesAndSubscriptionsSchema,
  transportAndTravelSchema,
  personalSchema,
  petsSchema,
  foodAndShoppingSchema,
  accountsAndSavingsSchema,
} from "./schemas.js";

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

// Setup logs directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  mkdirSync(path.join(__dirname, "logs"), { recursive: true });
} catch (err) {
  if (err.code !== "EEXIST") {
    console.error("Warning: Could not create logs directory:", err.message);
  }
}

// Log configuration
const fastify = Fastify({
  logger:
    process.env.NODE_ENV === "production"
      ? {
          // PRODUCTION
          level: "info",
          file: path.join(__dirname, "logs", "app.log"),
          serializers: {
            // Customise request logging
            req(req) {
              return {
                method: req.method,
                url: req.url,
                ip: req.ip,
                headers: {
                  "user-agent": req.headers["user-agent"],
                },
              };
            },
            // Customise response logging
            res(res) {
              return {
                statusCode: res.statusCode,
              };
            },
          },
        }
      : {
          // DEVELOPMENT
          level: "info",
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "dd-mm-yy HH:MM:ss",
              ignore: "pid,hostname",
              singleLine: false,
            },
          },
        },
});

// Sanitised error handling
function sendSafeError(reply, error, statusCode = 500) {
  fastify.log.error(
    {
      error: error.message,
      stack: error.stack,
      code: error.code,
    },
    "Error occurred during processing",
  );

  const sanitisedMessages = {
    400: "Invalid request data",
    401: "Authentication required",
    403: "Access denied",
    404: "Resource not found",
    500: "An internal error occurred",
  };

  reply.code(statusCode).send({
    error: sanitisedMessages[statusCode] || "An error occurred",
  });
}

// CORS registration
await fastify.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
});

// Helmet security headers
await fastify.register(helmet, {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Only load resources from this domain by default
      scriptSrc: ["'self'"], // Only run scripts from this domain
      styleSrc: ["'self'", "'unsafe-inline'"], // Styles from this domain + inline styles (needed for React)
      imgSrc: ["'self'", "data:", "https:"], // Images from this domain, data URIs, and HTTPS sources
      connectSrc: ["'self'", process.env.SUPABASE_URL], // API calls to this server and Supabase
      fontSrc: ["'self'"], // Fonts only from this domain
      objectSrc: ["'none'"], // Disable plugins like Flash
      mediaSrc: ["'self'"], // Media from this domain only
      frameSrc: ["'none'"], // No iframes
    },
  },
  // Clickjacking protection
  frameguard: {
    action: "deny", // Prevent site from being in any iframe
  },
  // MIME-sniffing protection
  noSniff: true,
  // Hide X-Powered-By header to not reveal Fastify use
  hidePoweredBy: true,
  // HSTS - force HTTPS (only in production)
  hsts:
    process.env.NODE_ENV === "production"
      ? {
          maxAge: 31536000, // 1 year in seconds
          includeSubDomains: true, // Apply to all subdomains
          preload: true, // Allow browser HSTS preload lists
        }
      : false,
  // Control referrer information
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin", // Only send origin to external sites, full URL to this site
  },
});

// Rate limiting
if (process.env.NODE_ENV === "production") {
  await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "15 minutes",
    cache: 10000,
    allowList: ["127.0.0.1"],
    skipOnError: false,
  });
}

// Enforce HTTPS
fastify.addHook("onRequest", (request, reply, done) => {
  if (
    process.env.NODE_ENV === "production" &&
    request.headers["x-forwarded-proto"] !== "https"
  ) {
    reply.redirect(301, `https://${request.headers.host}${request.url}`);
  }
  done();
});

// Content-Type validation and JSON parser
fastify.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (_req, body, done) {
    try {
      //Parse JSON and check size to prevent memory exhaustion attacks
      if (body.length > 1048576) {
        // 1MB
        const error = new Error("Request body too large");
        error.statusCode = 413;
        done(error, undefined);
        return;
      }

      const json = JSON.parse(body);
      done(null, json);
    } catch (err) {
      err.statusCode = 400;
      err.message = "Invalid JSON format";
      done(err, undefined);
    }
  },
);

// Reject inproper Content-Type for POST requests
fastify.addHook("preHandler", (request, reply, done) => {
  if (request.method === "POST") {
    const contentType = request.headers["content-type"];

    if (!contentType) {
      reply.code(415).send({
        error: "Content-Type header is required for POST requests",
      });
      return;
    }

    if (!contentType.includes("application/json")) {
      reply.code(415).send({
        error: "Content-Type must be application/json",
      });
      return;
    }
  }
  done();
});

// Auth Verification Middleware
async function verifyAuth(request, reply) {
  const authHeader = request.headers.authorization;

  const logContext = {
    ip: request.ip,
    userAgent: request.headers["user-agent"],
    path: request.url,
    method: request.method,
  };

  if (!authHeader) {
    fastify.log.warn(
      {
        event: "AUTH_FAILED",
        reason: "NO_AUTH_HEADER",
        ...logContext,
      },
      "Unauthorised access attempt - no authorisation header",
    );

    reply.code(401).send({ error: "No authorization header provided" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    fastify.log.warn(
      {
        event: "AUTH_FAILED",
        reason: error ? "INVALID_TOKEN" : "USER_NOT_FOUND",
        errorMessage: error?.message,
        tokenPrefix: token.substring(0, 10) + "...",
        ...logContext,
      },
      "Unauthorised access attempt - invalid or expired token",
    );

    reply.code(401).send({ error: "Invalid or expired token" });
    return;
  }

  fastify.log.info(
    {
      event: "AUTH_SUCCESS",
      userID: user.id,
      userEmail: user.email,
      ...logContext,
    },
    "User authenticated successfully",
  );

  request.user = user;
}

// GET Budget
fastify.get(
  "/api/budget",
  { preHandler: verifyAuth },
  async (request, reply) => {
    const userId = request.user.id;
    const { data, error } = await supabase
      .from("budget")
      .select("category,item,amount")
      .eq("user_id", userId);

    if (error) {
      sendSafeError(reply, error, 500);
      return;
    }

    return { budget: data };
  },
);

// POST Home Route Check
fastify.get("/", async (request, reply) => {
  return { hello: "World" };
});

// POST Income
fastify.post(
  "/api/income",
  { preHandler: verifyAuth, schema: incomeSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.income;

    try {
      const updates = [];

      if (data.wage !== undefined) {
        const { data: wageData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "income",
              item: "wage",
              amount: data.wage,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...wageData);
      }

      if (data.otherIncome !== undefined) {
        const { data: otherIncomeData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "income",
              item: "otherIncome",
              amount: data.otherIncome,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...otherIncomeData);
      }

      return { income: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// POST Home Expense
fastify.post(
  "/api/home_expense",
  { preHandler: verifyAuth, schema: homeExpenseSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.homeExpense;
    console.log(data);

    try {
      const updates = [];

      if (data.mortgage !== undefined) {
        const { data: mortgageData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "homeExpense",
              item: "mortgage",
              amount: data.mortgage,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...mortgageData);
      }

      if (data.councilTax !== undefined) {
        const { data: councilTaxData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "homeExpense",
              item: "councilTax",
              amount: data.councilTax,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...councilTaxData);
      }

      if (data.homeInsurance !== undefined) {
        const { data: homeInsuranceData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "homeExpense",
              item: "homeInsurance",
              amount: data.homeInsurance,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...homeInsuranceData);
      }

      return { homeExpense: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// POST Utilities
fastify.post(
  "/api/utilities",
  { preHandler: verifyAuth, schema: utilitiesSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.utilities;

    try {
      const updates = [];

      if (data.gas !== undefined) {
        const { data: utilitiesData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "utilities",
              item: "gas",
              amount: data.gas,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...utilitiesData);
      }

      if (data.electricity !== undefined) {
        const { data: utilitiesData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "utilities",
              item: "electricity",
              amount: data.electricity,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...utilitiesData);
      }

      if (data.water !== undefined) {
        const { data: utilitiesData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "utilities",
              item: "water",
              amount: data.water,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...utilitiesData);
      }

      return { utilities: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// POST Services and Subscriptions
fastify.post(
  "/api/servicesandsubscriptions",
  { preHandler: verifyAuth, schema: servicesAndSubscriptionsSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.servicesAndSubscriptions;

    try {
      const updates = [];

      if (data.phone !== undefined) {
        const { data: servicesAndSubscriptionsData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "servicesAndSubscriptions",
              item: "phone",
              amount: data.phone,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...servicesAndSubscriptionsData);
      }

      if (data.broadband !== undefined) {
        const { data: servicesAndSubscriptionsData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "servicesAndSubscriptions",
              item: "broadband",
              amount: data.broadband,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...servicesAndSubscriptionsData);
      }

      if (data.subscriptions !== undefined) {
        const { data: servicesAndSubscriptionsData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "servicesAndSubscriptions",
              item: "subscriptions",
              amount: data.subscriptions,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...servicesAndSubscriptionsData);
      }

      return { servicesAndSubscriptions: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// POST Transport and Travel
fastify.post(
  "/api/transportandtravel",
  { preHandler: verifyAuth, schema: transportAndTravelSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.transportAndTravel;

    try {
      const updates = [];

      if (data.vehicleInsurance !== undefined) {
        const { data: transportAndTravelData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "transportAndTravel",
              item: "vehicleInsurance",
              amount: data.vehicleInsurance,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...transportAndTravelData);
      }

      if (data.roadTax !== undefined) {
        const { data: transportAndTravelData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "transportAndTravel",
              item: "roadTax",
              amount: data.roadTax,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...transportAndTravelData);
      }

      if (data.fuel !== undefined) {
        const { data: transportAndTravelData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "transportAndTravel",
              item: "fuel",
              amount: data.fuel,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...transportAndTravelData);
      }

      if (data.breakdownCover !== undefined) {
        const { data: transportAndTravelData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "transportAndTravel",
              item: "breakdownCover",
              amount: data.breakdownCover,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...transportAndTravelData);
      }

      if (data.MOTAndServices !== undefined) {
        const { data: transportAndTravelData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "transportAndTravel",
              item: "MOTAndServices",
              amount: data.MOTAndServices,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...transportAndTravelData);
      }

      if (data.railAndBus !== undefined) {
        const { data: transportAndTravelData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "transportAndTravel",
              item: "railAndBus",
              amount: data.railAndBus,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...transportAndTravelData);
      }

      return { transportAndTravel: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// POST Personal Costs
fastify.post(
  "/api/personal",
  { preHandler: verifyAuth, schema: personalSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.personal;

    try {
      const updates = [];

      if (data.clothingAndFootwear !== undefined) {
        const { data: personalData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "personal",
              item: "clothingAndFootwear",
              amount: data.clothingAndFootwear,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...personalData);
      }

      if (data.hairdressing !== undefined) {
        const { data: personalData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "personal",
              item: "hairdressing",
              amount: data.hairdressing,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...personalData);
      }

      return { personal: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// POST Pets
fastify.post(
  "/api/pets",
  { preHandler: verifyAuth, schema: petsSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.pets;

    try {
      const updates = [];

      if (data.petFood !== undefined) {
        const { data: petsData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "pets",
              item: "petFood",
              amount: data.petFood,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...petsData);
      }

      if (data.insurance !== undefined) {
        const { data: petsData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "pets",
              item: "insurance",
              amount: data.insurance,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...petsData);
      }

      return { pets: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// POST Food and Shopping
fastify.post(
  "/api/foodandshopping",
  { preHandler: verifyAuth, schema: foodAndShoppingSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.foodAndShopping;

    try {
      const updates = [];

      if (data.supermarketShopping !== undefined) {
        const { data: foodAndShoppingData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "foodAndShopping",
              item: "supermarketShopping",
              amount: data.supermarketShopping,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...foodAndShoppingData);
      }

      if (data.mealsOut !== undefined) {
        const { data: foodAndShoppingData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "foodAndShopping",
              item: "mealsOut",
              amount: data.mealsOut,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...foodAndShoppingData);
      }

      return { foodAndShopping: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// POST Accounts and Savings
fastify.post(
  "/api/accountsandsavings",
  { preHandler: verifyAuth, schema: accountsAndSavingsSchema },
  async (request, reply) => {
    const userId = request.user.id;
    const data = request.body.accountsAndSavings;

    try {
      const updates = [];

      if (data.accountFees !== undefined) {
        const { data: accountsAndSavingsData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "accountsAndSavings",
              item: "accountFees",
              amount: data.accountFees,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;

        updates.push(...accountsAndSavingsData);
      }

      if (data.savings !== undefined) {
        const { data: accountsAndSavingsData, error } = await supabase
          .from("budget")
          .upsert(
            {
              user_id: userId,
              category: "accountsAndSavings",
              item: "savings",
              amount: data.savings,
            },
            {
              onConflict: "user_id,category,item",
            },
          )
          .select();

        if (error) throw error;
        updates.push(...accountsAndSavingsData);
      }

      return { accountsAndSavings: updates };
    } catch (error) {
      sendSafeError(reply, error, 500);
      return;
    }
  },
);

// Server start
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
