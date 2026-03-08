import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe } from "lucide-react";

const extensions = [
  { ext: ".com", price: "1,500" },
  { ext: ".net", price: "1,600" },
  { ext: ".org", price: "1,500" },
  { ext: ".co.ke", price: "1,200" },
  { ext: ".africa", price: "2,200" },
  { ext: ".tech", price: "2,000" },
];

export default function DomainsPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <section className="gradient-hero text-hero-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Domain Registration</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
            Find your perfect domain name and establish your online presence.
          </p>
          <div className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search your domain name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 bg-card text-foreground"
              />
            </div>
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 h-12">
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <h2 className="font-heading text-2xl font-bold text-center mb-10">Domain Pricing</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {extensions.map((d, i) => (
              <motion.div
                key={d.ext}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl p-5 bg-card border text-center hover:elevated-shadow transition-all"
              >
                <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-heading font-bold text-lg mb-1">{d.ext}</div>
                <div className="text-primary font-semibold">KSh {d.price}</div>
                <div className="text-xs text-muted-foreground">/year</div>
                <Button size="sm" variant="outline" className="mt-3 w-full text-xs">Register</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
