import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowRight, Shield, Zap, Clock, Headphones, Star, Server, Globe, Lock, HardDrive, Loader2 } from "lucide-react";
import { fetchProducts, createOrder } from "@/lib/whmcs-api";
import datacenter from "@/assets/hero-datacenter.jpg";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "NVMe SSD storage for blazing-fast load times" },
  { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade security for your websites" },
  { icon: Clock, title: "99.9% Uptime", desc: "Guaranteed uptime with redundant infrastructure" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert support team available around the clock" },
];

const whyUs = [
  { icon: Server, title: "Tier-3 Data Centers", desc: "Hosted in world-class data centers with redundant power and cooling systems for maximum reliability." },
  { icon: Lock, title: "Free SSL & Security", desc: "Every plan includes free Let's Encrypt SSL, firewall protection, and malware scanning." },
  { icon: HardDrive, title: "NVMe SSD Storage", desc: "Up to 10x faster than traditional SSDs. Your websites load instantly with NVMe technology." },
  { icon: Globe, title: "Global CDN", desc: "Content delivery network ensures your website loads fast for visitors worldwide." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HostingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState<string | null>(null);
  const [orderDomain, setOrderDomain] = useState("");
  const [orderPid, setOrderPid] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then((p) => setProducts(p))
      .catch((e) => {
        console.error("Failed to load products:", e);
        toast({ title: "Error loading plans", description: e.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOrderNow = async (product: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to order a hosting plan." });
      navigate("/client/login");
      return;
    }
    setOrderPid(product.pid);
  };

  const submitOrder = async () => {
    if (!orderDomain.trim() || !orderPid) {
      toast({ title: "Domain required", description: "Please enter a domain for your hosting.", variant: "destructive" });
      return;
    }
    setOrdering(orderPid);
    try {
      const result = await createOrder({
        pid: orderPid,
        domain: orderDomain.trim(),
        billingcycle: "annually",
      });
      if (result?.result === "success") {
        toast({ title: "Order placed!", description: `Order #${result.orderid} created. Invoice #${result.invoiceid} generated.` });
        setOrderPid(null);
        setOrderDomain("");
        navigate("/client/billing");
      } else {
        toast({ title: "Order failed", description: result?.message || "Please try again.", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Order failed", description: e.message, variant: "destructive" });
    } finally {
      setOrdering(null);
    }
  };

  const getPrice = (product: any) => {
    const pricing = product.pricing;
    if (!pricing) return { amount: "0", cycle: "year" };
    // Try annually first, then monthly
    if (pricing.KES?.annually) return { amount: pricing.KES.annually, cycle: "year" };
    if (pricing.USD?.annually) return { amount: pricing.USD.annually, cycle: "year" };
    if (pricing.KES?.monthly) return { amount: pricing.KES.monthly, cycle: "month" };
    if (pricing.USD?.monthly) return { amount: pricing.USD.monthly, cycle: "month" };
    return { amount: "0", cycle: "year" };
  };

  const getFeatures = (product: any): string[] => {
    const desc = product.description || "";
    // Try to parse features from description (WHMCS often uses HTML lists)
    const featureMatch = desc.match(/<li[^>]*>(.*?)<\/li>/gi);
    if (featureMatch) {
      return featureMatch.map((f: string) => f.replace(/<[^>]+>/g, "").trim()).filter(Boolean);
    }
    // Fallback: split by newlines or commas
    return desc.split(/\n|<br\s*\/?>/).map((s: string) => s.replace(/<[^>]+>/g, "").trim()).filter(Boolean).slice(0, 8);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={datacenter} alt="Data center" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero/80" />
        </div>
        <div className="relative container-max px-4 lg:px-8 py-20">
          <span className="section-label !text-accent">Web Hosting</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight">
            Premium <span className="text-accent">Hosting</span> Plans
          </h1>
          <p className="text-hero-foreground/70 text-lg max-w-2xl mt-4">
            Fast, secure, and reliable NVMe SSD hosting with LiteSpeed servers and 99.9% uptime. Powered by enterprise infrastructure.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#plans">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold uppercase text-sm tracking-wider px-8 h-12 rounded-sm">
                View Plans <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="outline" className="border-hero-foreground/30 text-hero-foreground hover:bg-hero-foreground/10 font-semibold uppercase text-sm tracking-wider px-8 h-12 rounded-sm">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-accent">
        <div className="container-max px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3 text-accent-foreground">
                <f.icon className="w-6 h-6 flex-shrink-0" />
                <div>
                  <div className="font-heading font-bold text-sm">{f.title}</div>
                  <div className="text-xs opacity-80">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans from WHMCS */}
      <section id="plans" className="section-padding bg-background">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="section-label justify-center">Choose Your Plan</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Hosting <span className="text-accent">Packages</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">All plans include free setup, control panel, and 30-day money back guarantee.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="ml-3 text-muted-foreground">Loading plans from server...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Server className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No hosting plans available at the moment.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${products.length >= 4 ? "lg:grid-cols-4" : products.length === 3 ? "lg:grid-cols-3" : ""} gap-0 border border-border`}>
              {products.map((product: any, i: number) => {
                const price = getPrice(product);
                const productFeatures = getFeatures(product);
                const isPopular = i === 1; // Second plan is popular
                return (
                  <motion.div
                    key={product.pid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                    className={`p-6 border-r border-b last:border-r-0 flex flex-col ${isPopular ? "bg-hero text-hero-foreground relative" : "bg-card"}`}
                  >
                    {isPopular && (
                      <div className="absolute -top-0 left-0 right-0">
                        <div className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 text-center flex items-center justify-center gap-1">
                          <Star className="w-3 h-3" /> Most Popular
                        </div>
                      </div>
                    )}
                    <div className={isPopular ? "mt-6" : ""}>
                      <h3 className="font-heading font-bold text-xl mb-1">{product.name}</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-heading font-bold text-accent">{price.amount}</span>
                        <span className={`text-sm ${isPopular ? "text-hero-foreground/60" : "text-muted-foreground"}`}>/{price.cycle}</span>
                      </div>
                    </div>
                    {productFeatures.length > 0 && (
                      <ul className="space-y-2 mb-6 flex-1">
                        {productFeatures.map((f, fi) => (
                          <li key={fi} className={`flex items-start gap-2 text-sm ${isPopular ? "text-hero-foreground/80" : "text-muted-foreground"}`}>
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      onClick={() => handleOrderNow(product)}
                      className={`w-full rounded-sm font-semibold uppercase text-xs tracking-wider ${
                        isPopular
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      Order Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Order Modal */}
      {orderPid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" onClick={() => setOrderPid(null)}>
          <div className="bg-card border rounded-sm w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-xl">Complete Your Order</h3>
            <p className="text-sm text-muted-foreground">
              Enter the domain name you'd like to use with this hosting plan.
            </p>
            <Input
              placeholder="yourdomain.com"
              value={orderDomain}
              onChange={(e) => setOrderDomain(e.target.value)}
              className="h-12 rounded-sm"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOrderPid(null)} className="flex-1 rounded-sm">
                Cancel
              </Button>
              <Button
                onClick={submitOrder}
                disabled={!!ordering}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-semibold"
              >
                {ordering ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      <section className="section-padding bg-section-alt">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="section-label justify-center">Why Abancool Hosting</span>
            <h2 className="font-heading text-3xl font-bold">Built for <span className="text-accent">Performance</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-card border rounded-sm p-6 hover-lift">
                <div className="w-14 h-14 rounded-sm bg-accent/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative container-max px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-hero-foreground mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-hero-foreground/60 mb-8 max-w-md mx-auto">
            Our team is ready to help you pick the perfect hosting plan for your needs.
          </p>
          <Link to="/contact">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold uppercase text-sm tracking-wider px-8 h-12 rounded-sm">
              Contact Sales <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
