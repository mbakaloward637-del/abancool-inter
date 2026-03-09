/**
 * Abancool PHP Backend API Service
 * Centralized API layer with auth, error handling, retry, and fallback to Supabase.
 */
import { supabase } from "@/integrations/supabase/client";

// ─── Configuration ───────────────────────────────────────────────
// Change this to your deployed PHP backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.abancool.com";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

// ─── Auth Headers ────────────────────────────────────────────────
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }
  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

// ─── Typed API Response ──────────────────────────────────────────
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
  source: "api" | "fallback";
}

// ─── Core Fetch with Retry ───────────────────────────────────────
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      // Don't retry on auth errors or validation errors
      if (response.status === 401 || response.status === 400 || response.status === 403) {
        return response;
      }

      // Retry on server errors
      if (response.status >= 500 && i < retries) {
        lastError = new Error(`Server error: ${response.status}`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (i + 1)));
        continue;
      }

      return response;
    } catch (err: any) {
      lastError = err;
      if (i < retries && err.name !== "AbortError") {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (i + 1)));
      }
    }
  }

  throw lastError || new Error("Request failed after retries");
}

// ─── Public API Methods ──────────────────────────────────────────

/**
 * GET request to the PHP backend.
 */
export async function apiGet<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchWithRetry(`${API_BASE}${endpoint}`, {
      method: "GET",
      headers,
    });
    const data = await res.json();

    if (!res.ok) {
      return { data: null, error: data.error || `HTTP ${res.status}`, status: res.status, source: "api" };
    }
    return { data, error: null, status: res.status, source: "api" };
  } catch (err: any) {
    console.warn(`API GET ${endpoint} failed:`, err.message);
    return { data: null, error: err.message, status: 0, source: "api" };
  }
}

/**
 * POST request to the PHP backend.
 */
export async function apiPost<T = any>(endpoint: string, body: Record<string, any>): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchWithRetry(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      return { data: null, error: data.error || `HTTP ${res.status}`, status: res.status, source: "api" };
    }
    return { data, error: null, status: res.status, source: "api" };
  } catch (err: any) {
    console.warn(`API POST ${endpoint} failed:`, err.message);
    return { data: null, error: err.message, status: 0, source: "api" };
  }
}

// ─── cPanel / Panel API ──────────────────────────────────────────

export interface PanelStatus {
  has_hosting: boolean;
  plan_name?: string;
  domain?: string;
  cpanel_username?: string;
  expires_at?: string;
  status?: string;
  redirect?: string;
}

export interface PanelStats {
  disk: { used_mb: number; limit_mb: number; percent: number };
  bandwidth: { used_mb: number; limit_mb: number; percent: number };
  email: { count: number; limit: number };
  databases: { count: number; limit: number };
  plan_name: string;
  status: string;
  panel_type: "cpanel" | "directadmin";
  expires_at: string | null;
  provisioned: boolean;
}

export interface SsoResponse {
  url: string;
  panel: "cpanel" | "directadmin";
}

/**
 * Check if user has active hosting. Falls back to Supabase.
 */
