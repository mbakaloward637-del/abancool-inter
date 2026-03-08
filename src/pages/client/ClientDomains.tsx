import { Button } from "@/components/ui/button";

const domains = [
  { name: "example.com", expiry: "2027-03-10", nameservers: "ns1.abancool.com", autoRenew: true, status: "Active" },
  { name: "mysite.co.ke", expiry: "2026-09-15", nameservers: "ns1.abancool.com", autoRenew: false, status: "Active" },
  { name: "startup.africa", expiry: "2026-04-01", nameservers: "ns1.abancool.com", autoRenew: true, status: "Expiring Soon" },
];

export default function ClientDomains() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Domain Management</h1>

      <div className="rounded-xl bg-card border card-shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Domain</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Expiry</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Nameservers</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Auto Renew</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr key={d.name} className="border-b last:border-0">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.expiry}</td>
                <td className="p-3 text-muted-foreground">{d.nameservers}</td>
                <td className="p-3">{d.autoRenew ? "Yes" : "No"}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    d.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="text-xs h-7">Renew</Button>
                    <Button size="sm" variant="outline" className="text-xs h-7">DNS</Button>
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
