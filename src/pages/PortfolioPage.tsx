import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  { title: "School Management System", category: "Education", desc: "Complete student, fees, and results management for secondary schools.", tech: ["React", "Node.js", "PostgreSQL"] },
  { title: "Corporate Website", category: "Web Development", desc: "Modern responsive website for a logistics company in Nairobi.", tech: ["React", "TailwindCSS"] },
  { title: "M-Pesa Payment Gateway", category: "Payment Integration", desc: "Custom M-Pesa STK push integration for an e-commerce platform.", tech: ["Node.js", "Daraja API"] },
  { title: "Bulk SMS Platform", category: "Communication", desc: "Marketing and OTP SMS platform serving 50,000+ messages monthly.", tech: ["React", "Python", "Redis"] },
  { title: "Hospital Records System", category: "Healthcare", desc: "Patient records and appointment management system.", tech: ["React", "Django", "MySQL"] },
  { title: "E-Commerce Store", category: "Web Development", desc: "Online store with M-Pesa and PayPal payment integration.", tech: ["React", "Stripe", "M-Pesa"] },
];

export default function PortfolioPage() {
  return (
    <>
      <section className="gradient-hero text-hero-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">Selected projects showcasing our expertise.</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl overflow-hidden bg-card border group hover:elevated-shadow transition-all"
              >
                <div className="h-48 gradient-primary opacity-80 flex items-center justify-center">
                  <ExternalLink className="w-10 h-10 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-primary">{p.category}</span>
                  <h3 className="font-heading font-semibold text-lg mt-1 mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-xs bg-primary-light text-primary font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
