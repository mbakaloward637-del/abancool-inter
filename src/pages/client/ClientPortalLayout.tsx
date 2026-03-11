import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Server, Globe, FileText, Headphones, ShoppingCart, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const portalTabs = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/client/dashboard" },
  { icon: Server, label: "Services", path: "/client/services" },
  { icon: Globe, label: "Domains", path: "/client/domains" },
  { icon: FileText, label: "Billing", path: "/client/billing" },
  { icon: Headphones, label: "Tickets", path: "/client/tickets" },
  { icon: ShoppingCart, label: "Orders", path: "/client/orders" },
  { icon: User, label: "Account", path: "/client/account" },
];

export default function ClientPortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      if (!session) navigate("/client/login");
      else setUser(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "https://billing.abancool.com/logout.php";
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
    <div className="min-h-screen flex flex-col bg-section-alt">
      {/* Top Header Bar */}
      <header className="bg-hero text-hero-foreground">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-sm gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-extrabold text-sm">A</span>
              </div>
              <span className="font-heading font-bold text-lg text-hero-foreground">Abancool</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-hero-foreground/70 hidden sm:inline">Welcome, {userName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-hero-foreground/70 hover:text-accent transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Portal Navigation Tabs */}
      <nav className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {portalTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 lg:py-10">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-hero text-hero-foreground/60 text-center py-6 text-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          &copy; {new Date().getFullYear()} Abancool Technology. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
