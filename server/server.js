import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import Fastify from "fastify";
import cors from "@fastify/cors";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: process.env.CLIENT_URL,
});

// GET Budget

fastify.get("/api/budget", async (request, reply) => {
  const { data, error } = await supabase
    .from("budget")
    .select("category,item,amount");

  if (error) {
    reply.code(500).send({ error: error.message });
    return;
  }

  return { budget: data };
});

// POST Home Route Check

fastify.get("/", async (request, reply) => {
  return { hello: "World" };
});

// POST Income

fastify.post("/api/income", async (request, reply) => {
  const data = request.body.income;

  try {
    const updates = [];

    if (data.wage !== undefined) {
      const { data: wageData, error } = await supabase
        .from("budget")
        .update({ amount: data.wage })
        .eq("category", "income")
        .eq("item", "wage")
        .select();

      if (error) throw error;

      updates.push(...wageData);
    }

    if (data.otherIncome !== undefined) {
      const { data: otherIncomeData, error } = await supabase
        .from("budget")
        .update({ amount: data.otherIncome })
        .eq("category", "income")
        .eq("item", "otherIncome")
        .select();

      if (error) throw error;
      updates.push(...otherIncomeData);
    }

    return { income: updates };
  } catch (error) {
    reply.code(400).send({ error: error.message });
    return;
  }
});

// POST Home Expense

fastify.post("/api/home_expense", async (request, reply) => {
  const data = request.body.homeExpense;
  console.log(data);

  try {
    const updates = [];

    if (data.mortgage !== undefined) {
      const { data: mortgageData, error } = await supabase
        .from("budget")
        .update({ amount: data.mortgage })
        .eq("category", "homeExpense")
        .eq("item", "mortgage")
        .select();

      if (error) throw error;

      updates.push(...mortgageData);
    }

    if (data.councilTax !== undefined) {
      const { data: councilTaxData, error } = await supabase
        .from("budget")
        .update({ amount: data.councilTax })
        .eq("category", "homeExpense")
        .eq("item", "councilTax")
        .select();

      if (error) throw error;
      updates.push(...councilTaxData);
    }

    if (data.homeInsurance !== undefined) {
      const { data: homeInsuranceData, error } = await supabase
        .from("budget")
        .update({ amount: data.homeInsurance })
        .eq("category", "homeExpense")
        .eq("item", "homeInsurance")
        .select();

      if (error) throw error;
      updates.push(...homeInsuranceData);
    }

    return { homeExpense: updates };
  } catch (error) {
    reply.code(400).send({ error: error.message });
    return;
  }
});

// POST Utilities

fastify.post("/api/utilities", async (request, reply) => {
  const data = request.body.utilities;

  try {
    const updates = [];

    if (data.gas !== undefined) {
      const { data: utilitiesData, error } = await supabase
        .from("budget")
        .update({ amount: data.gas })
        .eq("category", "utilities")
        .eq("item", "gas")
        .select();

      if (error) throw error;

      updates.push(...utilitiesData);
    }

    if (data.electricity !== undefined) {
      const { data: utilitiesData, error } = await supabase
        .from("budget")
        .update({ amount: data.electricity })
        .eq("category", "utilities")
        .eq("item", "electricity")
        .select();

      if (error) throw error;
      updates.push(...utilitiesData);
    }

    if (data.water !== undefined) {
      const { data: utilitiesData, error } = await supabase
        .from("budget")
        .update({ amount: data.water })
        .eq("category", "utilities")
        .eq("item", "water")
        .select();

      if (error) throw error;
      updates.push(...utilitiesData);
    }

    return { utilities: updates };
  } catch (error) {
    reply.code(400).send({ error: error.message });
    return;
  }
});

// POST Services and Subscriptions

fastify.post("/api/servicesandsubscriptions", async (request, reply) => {
  const data = request.body.servicesAndSubscriptions;

  try {
    const updates = [];

    if (data.phone !== undefined) {
      const { data: servicesAndSubscriptionsData, error } = await supabase
        .from("budget")
        .update({ amount: data.phone })
        .eq("category", "servicesAndSubscriptions")
        .eq("item", "phone")
        .select();

      if (error) throw error;

      updates.push(...servicesAndSubscriptionsData);
    }

    if (data.broadband !== undefined) {
      const { data: servicesAndSubscriptionsData, error } = await supabase
        .from("budget")
        .update({ amount: data.broadband })
        .eq("category", "servicesAndSubscriptions")
        .eq("item", "broadband")
        .select();

      if (error) throw error;
      updates.push(...servicesAndSubscriptionsData);
    }

    if (data.subscriptions !== undefined) {
      const { data: servicesAndSubscriptionsData, error } = await supabase
        .from("budget")
        .update({ amount: data.subscriptions })
        .eq("category", "servicesAndSubscriptions")
        .eq("item", "subscriptions")
        .select();

      if (error) throw error;
      updates.push(...servicesAndSubscriptionsData);
    }

    return { servicesAndSubscriptions: updates };
  } catch (error) {
    reply.code(400).send({ error: error.message });
    return;
  }
});