export async function checkHostingStatus(): Promise<PanelStatus> {
  const res = await apiGet<PanelStatus>("/api/cpanel/status");

  if (res.data) return res.data;

  // Fallback: query Supabase directly
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { has_hosting: false };

  const { data } = await supabase
    .from("hosting_orders")
    .select("id, domain, status, cpanel_url, cpanel_username, expires_at, hosting_plans(name)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { has_hosting: false };

  return {
    has_hosting: true,
    plan_name: (data.hosting_plans as any)?.name,
    domain: data.domain ?? undefined,
    cpanel_username: data.cpanel_username ?? undefined,
    expires_at: data.expires_at ?? undefined,
    status: data.status,
  };
}

/**
 * Get real-time panel stats. Falls back to plan-based estimates.
 */
export async function getPanelStats(): Promise<PanelStats | null> {
  const res = await apiGet<PanelStats>("/api/cpanel/stats");

  if (res.data) return res.data;

  // Fallback: build from Supabase data
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("hosting_orders")
    .select("*, hosting_plans(name, disk_space_gb, bandwidth_gb, email_accounts, databases)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const plan = data.hosting_plans as any;
  return {
    disk: { used_mb: 0, limit_mb: (plan?.disk_space_gb || 0) * 1024, percent: 0 },
    bandwidth: { used_mb: 0, limit_mb: (plan?.bandwidth_gb || 0) * 1024, percent: 0 },
    email: { count: 0, limit: plan?.email_accounts || 0 },
    databases: { count: 0, limit: plan?.databases || 0 },
    plan_name: plan?.name || "Hosting",
    status: data.status,
    panel_type: "cpanel",
    expires_at: data.expires_at,
    provisioned: !!data.cpanel_username,
  };
}

/**
 * Get SSO auto-login URL.
 */
export async function getSsoUrl(): Promise<SsoResponse | null> {
  const res = await apiGet<SsoResponse>("/api/cpanel/sso");
  return res.data;
}

// ─── Payment API ─────────────────────────────────────────────────

export interface MpesaResponse {
  success: boolean;
  checkout_request_id?: string;
  message?: string;
  error?: string;
}

export interface StripeIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

/**
 * Initiate M-Pesa STK Push via PHP backend.
 * Falls back to creating a local pending payment record.
 */
export async function initiateMpesaPayment(invoiceId: string, phone: string): Promise<MpesaResponse> {
  const res = await apiPost<MpesaResponse>("/api/payments/mpesa", {
    invoice_id: invoiceId,
    phone,
  });

  if (res.data?.success) return res.data;

  // If PHP backend is unavailable, create pending payment locally
  if (res.status === 0) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data: invoice } = await supabase
      .from("invoices")
      .select("amount")
      .eq("id", invoiceId)
      .maybeSingle();

    if (!invoice) return { success: false, error: "Invoice not found" };

    await supabase.from("payments").insert({
      user_id: user.id,
      invoice_id: invoiceId,
      method: "mpesa",
      amount: invoice.amount,
      currency: "KES",
      status: "pending",
      reference: `STK-${Date.now()}`,
    });

    return {
      success: true,
      message: "Payment recorded locally. Backend confirmation pending.",
    };
  }

  return { success: false, error: res.error || "Payment failed" };
}

/**
 * Create Stripe PaymentIntent via PHP backend.
 */
export async function createStripeIntent(invoiceId: string): Promise<StripeIntentResponse | null> {
  const res = await apiPost<StripeIntentResponse>("/api/payments/stripe/intent", {
    invoice_id: invoiceId,
  });
  return res.data;
}

/**
 * Poll invoice status until paid or timeout.
 */
export function pollInvoiceStatus(
  invoiceId: string,
  onPaid: () => void,
  maxAttempts = 24,
  intervalMs = 5000
): () => void {
  let attempts = 0;
  const interval = setInterval(async () => {
    attempts++;
    const { data } = await supabase
      .from("invoices")
      .select("status")
      .eq("id", invoiceId)
      .maybeSingle();

    if (data?.status === "paid") {
      clearInterval(interval);
      onPaid();
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(interval);
}

// ─── Dashboard Stats ─────────────────────────────────────────────

export interface DashboardStats {
  services: number;
  domains: number;
  pendingInvoices: number;
  totalSpent: number;
}

export async function getDashboardStats(): Promise<{ stats: DashboardStats; invoices: any[]; payments: any[] }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { stats: { services: 0, domains: 0, pendingInvoices: 0, totalSpent: 0 }, invoices: [], payments: [] };

  const [ordersRes, domainsRes, invoicesRes, paymentsRes] = await Promise.all([
    supabase.from("hosting_orders").select("id").eq("status", "active"),
    supabase.from("domains").select("id"),
    supabase.from("invoices").select("*").order("issued_at", { ascending: false }),
    supabase.from("payments").select("*").order("created_at", { ascending: false }),
  ]);

  const invoices = invoicesRes.data || [];
  const payments = paymentsRes.data || [];
  const unpaid = invoices.filter((i: any) => i.status === "unpaid" || i.status === "overdue");
  const completed = payments.filter((p: any) => p.status === "completed");
  const total = completed.reduce((s: number, p: any) => s + Number(p.amount), 0);

  return {
    stats: {
      services: ordersRes.data?.length || 0,
      domains: domainsRes.data?.length || 0,
      pendingInvoices: unpaid.length,
      totalSpent: total,
    },
    invoices,
    payments,
  };
}
