import { Button } from "@/components/ui/button";

const invoices = [
  { id: "INV-001", service: "Business Hosting", amount: "KSh 6,000", status: "Paid", date: "2026-02-15", due: "2026-02-28" },
  { id: "INV-002", service: "Domain .com", amount: "KSh 1,500", status: "Unpaid", date: "2026-03-01", due: "2026-03-15" },
  { id: "INV-003", service: "Bulk SMS Pack", amount: "KSh 5,000", status: "Overdue", date: "2026-01-10", due: "2026-01-24" },
  { id: "INV-004", service: "Starter Hosting", amount: "KSh 3,000", status: "Paid", date: "2025-12-20", due: "2026-01-03" },
];

export default function ClientInvoices() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Invoices</h1>

      <div className="rounded-xl bg-card border card-shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Invoice</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Service</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Due Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{inv.id}</td>
                <td className="p-3">{inv.service}</td>
                <td className="p-3 font-medium">{inv.amount}</td>
                <td className="p-3 text-muted-foreground">{inv.date}</td>
                <td className="p-3 text-muted-foreground">{inv.due}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    inv.status === "Paid" ? "bg-green-100 text-green-700" :
                    inv.status === "Unpaid" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {inv.status !== "Paid" && <Button size="sm" className="text-xs h-7 gradient-primary text-primary-foreground border-0">Pay</Button>}
                    <Button size="sm" variant="outline" className="text-xs h-7">Download</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
