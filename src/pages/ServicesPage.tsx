import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code, Server, GraduationCap, MessageSquare, CreditCard, Globe, Cpu, Cloud, ArrowRight, Hotel, ShoppingCart, HeartPulse, Plane, Smartphone } from "lucide-react";
import heroImg from "@/assets/hero-developers.jpg";
import portfolioHotel from "@/assets/portfolio-hotel.jpg";
import portfolioPos from "@/assets/portfolio-pos.jpg";
import portfolioHospital from "@/assets/portfolio-hospital.jpg";
import portfolioTravel from "@/assets/portfolio-travel.jpg";
import portfolioSchool from "@/assets/portfolio-school.jpg";
import portfolioWebsite from "@/assets/portfolio-website.jpg";
import portfolioMpesa from "@/assets/portfolio-mpesa.jpg";
import portfolioSms from "@/assets/portfolio-sms.jpg";
import mobileApp from "@/assets/service-mobile-app.jpg";

const services = [
  { icon: Code, title: "Website Development", desc: "Custom responsive websites and web applications built with React, Next.js, WordPress, and modern frameworks. SEO-optimized, fast-loading, and mobile-first.", link: "/services/web-development", img: portfolioWebsite },
  { icon: Cpu, title: "Software Development", desc: "Custom ERPs, CRMs, inventory systems, HR & payroll, accounting software, and workflow automation for businesses of all sizes.", link: "/services/software-development", img: mobileApp },
  { icon: Hotel, title: "Hotel Management System", desc: "Complete hotel platform with online booking engine, room management, guest portal, housekeeping, restaurant POS, and channel manager integration.", link: "/services/hotel-management", img: portfolioHotel },
  { icon: ShoppingCart, title: "POS System", desc: "Point of sale for retail shops, supermarkets, restaurants, and pharmacies with M-Pesa, barcode scanning, inventory, and KRA eTIMS compliance.", link: "/services/pos-system", img: portfolioPos },
  { icon: HeartPulse, title: "Hospital Management System", desc: "Patient records (EMR), pharmacy, laboratory, NHIF/SHA billing, telemedicine, appointment scheduling, and MOH reporting.", link: "/services/hospital-management", img: portfolioHospital },
  { icon: Plane, title: "Travel Booking System", desc: "Flight booking, hotel reservations, safari & tour packages, itinerary builder, multi-currency payments, and agent management.", link: "/services/travel-booking", img: portfolioTravel },
  { icon: GraduationCap, title: "School Management Systems", desc: "Student enrollment, fee collection (M-Pesa), results management, parent/teacher portals, CBC & 8-4-4 support, and SMS notifications.", link: "/services/school-management", img: portfolioSchool },
  { icon: CreditCard, title: "Payment Integration", desc: "M-Pesa STK Push, C2B, B2C, PayPal, Visa/Mastercard, subscription billing, payment dashboards, and automated reconciliation.", link: "/services/payment-integration", img: portfolioMpesa },
  { icon: MessageSquare, title: "Bulk SMS Platform", desc: "Marketing SMS, transactional alerts, OTP verification, developer API, contact management, delivery reports, and custom sender ID.", link: "/services/bulk-sms", img: portfolioSms },
  { icon: Server, title: "Web Hosting", desc: "Fast NVMe SSD hosting with 99.9% uptime, free SSL, cPanel, daily backups, and DDoS protection starting from KSh 420/month.", link: "/hosting", img: null },
  { icon: Globe, title: "Domain Registration", desc: "Register .com, .co.ke, .africa, .tech and 100+ extensions at competitive prices with free DNS management.", link: "/domains", img: null },
  { icon: Cloud, title: "Cloud Infrastructure", desc: "Cloud servers, managed hosting, VPS, dedicated servers, and scalable infrastructure on AWS, Google Cloud, and Azure.", link: "/services/web-development", img: null },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero/75" />
        </div>
        <div className="relative container-max px-4 lg:px-8 py-20">
          <span className="section-label !text-accent">What We Do</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight">
            Our <span className="text-accent">Services</span>
          </h1>
          <p className="text-hero-foreground/70 text-lg max-w-2xl mt-4">
            Comprehensive technology solutions tailored to empower your business.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Link to={s.link} className="block h-full bg-card border rounded-sm overflow-hidden group hover-lift">
                  {s.img && (
                    <div className="h-44 overflow-hidden">
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-sm bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-500">
                      <s.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors duration-500" />
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-accent transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                    <span className="text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
