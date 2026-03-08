import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Server, Globe, FileText, CreditCard, Headphones, User, LogOut, Monitor } from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/client/dashboard" },
  { icon: Monitor, label: "cPanel", path: "/client/dashboard/cpanel" },
  { icon: Server, label: "Hosting", path: "/client/dashboard/hosting" },
  { icon: Globe, label: "Domains", path: "/client/dashboard/domains" },
  { icon: FileText, label: "Invoices", path: "/client/dashboard/invoices" },
  { icon: CreditCard, label: "Payments", path: "/client/dashboard/payments" },
  { icon: Headphones, label: "Support", path: "/client/dashboard/support" },
  { icon: User, label: "Profile", path: "/client/dashboard/profile" },
];

export default function ClientDashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-section-alt">
      {/* Sidebar */}
      <aside className="w-64 bg-hero text-hero-foreground flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-4 border-b border-hero-foreground/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-sm">A</span>
            </div>
            <span className="font-heading font-bold">Abancool</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-hero-foreground/70 hover:text-hero-foreground hover:bg-hero-foreground/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-hero-foreground/10">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-hero-foreground/70 hover:text-hero-foreground hover:bg-hero-foreground/5">
            <LogOut className="w-4 h-4" /> Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b flex items-center px-6">
          <h2 className="font-heading font-semibold">Client Dashboard</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
