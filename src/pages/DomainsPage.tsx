import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, ArrowRight, Shield, RefreshCw, Lock, Headphones, CheckCircle2, ShoppingCart, Loader2, X, Plus, Minus, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkDomainAvailability, registerDomain } from "@/lib/whmcs-api";
import datacenter from "@/assets/hero-datacenter.jpg";

const defaultExtensions = [".com", ".net", ".org", ".co.ke", ".africa", ".tech", ".online", ".store"];

const domainFeatures = [
  { icon: Shield, title: "WHOIS Privacy", desc: "Free domain privacy protection" },
  { icon: RefreshCw, title: "Auto Renewal", desc: "Never lose your domain" },
  { icon: Lock, title: "Domain Lock", desc: "Prevent unauthorized transfers" },
  { icon: Headphones, title: "DNS Management", desc: "Full DNS control panel" },
];

type SearchResult = { domain: string; ext: string; available: boolean; status: string };

export default function DomainsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [cart, setCart] = useState<SearchResult[]>([]);
  const [regYears, setRegYears] = useState<Record<string, number>>({});
  const [registering, setRegistering] = useState(false);

  const cleanDomain = (input: string) => {
    let d = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
    const base = d.replace(/\.[a-z.]+$/, "") || d;
    return base;
  };

  const handleSearch = useCallback(async () => {
    const base = cleanDomain(query);
    if (!base || base.length < 2) {
      toast({ title: "Invalid domain", description: "Please enter at least 2 characters.", variant: "destructive" });
      return;
    }
    setSearching(true);
    setSearched(false);
    setResults([]);

    const searchResults: SearchResult[] = [];

    // Check each extension via WHMCS DomainWhois
    const checks = defaultExtensions.map(async (ext) => {
      const fullDomain = `${base}${ext}`;
      try {
        const data = await checkDomainAvailability(fullDomain);
        searchResults.push({
          domain: fullDomain,
          ext,
          available: data?.status === "available",
          status: data?.status || "unknown",
        });
      } catch {
        searchResults.push({ domain: fullDomain, ext, available: false, status: "error" });
      }
    });

    await Promise.allSettled(checks);
    // Sort: available first
    searchResults.sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1));
    setResults(searchResults);
    setSearched(true);
    setSearching(false);
  }, [query, toast]);

  const addToCart = (r: SearchResult) => {
    if (cart.find((c) => c.domain === r.domain)) return;
    setCart([...cart, r]);
    setRegYears((prev) => ({ ...prev, [r.domain]: 1 }));
    toast({ title: "Added to cart", description: `${r.domain} added.` });
  };

  const removeFromCart = (domain: string) => {
    setCart(cart.filter((c) => c.domain !== domain));
    setRegYears((prev) => { const n = { ...prev }; delete n[domain]; return n; });
  };

  const updateYears = (domain: string, delta: number) => {
    setRegYears((prev) => {
      const current = prev[domain] || 1;
      const next = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [domain]: next };
    });
  };

  const handleRegisterDomains = async () => {
    if (cart.length === 0) {
      toast({ title: "Empty cart", description: "Add at least one domain to register.", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to register domains." });
      sessionStorage.setItem("domain_cart", JSON.stringify({ cart, regYears }));
      navigate("/client/login");
      return;
    }

    setRegistering(true);
    try {
      for (const c of cart) {
        await registerDomain({
          domainname: c.domain,
          regperiod: String(regYears[c.domain] || 1),
        });
      }
      toast({ title: "Domains ordered!", description: "Your domain registration orders have been placed. Check billing for invoices." });
      setCart([]);
      setRegYears({});
      navigate("/client/billing");
    } catch (e: any) {
      toast({ title: "Registration failed", description: e.message, variant: "destructive" });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      {/* Hero with search */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={datacenter} alt="Infrastructure" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-hero/85" />
        </div>
        <div className="relative container-max px-4 lg:px-8 py-20 text-center">
          <span className="section-label justify-center !text-accent">Domain Registration</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight mb-4">
            Find Your Perfect <span className="text-accent">Domain</span>
          </h1>
          <p className="text-hero-foreground/70 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Search and register your ideal domain name instantly. Powered by real-time availability checking.
          </p>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col sm:flex-row gap-2 bg-card/10 backdrop-blur-sm p-2 rounded-sm border border-hero-foreground/10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter your desired domain name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-12 bg-card text-foreground rounded-sm border-0"
                />
              </div>
              <Button type="submit" disabled={searching} className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-12 rounded-sm font-semibold uppercase text-xs tracking-wider">
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </form>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {defaultExtensions.slice(0, 4).map((ext) => (
                <span key={ext} className="text-hero-foreground/50 text-sm font-medium">{ext}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <AnimatePresence>
        {(searched || searching) && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-background border-b overflow-hidden">
            <div className="container-max px-4 lg:px-8 py-8 sm:py-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="font-heading text-xl sm:text-2xl font-bold">
                  Results for "<span className="text-accent">{cleanDomain(query)}</span>"
                </h2>
                {cart.length > 0 && (
                  <Button onClick={handleRegisterDomains} disabled={registering} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-semibold text-xs uppercase tracking-wider">
                    {registering ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
                    Register ({cart.length})
                  </Button>
                )}
              </div>

              {searching ? (
                <div className="flex items-center justify-center py-12 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  <span className="text-muted-foreground">Checking availability via WHMCS...</span>
                </div>
              ) : (
                <div className="grid gap-2 sm:gap-3">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.domain}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-sm border transition-colors ${
                        r.available ? "bg-card hover:border-accent/50" : "bg-muted/30 opacity-60"
                      } ${cart.find(c => c.domain === r.domain) ? "border-accent ring-1 ring-accent/20" : ""}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Globe className={`w-5 h-5 flex-shrink-0 ${r.available ? "text-accent" : "text-muted-foreground"}`} />
                        <div className="min-w-0">
                          <div className="font-heading font-bold text-sm sm:text-base truncate">{r.domain}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.available ? "Available" : "Not available"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        {r.available && (
                          <>
                            {cart.find(c => c.domain === r.domain) ? (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 border rounded-sm">
                                  <button type="button" onClick={() => updateYears(r.domain, -1)} className="p-1 hover:bg-muted"><Minus className="w-3 h-3" /></button>
                                  <span className="px-2 text-xs font-medium">{regYears[r.domain] || 1}yr</span>
                                  <button type="button" onClick={() => updateYears(r.domain, 1)} className="p-1 hover:bg-muted"><Plus className="w-3 h-3" /></button>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => removeFromCart(r.domain)} className="rounded-sm text-xs flex-shrink-0">
                                  <X className="w-3 h-3 mr-1" /> Remove
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" onClick={() => addToCart(r)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm text-xs flex-shrink-0">
                                <Plus className="w-3 h-3 mr-1" /> Add to Cart
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features bar */}
      <section className="bg-accent">
        <div className="container-max px-4 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {domainFeatures.map((f) => (
              <div key={f.title} className="flex items-center gap-3 text-accent-foreground">
                <f.icon className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-heading font-bold text-xs">{f.title}</div>
                  <div className="text-[10px] opacity-80">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk / Transfer */}
      <section className="section-padding bg-section-alt">
        <div className="container-max max-w-4xl">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-card border rounded-sm p-6 sm:p-8">
              <h3 className="font-heading font-bold text-lg sm:text-xl mb-3">Bulk Domain Registration</h3>
              <p className="text-muted-foreground text-sm mb-4">Registering multiple domains? Contact us for volume discounts and custom packages.</p>
              <Link to="/contact">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-semibold uppercase text-xs tracking-wider">
                  Get Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-card border rounded-sm p-6 sm:p-8">
              <h3 className="font-heading font-bold text-lg sm:text-xl mb-3">Transfer Your Domain</h3>
              <p className="text-muted-foreground text-sm mb-4">Transfer your existing domain to Abancool and enjoy free 1-year extension.</p>
              <ul className="space-y-2 mb-4">
                {["Free 1-year extension", "No downtime during transfer", "Free DNS management"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button variant="outline" className="rounded-sm font-semibold uppercase text-xs tracking-wider">
                  Start Transfer <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Cart Badge */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
            <Button onClick={handleRegisterDomains} disabled={registering} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm shadow-lg h-12 px-6 font-semibold text-sm">
              {registering ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
              Register {cart.length} domain{cart.length > 1 ? "s" : ""}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
