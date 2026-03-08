import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, ArrowRight, Shield, RefreshCw, Lock, Headphones, CheckCircle2, ShoppingCart, Loader2, X, Plus, Minus, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import datacenter from "@/assets/hero-datacenter.jpg";

const extensions = [
  { ext: ".com", price: 1500, desc: "Most popular worldwide" },
  { ext: ".net", price: 1600, desc: "Networks & tech" },
  { ext: ".org", price: 1500, desc: "Organizations & NGOs" },
  { ext: ".co.ke", price: 1200, desc: "Kenyan businesses" },
  { ext: ".africa", price: 2200, desc: "Pan-African identity" },
  { ext: ".tech", price: 2000, desc: "Technology companies" },
  { ext: ".online", price: 1800, desc: "Online presence" },
  { ext: ".store", price: 1800, desc: "E-commerce shops" },
];

const domainFeatures = [
  { icon: Shield, title: "WHOIS Privacy", desc: "Free domain privacy protection" },
  { icon: RefreshCw, title: "Auto Renewal", desc: "Never lose your domain" },
  { icon: Lock, title: "Domain Lock", desc: "Prevent unauthorized transfers" },
  { icon: Headphones, title: "DNS Management", desc: "Full DNS control panel" },
];

type SearchResult = { domain: string; ext: string; available: boolean; price: number; premium?: boolean };

