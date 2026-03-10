import { supabase } from "@/integrations/supabase/client";

async function whmcsCall(action: string, params: Record<string, string> = {}) {
  const { data, error } = await supabase.functions.invoke("whmcs-proxy", {
    body: { action, params },
  });

  if (error) throw new Error(error.message || "WHMCS API call failed");
  if (data?.error) throw new Error(data.error);
  return data;
}

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
