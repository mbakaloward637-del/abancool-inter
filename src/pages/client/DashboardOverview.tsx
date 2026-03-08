import { Server, Globe, FileText, CreditCard } from "lucide-react";

const widgets = [
  { icon: Server, label: "Active Services", value: "3", color: "text-primary" },
  { icon: Globe, label: "Active Domains", value: "5", color: "text-accent" },
  { icon: FileText, label: "Pending Invoices", value: "2", color: "text-destructive" },
  { icon: CreditCard, label: "Total Spent", value: "KSh 45,000", color: "text-primary" },
];

const recentInvoices = [
  { id: "INV-001", service: "Business Hosting", amount: "KSh 6,000", status: "Paid", date: "2026-02-15" },
  { id: "INV-002", service: "Domain .com", amount: "KSh 1,500", status: "Unpaid", date: "2026-03-01" },
  { id: "INV-003", service: "Bulk SMS Pack", amount: "KSh 5,000", status: "Overdue", date: "2026-01-10" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Welcome back, Client</h1>

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
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{inv.id}</td>
                  <td className="p-3">{inv.service}</td>
                  <td className="p-3">{inv.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === "Paid" ? "bg-green-100 text-green-700" :
                      inv.status === "Unpaid" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