export default function DomainsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [cart, setCart] = useState<SearchResult[]>([]);
  const [showRegForm, setShowRegForm] = useState(false);
  const [regForm, setRegForm] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "", address: "", city: "", country: "Kenya", idNumber: "" });
  const [regYears, setRegYears] = useState<Record<string, number>>({});

  const cleanDomain = (input: string) => {
    let d = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
    // Remove any extension the user typed to get the base name
    const base = d.replace(/\.[a-z.]+$/, "") || d;
    return base;
  };

  const handleSearch = useCallback(() => {
    const base = cleanDomain(query);
    if (!base || base.length < 2) {
      toast({ title: "Invalid domain", description: "Please enter at least 2 characters.", variant: "destructive" });
      return;
    }
    setSearching(true);
    setSearched(false);

    // Simulate search with random availability (ready for real API)
    setTimeout(() => {
      const mockResults: SearchResult[] = extensions.map((e) => ({
        domain: `${base}${e.ext}`,
        ext: e.ext,
        available: Math.random() > 0.3,
        price: e.price,
        premium: Math.random() > 0.85,
      }));
      setResults(mockResults);
      setSearched(true);
      setSearching(false);
    }, 1200);
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

  const cartTotal = cart.reduce((s, c) => s + c.price * (regYears[c.domain] || 1), 0);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({ title: "Empty cart", description: "Add at least one domain to register.", variant: "destructive" });
      return;
    }

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Login required", description: "Please sign in or create an account to proceed with payment." });
      // Store cart in sessionStorage so we can resume after login
      sessionStorage.setItem("domain_cart", JSON.stringify({ cart, regYears, regForm, cartTotal }));
      navigate("/client/login");
      return;
    }

    // Create domain records and invoice, then redirect to payments
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const domainNames = cart.map(c => c.domain).join(", ");

    // Insert invoice
    await supabase.from("invoices").insert({
      invoice_number: invoiceNumber,
      user_id: user.id,
      service_type: "domain",
      service_description: `Domain registration: ${domainNames}`,
      amount: cartTotal,
      status: "unpaid",
      due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Insert domain records
    for (const c of cart) {
      const ext = c.ext;
      const name = c.domain.replace(ext, "");
      await supabase.from("domains").insert({
        user_id: user.id,
        name: name,
        extension: ext,
        status: "pending",
        expires_at: new Date(Date.now() + (regYears[c.domain] || 1) * 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    toast({ title: "Domains reserved!", description: "Redirecting to payment..." });
    setShowRegForm(false);
    navigate("/client/dashboard/payments");
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
            Establish your online presence with a professional domain name. Starting from KSh 1,200/year.
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
              {[".com", ".co.ke", ".africa", ".tech"].map((ext) => (
                <button key={ext} onClick={() => { setQuery(cleanDomain(query || "mybusiness") + ext.replace(".", "")); }} className="text-hero-foreground/50 text-sm font-medium hover:text-accent transition-colors">{ext}</button>
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
                  Search Results for "<span className="text-accent">{cleanDomain(query)}</span>"
                </h2>
                {cart.length > 0 && (
                  <Button onClick={() => setShowRegForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-semibold text-xs uppercase tracking-wider">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Checkout ({cart.length})
                  </Button>
                )}
              </div>

              {searching ? (
                <div className="flex items-center justify-center py-12 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  <span className="text-muted-foreground">Checking availability across all extensions...</span>
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
                            {r.available ? (r.premium ? "Premium domain" : "Available") : "Not available"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="font-heading font-bold text-accent text-sm sm:text-base whitespace-nowrap">
                          KSh {r.price.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/yr</span>
                        </div>
                        {r.available && (
                          cart.find(c => c.domain === r.domain) ? (
                            <Button size="sm" variant="outline" onClick={() => removeFromCart(r.domain)} className="rounded-sm text-xs flex-shrink-0">
                              <X className="w-3 h-3 mr-1" /> Remove
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => addToCart(r)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm text-xs flex-shrink-0">
                              <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                          )
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

      {/* Registration Form Modal */}
      <AnimatePresence>
        {showRegForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" onClick={() => setShowRegForm(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-card border rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card border-b p-4 sm:p-6 flex items-center justify-between z-10">
                <h3 className="font-heading font-bold text-lg sm:text-xl">Domain Registration</h3>
                <button onClick={() => setShowRegForm(false)} className="p-1 hover:bg-muted rounded-sm"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleRegister} className="p-4 sm:p-6 space-y-6">
                {/* Cart Summary */}
                <div className="space-y-3">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">Your Domains</h4>
                  {cart.map((c) => (
                    <div key={c.domain} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-muted/30 rounded-sm border">
                      <div className="flex items-center gap-2 min-w-0">
                        <Globe className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-medium text-sm truncate">{c.domain}</span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-1 border rounded-sm">
                          <button type="button" onClick={() => updateYears(c.domain, -1)} className="p-1 hover:bg-muted"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs font-medium">{regYears[c.domain] || 1}yr</span>
                          <button type="button" onClick={() => updateYears(c.domain, 1)} className="p-1 hover:bg-muted"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="font-bold text-sm text-accent">KSh {(c.price * (regYears[c.domain] || 1)).toLocaleString()}</span>
                        <button type="button" onClick={() => removeFromCart(c.domain)} className="p-1 text-destructive hover:bg-destructive/10 rounded-sm"><X className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t font-heading">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-accent text-lg">KSh {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Registrant Info */}
                <div className="space-y-4">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">Registrant Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">First Name *</label>
                      <Input value={regForm.firstName} onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })} required placeholder="John" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Last Name *</label>
                      <Input value={regForm.lastName} onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })} required placeholder="Doe" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address *</label>
                      <Input type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required placeholder="john@example.com" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number *</label>
                      <Input value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} required placeholder="+254 700 000 000" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Company</label>
                      <Input value={regForm.company} onChange={(e) => setRegForm({ ...regForm, company: e.target.value })} placeholder="Company name" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">ID/Passport Number</label>
                      <Input value={regForm.idNumber} onChange={(e) => setRegForm({ ...regForm, idNumber: e.target.value })} placeholder="For .co.ke domains" className="rounded-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Address *</label>
                      <Input value={regForm.address} onChange={(e) => setRegForm({ ...regForm, address: e.target.value })} required placeholder="P.O Box or Street Address" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">City *</label>
                      <Input value={regForm.city} onChange={(e) => setRegForm({ ...regForm, city: e.target.value })} required placeholder="Nairobi" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Country</label>
                      <Input value={regForm.country} onChange={(e) => setRegForm({ ...regForm, country: e.target.value })} className="rounded-sm" />
                    </div>
                  </div>
                </div>

                {/* Addons */}
                <div className="space-y-3">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">Free Addons Included</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {["WHOIS Privacy Protection", "DNS Management Panel", "Email Forwarding", "Domain Lock Protection"].map((a) => (
                      <div key={a} className="flex items-center gap-2 text-sm p-2 bg-accent/5 rounded-sm border border-accent/10">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm h-12 font-semibold uppercase text-xs tracking-wider">
                  <CreditCard className="w-4 h-4 mr-2" /> Proceed to Payment — KSh {cartTotal.toLocaleString()}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">Payment processing via M-Pesa, card, or bank transfer. Backend integration pending.</p>
              </form>
            </motion.div>
          </motion.div>
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

      {/* Pricing grid */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="section-label justify-center">Pricing</span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">Domain <span className="text-accent">Extensions</span></h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base">All domains include free WHOIS privacy and DNS management.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border">
            {extensions.map((d, i) => (
              <motion.div
                key={d.ext}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-6 border-r border-b bg-card group hover:bg-accent transition-colors duration-500"
              >
                <Globe className="w-6 sm:w-8 h-6 sm:h-8 text-accent mx-auto mb-3 group-hover:text-accent-foreground transition-colors duration-500" />
                <div className="font-heading font-bold text-base sm:text-xl mb-1 text-center group-hover:text-accent-foreground transition-colors duration-500">{d.ext}</div>
                <div className="text-accent font-bold text-center text-sm sm:text-lg group-hover:text-accent-foreground transition-colors duration-500">KSh {d.price.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground text-center group-hover:text-accent-foreground/70 transition-colors duration-500">/year</div>
                <div className="text-[10px] text-muted-foreground/60 text-center mt-1 group-hover:text-accent-foreground/50 transition-colors duration-500">{d.desc}</div>
                <Button size="sm" onClick={() => { setQuery("mybusiness"); addToCart({ domain: `mybusiness${d.ext}`, ext: d.ext, available: true, price: d.price }); }} className="mt-4 w-full text-xs rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 group-hover:bg-accent-foreground group-hover:text-accent transition-colors duration-500">
                  Register
                </Button>
              </motion.div>
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
        {cart.length > 0 && !showRegForm && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
            <Button onClick={() => setShowRegForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm shadow-lg h-12 px-6 font-semibold text-sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {cart.length} domain{cart.length > 1 ? "s" : ""} — KSh {cartTotal.toLocaleString()}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
