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

fastify.get("/api/income", async (request, reply) => {
  const { data, error } = await supabase
    .from("income")
    .select("income_type,amount");

  if (error) {
    reply.code(500).send({ error: error.message });
    return;
  }

  return { income: data };
});

fastify.post("/api/income", async (request, reply) => {
  console.log(request.body);

  // UPDATE BELOW ONCE ROUTE TESTED IN API CLIENT
  //   const { data, error } = await supabase
  //     .from("income")
  //     .insert([request.body])
  //     .select();

  //   if (error) {
  //     reply.code(400).send({ error: error.message });
  //     return;
  //   }

  //   return { income: data[0] };
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
// - Create api.js for API layer
// - Improve GET/POST ROUTES
