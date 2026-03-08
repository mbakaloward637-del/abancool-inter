import { useEffect, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Server, Globe, FileText, CreditCard, Headphones, User, LogOut, Monitor, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/client/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/client/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/client/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-sm gradient-primary flex items-center justify-center animate-pulse">
          <span className="text-primary-foreground font-heading font-bold">A</span>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Client";

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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-hero-foreground/70 hover:text-hero-foreground hover:bg-hero-foreground/5">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-hero text-hero-foreground flex flex-col">
            <div className="p-4 border-b border-hero-foreground/10 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-heading font-bold text-sm">A</span>
                </div>
                <span className="font-heading font-bold">Abancool</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-hero-foreground" /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-hero-foreground/70 hover:text-hero-foreground hover:bg-hero-foreground/5"
                    }`}>
                    <link.icon className="w-4 h-4" /> {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-hero-foreground/10">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-hero-foreground/70 hover:text-hero-foreground hover:bg-hero-foreground/5">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b flex items-center px-6 justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-heading font-semibold">Welcome, {userName}</h2>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
