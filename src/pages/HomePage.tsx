import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Server, Code, Globe, MessageSquare, CreditCard, Shield, ArrowRight, CheckCircle2, Users, Award, Headphones } from "lucide-react";
import heroImg from "@/assets/hero-datacenter.jpg";

const services = [
  { icon: Code, title: "Web Development", desc: "Custom responsive websites built with modern technologies.", link: "/services/web-development" },
  { icon: Server, title: "Web Hosting", desc: "Fast, secure SSD hosting with 99.9% uptime guarantee.", link: "/hosting" },
  { icon: Globe, title: "Domain Registration", desc: "Register .com, .co.ke, .africa and more at great prices.", link: "/domains" },
  { icon: MessageSquare, title: "Bulk SMS", desc: "Marketing, OTP, and transactional SMS solutions.", link: "/services/bulk-sms" },
  { icon: CreditCard, title: "Payment Integration", desc: "M-Pesa, PayPal, and card payment gateway integration.", link: "/services/payment-integration" },
  { icon: Shield, title: "Software Development", desc: "Custom business systems and management software.", link: "/services/software-development" },
];

const stats = [
  { number: "200+", label: "Projects Delivered" },
  { number: "150+", label: "Happy Clients" },
  { number: "99.9%", label: "Uptime Guarantee" },
  { number: "24/7", label: "Support Available" },
];

const hostingPlans = [
  { name: "Starter", price: "3,000", features: ["5GB SSD", "20GB Bandwidth", "Free SSL", "5 Emails"] },
  { name: "Business", price: "6,000", features: ["20GB SSD", "Unlimited BW", "Free SSL", "Unlimited Emails"], popular: true },
  { name: "Professional", price: "12,000", features: ["50GB SSD", "Unlimited BW", "Daily Backups", "10 Websites"] },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-hero-foreground">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImg} alt="Data center" className="w-full h-full object-cover" />
        </div>
        <div className="relative container-max section-padding flex flex-col lg:flex-row items-center gap-12 min-h-[600px]">
          <motion.div
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground mb-6">
              Garissa, Kenya 🇰🇪
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Reliable Technology Solutions for{" "}
              <span className="text-accent">Modern Businesses</span>
            </h1>
            <p className="text-lg opacity-80 mb-8 leading-relaxed max-w-lg">
              Abancool Technology delivers powerful digital solutions including websites, software systems, payment integrations, hosting services, and bulk SMS platforms.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8">
                  Explore Services <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-hero-foreground/30 text-hero-foreground hover:bg-hero-foreground/10">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-b">
        <div className="container-max px-4 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="text-3xl font-heading font-bold text-primary">{s.number}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground">Comprehensive technology solutions tailored for your business needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Link to={s.link} className="block p-6 rounded-xl bg-card border hover:elevated-shadow transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting Preview */}
      <section className="section-padding bg-section-alt">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Web Hosting Plans</h2>
            <p className="text-muted-foreground">Fast, secure, and reliable hosting from KSh 3,000/year.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {hostingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className={`rounded-xl p-6 bg-card border ${plan.popular ? "ring-2 ring-primary relative" : ""}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </span>
                )}
                <h3 className="font-heading font-semibold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-heading font-bold text-primary">KSh {plan.price}</span>
                  <span className="text-sm text-muted-foreground">/year</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/hosting">
                  <Button className={`w-full ${plan.popular ? "gradient-primary text-primary-foreground border-0" : ""}`} variant={plan.popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/hosting" className="text-primary text-sm font-medium hover:underline">
              View all plans & compare features →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Why Choose Abancool Technology?</h2>
              <div className="space-y-5">
                {[
                  { icon: Award, title: "Expert Team", desc: "Skilled professionals with years of industry experience." },
                  { icon: Users, title: "Client-Focused", desc: "We tailor solutions to meet your unique business needs." },
                  { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock technical support and assistance." },
                  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security and 99.9% uptime guarantee." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden card-shadow">
              <img src={heroImg} alt="Technology workspace" className="w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero text-hero-foreground section-padding">
        <div className="container-max text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="opacity-80 mb-8 max-w-lg mx-auto">
            Let's build something amazing together. Contact us today for a free consultation.
          </p>
          <Link to="/contact">
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-10">
              Contact Us <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
