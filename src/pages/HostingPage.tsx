import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "3,000",
    features: ["5GB SSD Storage", "20GB Bandwidth", "Free SSL Certificate", "5 Email Accounts", "1 Website", "cPanel Access", "Weekly Backups"],
  },
  {
    name: "Business",
    price: "6,000",
    popular: true,
    features: ["20GB SSD Storage", "Unlimited Bandwidth", "Free SSL Certificate", "Unlimited Email Accounts", "5 Websites", "cPanel Access", "Daily Backups"],
  },
  {
    name: "Professional",
    price: "12,000",
    features: ["50GB SSD Storage", "Unlimited Bandwidth", "Free SSL Certificate", "Unlimited Email Accounts", "10 Websites", "cPanel Access", "Daily Backups", "Staging Environment"],
  },
  {
    name: "Enterprise",
    price: "25,000",
    features: ["100GB SSD Storage", "Unlimited Bandwidth", "Free SSL Certificate", "Unlimited Email Accounts", "Unlimited Websites", "cPanel Access", "Real-time Backups", "Priority Support", "Dedicated IP"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HostingPage() {
  return (
    <>
      <section className="gradient-hero text-hero-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Web Hosting Plans</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Fast, secure, and reliable SSD hosting with 99.9% uptime guarantee. Starting from KSh 3,000/year.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className={`rounded-xl p-6 bg-card border flex flex-col ${plan.popular ? "ring-2 ring-primary relative" : ""}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </span>
                )}
                <h3 className="font-heading font-semibold text-xl mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-heading font-bold text-primary">KSh {plan.price}</span>
                  <span className="text-sm text-muted-foreground">/year</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${plan.popular ? "gradient-primary text-primary-foreground border-0" : ""}`} variant={plan.popular ? "default" : "outline"}>
                  Order Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
