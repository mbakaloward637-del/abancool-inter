import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Check, ShoppingCart, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HostingPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  disk_space_gb: number;
  bandwidth_gb: number;
  email_accounts: number;
  databases: number;
  features: string[];
}

interface HostingOrder {
  id: string;
  plan_id: string;
  domain: string | null;
  status: string;
  billing_cycle: string;
  amount_paid: number;
  expires_at: string | null;
  created_at: string;
  hosting_plans: { name: string } | null;
}

export default function ClientHosting() {
  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [orders, setOrders] = useState<HostingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      const [plansRes, ordersRes] = await Promise.all([
        supabase.from("hosting_plans").select("*").eq("is_active", true).order("price_monthly"),
        supabase.from("hosting_orders")
          .select("id, plan_id, domain, status, billing_cycle, amount_paid, expires_at, created_at, hosting_plans(name)")
          .order("created_at", { ascending: false }),
      ]);
      setPlans((plansRes.data || []) as HostingPlan[]);
      setOrders((ordersRes.data || []) as HostingOrder[]);
      setLoading(false);
    }
    load();
  }, []);

  const handlePurchase = (plan: HostingPlan) => {
    // This will trigger the payment flow (M-Pesa / Stripe) once integrated
    toast({
      title: "Payment Integration Coming Soon",
      description: `To purchase the ${plan.name} plan (KSh ${billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly}/${billingCycle === "monthly" ? "mo" : "yr"}), payment via M-Pesa or Stripe will be available shortly.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-sm gradient-primary flex items-center justify-center animate-pulse">
          <span className="text-primary-foreground font-heading font-bold text-xs">A</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Hosting Services</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a plan to get started. cPanel access is activated immediately after payment.
        </p>
      </div>

      {/* Active Orders */}
      {orders.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-lg">Your Hosting</h2>
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl bg-card border card-shadow p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-semibold">{order.hosting_plans?.name || "Hosting"}</h3>
                <p className="text-sm text-muted-foreground">
                  {order.domain || "No domain"} • {order.billing_cycle} • KSh {order.amount_paid}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                order.status === "active" ? "bg-green-100 text-green-700" :
                order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            billingCycle === "monthly" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            billingCycle === "yearly" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Yearly <span className="text-xs opacity-75">(Save 2 months)</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan, i) => {
          const isPopular = i === 2; // Business plan
          const price = billingCycle === "monthly" ? plan.price_monthly : (plan.price_yearly || plan.price_monthly * 10);
          const features = Array.isArray(plan.features) ? plan.features : [];

          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 flex flex-col relative ${
                isPopular ? "border-accent bg-accent/5 card-shadow" : "bg-card card-shadow"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}
              <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-3xl font-heading font-bold">KSh {price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>
              <div className="space-y-2 mb-6 flex-1">
                <div className="text-xs text-muted-foreground">{plan.disk_space_gb}GB Disk • {plan.bandwidth_gb}GB BW • {plan.email_accounts} Emails • {plan.databases} DBs</div>
                {features.map((f) => (
                  <div key={String(f)} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{String(f)}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handlePurchase(plan)}
                className={isPopular ? "gradient-primary text-primary-foreground border-0" : ""}
                variant={isPopular ? "default" : "outline"}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Purchase Plan
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
