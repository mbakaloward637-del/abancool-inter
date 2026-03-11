import { supabase } from "@/integrations/supabase/client";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const FUNCTION_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/whmcs-proxy`;

/** Authenticated WHMCS call (requires logged-in user) */
async function whmcsCall(action: string, params: Record<string, string> = {}) {
  const { data, error } = await supabase.functions.invoke("whmcs-proxy", {
    body: { action, params },
  });

  if (error) throw new Error(error.message || "WHMCS API call failed");
  if (data?.error) throw new Error(data.error);
  return data;
}

/** Public WHMCS call (no auth needed — for products, domain search, etc.) */
async function whmcsPublicCall(action: string, params: Record<string, string> = {}) {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": ANON_KEY,
    },
    body: JSON.stringify({ action, params }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  if (data?.error) throw new Error(data.error);
  return data;
}

// ─── Public endpoints (no auth) ──────────────────────────────────

export async function fetchProducts() {
  const data = await whmcsPublicCall("GetProducts");
  return data?.products?.product || [];
}

export async function checkDomainAvailability(domain: string) {
  const data = await whmcsPublicCall("DomainWhois", { domain });
  return data;
}

export async function fetchTLDPricing() {
  const data = await whmcsPublicCall("GetTLDPricing");
  return data;
}

// ─── Authenticated endpoints ────────────────────────────────────

export async function fetchServices() {
  const data = await whmcsCall("GetClientsProducts");
  return data?.products?.product || [];
}

export async function fetchDomains() {
  const data = await whmcsCall("GetClientsDomains");
  return data?.domains?.domain || [];
}

export async function fetchInvoices(status?: string) {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const data = await whmcsCall("GetInvoices", params);
  return data?.invoices?.invoice || [];
}

export async function fetchTickets() {
  const data = await whmcsCall("GetTickets");
  return data?.tickets?.ticket || [];
}

export async function fetchOrders() {
  const data = await whmcsCall("GetOrders");
  return data?.orders?.order || [];
}

export async function fetchProfile() {
  const data = await whmcsCall("GetClientsDetails");
  return data;
}

export async function updateProfile(params: Record<string, string>) {
  return whmcsCall("UpdateClient", params);
}

export async function openTicket(params: { subject: string; message: string; deptid: string; priority: string }) {
  return whmcsCall("OpenTicket", params as Record<string, string>);
}

export async function createOrder(params: {
  pid: string;
  domain: string;
  billingcycle: string;
  paymentmethod?: string;
}) {
  return whmcsCall("AddOrder", {
    pid: params.pid,
    domain: params.domain,
    billingcycle: params.billingcycle,
    paymentmethod: params.paymentmethod || "mailin",
  } as Record<string, string>);
}

export async function registerDomain(params: {
  domainname: string;
  regperiod: string;
  paymentmethod?: string;
}) {
  return whmcsCall("AddOrder", {
    domaintype: "register",
    domain: params.domainname,
    regperiod: params.regperiod,
    paymentmethod: params.paymentmethod || "mailin",
  } as Record<string, string>);
}
