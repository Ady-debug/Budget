import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import Fastify from "fastify";
import cors from "@fastify/cors";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: process.env.CLIENT_URL,
});

// Auth Verification Middleware

async function verifyAuth(request, reply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    reply.code(401).send({ error: "No authorization header provided" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    reply.code(401).send({ error: "Invalid or expired token" });
    return;
  }
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
      reply.code(500).send({ error: error.message });
      return;
    }

    return { budget: data };
  }
);

// POST Home Route Check

fastify.get("/", async (request, reply) => {
  return { hello: "World" };
});

// POST Income

fastify.post(
  "/api/income",
  { preHandler: verifyAuth },
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...otherIncomeData);
      }

      return { income: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
);

// POST Home Expense

fastify.post(
  "/api/home_expense",
  { preHandler: verifyAuth },
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
            }
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...homeInsuranceData);
      }

      return { homeExpense: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
);

// POST Utilities

fastify.post(
  "/api/utilities",
  { preHandler: verifyAuth },
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
            }
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...utilitiesData);
      }

      return { utilities: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
);

// POST Services and Subscriptions

fastify.post(
  "/api/servicesandsubscriptions",
  { preHandler: verifyAuth },
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
            }
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...servicesAndSubscriptionsData);
      }

      return { servicesAndSubscriptions: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
);

// POST Transport and Travel

fastify.post(
  "/api/transportandtravel",
  { preHandler: verifyAuth },
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...transportAndTravelData);
      }

      return { transportAndTravel: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
);

// POST Personal Costs

fastify.post(
  "/api/personal",
  { preHandler: verifyAuth },
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...personalData);
      }

      return { personal: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
);

// POST Pets

fastify.post(
  "/api/pets",
  { preHandler: verifyAuth },
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...petsData);
      }

      return { pets: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
);

// POST Food and Shopping

fastify.post(
  "/api/foodandshopping",
  { preHandler: verifyAuth },
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...foodAndShoppingData);
      }

      return { foodAndShopping: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
);

// POST Accounts and Savings

fastify.post(
  "/api/accountsandsavings",
  { preHandler: verifyAuth },
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
            }
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
            }
          )
          .select();

        if (error) throw error;
        updates.push(...accountsAndSavingsData);
      }

      return { accountsAndSavings: updates };
    } catch (error) {
      reply.code(400).send({ error: error.message });
      return;
    }
  }
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
