import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Loader2 } from "lucide-react";

export default function ClientDomains() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("domains").select("*").order("created_at", { ascending: false });
      setDomains(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Domain Management</h1>

      {domains.length === 0 ? (
        <div className="rounded-xl bg-card border card-shadow p-10 text-center space-y-4">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="font-heading text-xl font-semibold">No Domains Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Search and register your first domain to get started.</p>
          <Button onClick={() => window.location.href = "/domains"} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Search Domains
          </Button>
        </div>
      ) : (
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
              {domains.map((d: any) => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{d.name}{d.extension}</td>
                  <td className="p-3">{d.expires_at ? new Date(d.expires_at).toLocaleDateString() : "—"}</td>
                  <td className="p-3 text-muted-foreground">{d.nameservers}</td>
                  <td className="p-3">{d.auto_renew ? "Yes" : "No"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      d.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{d.status}</span>
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
      )}
    </div>
  );
}
