import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code, Server, GraduationCap, MessageSquare, CreditCard, Globe, Cpu, Cloud, ArrowRight } from "lucide-react";

const services = [
  { icon: Code, title: "Website Development", desc: "Custom responsive websites and web applications built with modern frameworks and technologies.", link: "/services/web-development" },
  { icon: Cpu, title: "Software Development", desc: "Custom business systems, ERPs, inventory management, and automation software.", link: "/services/software-development" },
  { icon: GraduationCap, title: "School Management Systems", desc: "Complete student, fees, results, and parent portal management solutions.", link: "/services/school-management" },
  { icon: CreditCard, title: "Payment Integration", desc: "M-Pesa, PayPal, and card payment gateway integration for your business.", link: "/services/payment-integration" },
  { icon: MessageSquare, title: "Bulk SMS Platform", desc: "Marketing, transactional, and OTP SMS solutions with developer API.", link: "/services/bulk-sms" },
  { icon: Server, title: "Web Hosting", desc: "Fast SSD hosting with 99.9% uptime, free SSL, and daily backups.", link: "/hosting" },
  { icon: Globe, title: "Domain Registration", desc: "Register .com, .co.ke, .africa, .tech and more at competitive prices.", link: "/domains" },
  { icon: Cloud, title: "Cloud Infrastructure", desc: "Cloud servers, managed hosting, and scalable infrastructure solutions.", link: "/services/web-development" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function ServicesPage() {
  return (
    <>
      <section className="gradient-hero text-hero-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Comprehensive technology solutions tailored to empower your business.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Link to={s.link} className="block h-full p-6 rounded-xl bg-card border hover:elevated-shadow transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
