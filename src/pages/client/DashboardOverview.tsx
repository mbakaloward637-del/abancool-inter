import { useState, useEffect } from "react";
import { Server, Globe, FileText, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ services: 0, domains: 0, pendingInvoices: 0, totalSpent: 0 });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [ordersRes, domainsRes, invoicesRes, paymentsRes] = await Promise.all([
        supabase.from("hosting_orders").select("id").eq("status", "active"),
        supabase.from("domains").select("id"),
        supabase.from("invoices").select("*").order("issued_at", { ascending: false }),
        supabase.from("payments").select("amount").eq("status", "completed"),
      ]);

      const unpaid = (invoicesRes.data || []).filter((i: any) => i.status === "unpaid" || i.status === "overdue");
      const total = (paymentsRes.data || []).reduce((s: number, p: any) => s + Number(p.amount), 0);

      setStats({
        services: ordersRes.data?.length || 0,
        domains: domainsRes.data?.length || 0,
        pendingInvoices: unpaid.length,
        totalSpent: total,
      });
      setRecentInvoices((invoicesRes.data || []).slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  const widgets = [
    { icon: Server, label: "Active Services", value: loading ? "..." : String(stats.services), color: "text-primary" },
    { icon: Globe, label: "Active Domains", value: loading ? "..." : String(stats.domains), color: "text-accent" },
    { icon: FileText, label: "Pending Invoices", value: loading ? "..." : String(stats.pendingInvoices), color: "text-destructive" },
    { icon: CreditCard, label: "Total Spent", value: loading ? "..." : `KSh ${stats.totalSpent.toLocaleString()}`, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((w) => (
          <div key={w.label} className="p-5 rounded-xl bg-card border card-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                <w.icon className={`w-5 h-5 ${w.color}`} />
              </div>
              <div>
                <div className="text-2xl font-heading font-bold">{w.value}</div>
                <div className="text-xs text-muted-foreground">{w.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border card-shadow">
        <div className="p-5 border-b">
          <h2 className="font-heading font-semibold">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Invoice</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Service</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No invoices yet</td></tr>
              ) : recentInvoices.map((inv: any) => (
                <tr key={inv.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{inv.invoice_number}</td>
                  <td className="p-3">{inv.service_description || inv.service_type}</td>
                  <td className="p-3">KSh {Number(inv.amount).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === "paid" ? "bg-green-100 text-green-700" :
                      inv.status === "unpaid" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{inv.status}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(inv.issued_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
