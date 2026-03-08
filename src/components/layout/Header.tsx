import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const currencies = [
  { code: "KES", symbol: "KSh", label: "KES (KSh)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
];

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  {
    label: "Services",
    path: "/services",
    children: [
      { label: "Web Development", path: "/services/web-development" },
      { label: "Software Development", path: "/services/software-development" },
      { label: "School Management", path: "/services/school-management" },
      { label: "Bulk SMS", path: "/services/bulk-sms" },
      { label: "Payment Integration", path: "/services/payment-integration" },
    ],
  },
  { label: "Hosting", path: "/hosting" },
  { label: "Domains", path: "/domains" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Contact", path: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currency, setCurrency] = useState(currencies[0]);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container-max flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">A</span>
          </div>
          <span className="font-heading font-bold text-lg text-foreground">Abancool</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <DropdownMenu key={link.label}>
                <DropdownMenuTrigger asChild>
                  <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(link.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    {link.label} <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {link.children.map((child) => (
                    <DropdownMenuItem key={child.path} asChild>
                      <Link to={child.path}>{child.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(link.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded border">
                <Globe className="w-3 h-3" />
                {currency.code}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currencies.map((c) => (
                <DropdownMenuItem key={c.code} onClick={() => setCurrency(c)}>
                  {c.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/client/login">
            <Button variant="outline" size="sm">Client Login</Button>
          </Link>
          <Link to="/contact">
            <Button size="sm" className="gradient-primary text-primary-foreground border-0">Get a Quote</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-card p-4 space-y-2">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                to={link.path}
                className="block px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className="block px-6 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="pt-3 flex gap-2">
            <Link to="/client/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">Client Login</Button>
            </Link>
            <Link to="/contact" className="flex-1">
              <Button size="sm" className="w-full gradient-primary text-primary-foreground border-0">Get a Quote</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
