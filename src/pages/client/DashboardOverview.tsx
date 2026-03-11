import { useEffect, useState } from "react";
import { Server, Globe, FileText, Headphones, ArrowRight } from "lucide-react";
import { fetchServices, fetchDomains, fetchInvoices, fetchTickets } from "@/lib/whmcs-api";
import { Link } from "react-router-dom";

interface SummaryCard {
  icon: any;
  label: string;
  count: number;
  color: string;
  link: string;
}

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ services: 0, domains: 0, invoices: 0, tickets: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [services, domains, invoices, tickets] = await Promise.all([
          fetchServices().catch(() => []),
          fetchDomains().catch(() => []),
          fetchInvoices("Unpaid").catch(() => []),
          fetchTickets().catch(() => []),
        ]);
        setStats({
          services: services.length,
          domains: domains.length,
          invoices: invoices.length,
          tickets: tickets.filter((t: any) => t.status === "Open").length,
        });
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards: SummaryCard[] = [
    { icon: Server, label: "Active Services", count: stats.services, color: "bg-primary/10 text-primary", link: "/client/services" },
    { icon: Globe, label: "Domains", count: stats.domains, color: "bg-primary/10 text-primary", link: "/client/domains" },
    { icon: FileText, label: "Unpaid Invoices", count: stats.invoices, color: "bg-destructive/10 text-destructive", link: "/client/billing" },
    { icon: Headphones, label: "Open Tickets", count: stats.tickets, color: "bg-primary/10 text-primary", link: "/client/tickets" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your hosting account</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-card rounded-sm border border-border p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-sm flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            <div className="font-heading text-3xl font-extrabold">
              {loading ? "—" : card.count}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-card rounded-sm border border-border p-6">
        <h2 className="font-heading font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/hosting"
            className="flex items-center gap-3 px-4 py-3 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors text-sm font-medium"
          >
            <Server className="w-4 h-4 text-accent" /> Order Hosting
          </Link>
          <Link
            to="/domains"
            className="flex items-center gap-3 px-4 py-3 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4 text-accent" /> Register Domain
          </Link>
          <Link
            to="/client/tickets"
            className="flex items-center gap-3 px-4 py-3 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors text-sm font-medium"
          >
            <Headphones className="w-4 h-4 text-accent" /> Open Ticket
          </Link>
          <Link
            to="/client/billing"
            className="flex items-center gap-3 px-4 py-3 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4 text-accent" /> View Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}
