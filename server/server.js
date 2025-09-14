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

fastify.get("/api/budget", async (request, reply) => {
  const { data, error } = await supabase
    .from("income")
    .select("budget_item,amount");

  if (error) {
    reply.code(500).send({ error: error.message });
    return;
  }

  return { income: data };
});

fastify.post("/api/income", async (request, reply) => {
  const data = request.body.income;

  try {
    const updates = [];

    if (data.wage !== undefined) {
      const { data: wageData, error } = await supabase
        .from("income")
        .update({ amount: data.wage })
        .eq("budget_item", "wage")
        .select();

      if (error) throw error;

      updates.push(...wageData);
    }

    if (data.otherIncome !== undefined) {
      const { data: otherIncomeData, error } = await supabase
        .from("income")
        .update({ amount: data.otherIncome })
        .eq("budget_item", "otherIncome")
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

fastify.post("/", async (request, reply) => {
  return { hello: "World" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// TODO:
// - Improve GET/POST ROUTES
