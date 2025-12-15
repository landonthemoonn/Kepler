import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-71558707/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth endpoints
app.post("/make-server-71558707/signup", async (c) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  // Dynamic import to avoid top-level await issues if any, though standard import is fine
  const { createClient } = await import("npm:@supabase/supabase-js@2");
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { email, password, name } = await c.req.json();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true
  });

  if (error) {
    console.error("Signup error:", error);
    return c.json({ error: error.message }, 400);
  }

  return c.json({ data });
});

// Logs endpoints
app.get("/make-server-71558707/logs", async (c) => {
  try {
    const logs = await kv.get("kepler_logs");
    return c.json(logs || []);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return c.json({ error: "Failed to fetch logs" }, 500);
  }
});

app.post("/make-server-71558707/logs", async (c) => {
  try {
    const logs = await c.req.json();
    await kv.set("kepler_logs", logs);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving logs:", error);
    return c.json({ error: "Failed to save logs" }, 500);
  }
});

Deno.serve(app.fetch);