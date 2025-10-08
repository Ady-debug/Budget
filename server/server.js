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

fastify.post("/", async (request, reply) => {
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

    return { income: updates };
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
