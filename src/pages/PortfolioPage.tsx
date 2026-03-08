import { motion } from "framer-motion";
import heroImg from "@/assets/hero-developers.jpg";
import portfolioMpesa from "@/assets/portfolio-mpesa.jpg";
import portfolioWebsite from "@/assets/portfolio-website.jpg";
import portfolioHotel from "@/assets/portfolio-hotel.jpg";
import portfolioPos from "@/assets/portfolio-pos.jpg";
import portfolioHospital from "@/assets/portfolio-hospital.jpg";
import portfolioTravel from "@/assets/portfolio-travel.jpg";
import portfolioSchool from "@/assets/portfolio-school.jpg";
import portfolioSms from "@/assets/portfolio-sms.jpg";
import portfolioEcommerce from "@/assets/portfolio-ecommerce.jpg";

const projects = [
  { title: "M-Pesa Payment Gateway", category: "Payment Integration", desc: "Custom M-Pesa STK Push & C2B integration for e-commerce platforms serving 10,000+ daily transactions.", tech: ["Node.js", "Daraja API", "React"], img: portfolioMpesa },
  { title: "Corporate Website", category: "Web Development", desc: "Modern responsive website for a logistics company with booking system and real-time tracking.", tech: ["React", "TailwindCSS", "Node.js"], img: portfolioWebsite },
  { title: "Hotel Management System", category: "Hospitality", desc: "Full-featured hotel platform with online booking, room management, guest portal, and M-Pesa billing.", tech: ["React", "Django", "PostgreSQL"], img: portfolioHotel },
  { title: "POS System", category: "Retail", desc: "Complete point of sale for supermarkets with barcode scanning, inventory, and M-Pesa integration.", tech: ["React", "Node.js", "MySQL"], img: portfolioPos },
  { title: "Hospital Records System", category: "Healthcare", desc: "Patient records, pharmacy management, lab results, NHIF/SHA billing, and appointment scheduling.", tech: ["React", "Django", "PostgreSQL"], img: portfolioHospital },
  { title: "Safari Booking Platform", category: "Tourism", desc: "Travel booking system for flights, hotels, and safari packages with multi-currency payment.", tech: ["React", "Node.js", "Stripe"], img: portfolioTravel },
  { title: "School Management System", category: "Education", desc: "Complete student, fees, results, parent portal, and SMS notification system for secondary schools.", tech: ["React", "Node.js", "PostgreSQL"], img: portfolioSchool },
  { title: "Bulk SMS Platform", category: "Communication", desc: "Marketing and OTP SMS platform serving 50,000+ messages monthly with developer API.", tech: ["React", "Python", "Redis"], img: portfolioSms },
  { title: "E-Commerce Store", category: "Web Development", desc: "Online store with M-Pesa, PayPal, and card payment integration serving 5,000+ products.", tech: ["React", "Node.js", "M-Pesa"], img: portfolioEcommerce },
];

export default function PortfolioPage() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero/75" />
        </div>
        <div className="relative container-max px-4 lg:px-8 py-20">
          <span className="section-label !text-accent">Our Work</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight">
            Our <span className="text-accent">Portfolio</span>
          </h1>
          <p className="text-hero-foreground/70 text-lg max-w-2xl mt-4">Selected projects showcasing our expertise across industries.</p>
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
                className="group bg-card border rounded-sm overflow-hidden hover-lift"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm">{p.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-sm text-[10px] bg-accent/10 text-accent font-medium">{t}</span>
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
