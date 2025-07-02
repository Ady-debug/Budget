import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import Fastify from "fastify";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "World" };
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
// - Diagram the below for future understanding
// - Create route to GET income info
// - Create route to POST user info
// - Create api.js for API layer
