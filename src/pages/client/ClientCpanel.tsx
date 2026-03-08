import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Monitor, HardDrive, Mail, Database, Cpu, Activity, RefreshCw } from "lucide-react";

const CPANEL_URL = "https://cpanel.abancool.com"; // Configure this to your actual cPanel URL

const cpanelStats = [
  { icon: HardDrive, label: "Disk Usage", value: "2.4 GB / 10 GB", percent: 24 },
  { icon: Cpu, label: "CPU Usage", value: "12%", percent: 12 },
  { icon: Database, label: "Databases", value: "3 / 10", percent: 30 },
  { icon: Mail, label: "Email Accounts", value: "5 / 25", percent: 20 },
];

const quickActions = [
  { label: "File Manager", icon: HardDrive, path: "filemanager" },
  { label: "Email Accounts", icon: Mail, path: "email" },
  { label: "Databases", icon: Database, path: "databases" },
  { label: "Resource Usage", icon: Activity, path: "resource_usage" },
];

export default function ClientCpanel() {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">cPanel Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your hosting, files, emails, and databases
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
            onClick={() => window.open(CPANEL_URL, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open cPanel
          </Button>
        </div>
      </div>

      {/* API Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cpanelStats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-card border card-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
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
              onClick={() => window.open(`${CPANEL_URL}/${action.path}`, "_blank")}
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
            src={CPANEL_URL}
            className="w-full border-0"
            style={{ height: "70vh" }}
            title="cPanel"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      )}

      {/* Integration Status */}
      <div className="rounded-xl bg-muted/50 border border-dashed p-5">
        <h3 className="font-heading font-semibold text-sm mb-2">⚙️ Integration Status</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>cPanel URL:</strong> {CPANEL_URL} — Update the <code className="bg-muted px-1 py-0.5 rounded text-[10px]">CPANEL_URL</code> in <code className="bg-muted px-1 py-0.5 rounded text-[10px]">ClientCpanel.tsx</code> to point to your actual cPanel server.
          API stats shown above are placeholders — connect your cPanel/WHM API for live data.
        </p>
      </div>
    </div>
  );
}
