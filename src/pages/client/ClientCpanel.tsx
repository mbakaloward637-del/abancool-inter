import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Monitor, HardDrive, Mail, Database, Cpu, Activity, RefreshCw, Lock, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const quickActions = [
  { label: "File Manager", icon: HardDrive, path: "filemanager" },
  { label: "Email Accounts", icon: Mail, path: "email" },
  { label: "Databases", icon: Database, path: "databases" },
  { label: "Resource Usage", icon: Activity, path: "resource_usage" },
];

interface HostingOrder {
  id: string;
  domain: string | null;
  status: string;
  cpanel_url: string | null;
  cpanel_username: string | null;
  expires_at: string | null;
  hosting_plans: {
    name: string;
    disk_space_gb: number;
    bandwidth_gb: number;
    email_accounts: number;
    databases: number;
  } | null;
}

export default function ClientCpanel() {
  const [showIframe, setShowIframe] = useState(false);
  const [activeOrder, setActiveOrder] = useState<HostingOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHosting() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("hosting_orders")
        .select("id, domain, status, cpanel_url, cpanel_username, expires_at, hosting_plans(name, disk_space_gb, bandwidth_gb, email_accounts, databases)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setActiveOrder(data as HostingOrder | null);
      setLoading(false);
    }
    checkHosting();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-sm gradient-primary flex items-center justify-center animate-pulse">
          <span className="text-primary-foreground font-heading font-bold text-xs">A</span>
        </div>
      </div>
    );
  }

  // No active hosting — show paywall
  if (!activeOrder) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">cPanel Management</h1>
        <div className="rounded-xl bg-card border card-shadow p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-semibold">Hosting Required</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You need an active hosting plan to access cPanel. Purchase a hosting plan and cPanel access will be unlocked automatically once payment is confirmed.
          </p>
          <Link to="/client/dashboard/hosting">
            <Button className="gradient-primary text-primary-foreground border-0 mt-2">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Hosting Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cpanelUrl = activeOrder.cpanel_url || "https://cpanel.abancool.com";
  const plan = activeOrder.hosting_plans;

  const cpanelStats = [
    { icon: HardDrive, label: "Disk Space", value: `${plan?.disk_space_gb || 0} GB`, percent: 24 },
    { icon: Cpu, label: "CPU Usage", value: "12%", percent: 12 },
    { icon: Database, label: "Databases", value: `0 / ${plan?.databases || 0}`, percent: 0 },
    { icon: Mail, label: "Email Accounts", value: `0 / ${plan?.email_accounts || 0}`, percent: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">cPanel Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {plan?.name} Plan • {activeOrder.domain || "No domain set"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIframe(!showIframe)}
            className="rounded-sm"
          >
            <Monitor className="w-4 h-4 mr-2" />
            {showIframe ? "Hide Panel" : "Embedded View"}
          </Button>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm"
            onClick={() => window.open(cpanelUrl, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open cPanel
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cpanelStats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-card border card-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-sm font-heading font-bold">{stat.value}</div>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${stat.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl bg-card border card-shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold">Quick Actions</h2>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <RefreshCw className="w-3 h-3 mr-1" /> Refresh Stats
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => window.open(`${cpanelUrl}/${action.path}`, "_blank")}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors group"
            >
              <action.icon className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Embedded cPanel iframe */}
      {showIframe && (
        <div className="rounded-xl bg-card border card-shadow overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-heading font-semibold text-sm">cPanel — Embedded View</h2>
            <span className="text-[10px] text-muted-foreground">
              If cPanel doesn't load, ensure CORS is configured on your server
            </span>
          </div>
          <iframe
            src={cpanelUrl}
            className="w-full border-0"
            style={{ height: "70vh" }}
            title="cPanel"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      )}
    </div>
  );
}
