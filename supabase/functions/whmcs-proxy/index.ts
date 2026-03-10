import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WHMCS_API_URL = "https://abancool.com/clients/includes/api.php";

const ALLOWED_ACTIONS = [
  "GetClientsProducts",
  "GetClientsDomains",
  "GetInvoices",
  "GetTickets",
  "GetOrders",
  "GetClientsDetails",
  "UpdateClient",
  "OpenTicket",
  "GetClients",
  "AddClient",
];

async function whmcsRequest(action: string, params: Record<string, string> = {}) {
  // Note: secret name has typo in storage — WHMCS_IDENTFIER (missing I)
  const identifier = Deno.env.get("WHMCS_IDENTFIER");
  const secret = Deno.env.get("WHMCS_SECRET");

  if (!identifier || !secret) {
    throw new Error("WHMCS credentials not configured");
  }

  const body = new URLSearchParams({
    identifier,
    secret,
    action,
    responsetype: "json",
    ...params,
  });

  const response = await fetch(WHMCS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`WHMCS API returned ${response.status}`);
  }

  return response.json();
}

async function getWhmcsClientId(email: string): Promise<string | null> {
  const data = await whmcsRequest("GetClients", { search: email, limitnum: "1" });
  if (data.result === "success" && data.numreturned > 0) {
    const clients = data.clients?.client;
    if (clients && clients.length > 0) {
      return String(clients[0].id);
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate via Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, params = {} } = await req.json();

    if (!action || !ALLOWED_ACTIONS.includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid or disallowed action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map user email to WHMCS client ID
    const clientId = await getWhmcsClientId(user.email!);
    if (!clientId && action !== "AddClient") {
      return new Response(
        JSON.stringify({ error: "No WHMCS account found for this email. Please register at https://abancool.com/clients/register.php" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Inject client ID into params based on action
    const actionParams: Record<string, string> = { ...params };
    if (clientId) {
      switch (action) {
        case "GetClientsProducts":
        case "GetClientsDomains":
        case "GetTickets":
        case "GetClientsDetails":
        case "UpdateClient":
          actionParams.clientid = clientId;
          break;
        case "GetInvoices":
        case "GetOrders":
          actionParams.userid = clientId;
          break;
        case "OpenTicket":
          actionParams.clientid = clientId;
          break;
      }
    }

    const data = await whmcsRequest(action, actionParams);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("WHMCS proxy error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
