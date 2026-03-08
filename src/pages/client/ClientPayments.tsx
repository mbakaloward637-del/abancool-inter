const payments = [
  { id: "PAY-001", method: "M-Pesa", ref: "QWE123456", amount: "KSh 6,000", date: "2026-02-15", invoice: "INV-001" },
  { id: "PAY-002", method: "PayPal", ref: "PP-789012", amount: "KSh 3,000", date: "2025-12-20", invoice: "INV-004" },
];

export default function ClientPayments() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Payment History</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {["M-Pesa", "PayPal", "Card Payment", "Bank Transfer"].map((method) => (
          <div key={method} className="p-4 rounded-xl bg-card border card-shadow text-center">
            <div className="text-sm font-medium">{method}</div>
            <div className="text-xs text-muted-foreground mt-1">{method === "M-Pesa" ? "Primary" : "Available"}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border card-shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Payment ID</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Method</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Reference</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{p.id}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3 text-muted-foreground">{p.ref}</td>
                <td className="p-3 font-medium">{p.amount}</td>
                <td className="p-3 text-muted-foreground">{p.date}</td>
                <td className="p-3 text-primary">{p.invoice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
