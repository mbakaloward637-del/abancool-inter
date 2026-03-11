import { useEffect, useState } from "react";
import { fetchServices } from "@/lib/whmcs-api";
import { Server, Loader2, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function ClientServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "suspended": return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-extrabold">My Services</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your hosting services</p>
        </div>
        <Link
          to="/hosting"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-sm text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          Order New Hosting
        </Link>
      </div>

      <div className="bg-card rounded-sm border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <Server className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No services found</p>
            <Link to="/hosting" className="text-accent text-sm hover:underline mt-1 inline-block">
              Order a hosting plan →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Service</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Domain</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Billing Cycle</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Next Due</th>
                  <th className="text-right px-6 py-3.5 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s: any) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{s.name || s.groupname}</td>
                    <td className="px-6 py-4 text-muted-foreground">{s.domain || "—"}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={statusColor(s.status)}>{s.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{s.billingcycle}</td>
                    <td className="px-6 py-4 text-muted-foreground">{s.nextduedate}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Settings className="w-3.5 h-3.5" /> Managed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
