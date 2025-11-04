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

// POST ServicesAndSubscriptions

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
