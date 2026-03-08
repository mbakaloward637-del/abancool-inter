import { Button } from "@/components/ui/button";

const hostingServices = [
  {
    plan: "Business Hosting",
    domain: "example.com",
    ip: "192.168.1.100",
    disk: { used: 8, total: 20 },
    bandwidth: { used: 45, total: 100 },
    expiry: "2027-02-15",
    status: "Active",
  },
  {
    plan: "Starter Hosting",
    domain: "mysite.co.ke",
    ip: "192.168.1.101",
    disk: { used: 2, total: 5 },
    bandwidth: { used: 10, total: 20 },
    expiry: "2026-08-20",
    status: "Active",
  },
];

export default function ClientHosting() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Hosting Services</h1>

      <div className="space-y-4">
        {hostingServices.map((h) => (
          <div key={h.domain} className="rounded-xl bg-card border card-shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-heading font-semibold text-lg">{h.plan}</h3>
                <p className="text-sm text-muted-foreground">{h.domain} • {h.ip}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 w-fit">{h.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Disk Usage</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: `${(h.disk.used / h.disk.total) * 100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{h.disk.used}GB / {h.disk.total}GB</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Bandwidth</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: `${(h.bandwidth.used / h.bandwidth.total) * 100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{h.bandwidth.used}GB / {h.bandwidth.total}GB</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Expires</div>
                <div className="text-sm font-medium">{h.expiry}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">Renew</Button>
              <Button size="sm" variant="outline">Upgrade</Button>
              <Button size="sm" variant="outline">Support Ticket</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