// POST Transport and Travel

fastify.post("/api/transportandtravel", async (request, reply) => {
  const data = request.body.transportAndTravel;

  try {
    const updates = [];

    if (data.vehicleInsurance !== undefined) {
      const { data: transportAndTravelData, error } = await supabase
        .from("budget")
        .update({ amount: data.vehicleInsurance })
        .eq("category", "transportAndTravel")
        .eq("item", "vehicleInsurance")
        .select();

      if (error) throw error;

      updates.push(...transportAndTravelData);
    }

    if (data.roadTax !== undefined) {
      const { data: transportAndTravelData, error } = await supabase
        .from("budget")
        .update({ amount: data.roadTax })
        .eq("category", "transportAndTravel")
        .eq("item", "roadTax")
        .select();

      if (error) throw error;
      updates.push(...transportAndTravelData);
    }

    if (data.fuel !== undefined) {
      const { data: transportAndTravelData, error } = await supabase
        .from("budget")
        .update({ amount: data.fuel })
        .eq("category", "transportAndTravel")
        .eq("item", "fuel")
        .select();

      if (error) throw error;
      updates.push(...transportAndTravelData);
    }

    if (data.breakdownCover !== undefined) {
      const { data: transportAndTravelData, error } = await supabase
        .from("budget")
        .update({ amount: data.breakdownCover })
        .eq("category", "transportAndTravel")
        .eq("item", "breakdownCover")
        .select();

      if (error) throw error;
      updates.push(...transportAndTravelData);
    }

    if (data.MOTAndServices !== undefined) {
      const { data: transportAndTravelData, error } = await supabase
        .from("budget")
        .update({ amount: data.MOTAndServices })
        .eq("category", "transportAndTravel")
        .eq("item", "MOTAndServices")
        .select();

      if (error) throw error;
      updates.push(...transportAndTravelData);
    }

    if (data.railAndBus !== undefined) {
      const { data: transportAndTravelData, error } = await supabase
        .from("budget")
        .update({ amount: data.railAndBus })
        .eq("category", "transportAndTravel")
        .eq("item", "railAndBus")
        .select();

      if (error) throw error;
      updates.push(...transportAndTravelData);
    }

    return { transportAndTravel: updates };
  } catch (error) {
    reply.code(400).send({ error: error.message });
    return;
  }
});

// POST Personal Costs

fastify.post("/api/personal", async (request, reply) => {
  const data = request.body.personal;

  try {
    const updates = [];

    if (data.clothingAndFootwear !== undefined) {
      const { data: personalData, error } = await supabase
        .from("budget")
        .update({ amount: data.clothingAndFootwear })
        .eq("category", "personal")
        .eq("item", "clothingAndFootwear")
        .select();

      if (error) throw error;

      updates.push(...personalData);
    }

    if (data.hairdressing !== undefined) {
      const { data: personalData, error } = await supabase
        .from("budget")
        .update({ amount: data.hairdressing })
        .eq("category", "personal")
        .eq("item", "hairdressing")
        .select();

      if (error) throw error;
      updates.push(...personalData);
    }

    return { personal: updates };
  } catch (error) {
    reply.code(400).send({ error: error.message });
    return;
  }
});

// POST Pets

fastify.post("/api/pets", async (request, reply) => {
  const data = request.body.pets;

  try {
    const updates = [];

    if (data.petFood !== undefined) {
      const { data: petsData, error } = await supabase
        .from("budget")
        .update({ amount: data.petFood })
        .eq("category", "pets")
        .eq("item", "petFood")
        .select();

      if (error) throw error;

      updates.push(...petsData);
    }

    if (data.insurance !== undefined) {
      const { data: petsData, error } = await supabase
        .from("budget")
        .update({ amount: data.insurance })
        .eq("category", "pets")
        .eq("item", "insurance")
        .select();

      if (error) throw error;
      updates.push(...petsData);
    }

    return { pets: updates };
  } catch (error) {
    reply.code(400).send({ error: error.message });
    return;
  }
});

// POST Food and Shopping

fastify.post("/api/foodandshopping", async (request, reply) => {
  const data = request.body.foodAndShopping;

  try {
    const updates = [];

    if (data.supermarketShopping !== undefined) {
      const { data: foodAndShoppingData, error } = await supabase
        .from("budget")
        .update({ amount: data.supermarketShopping })
        .eq("category", "foodAndShopping")
        .eq("item", "supermarketShopping")
        .select();

      if (error) throw error;

      updates.push(...foodAndShoppingData);
    }

    if (data.mealsOut !== undefined) {
      const { data: foodAndShoppingData, error } = await supabase
        .from("budget")
        .update({ amount: data.mealsOut })
        .eq("category", "foodAndShopping")
        .eq("item", "mealsOut")
        .select();

      if (error) throw error;
      updates.push(...foodAndShoppingData);
    }

    return { foodAndShopping: updates };
  } catch (error) {
    reply.code(400).send({ error: error.message });
    return;
  }
});

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
