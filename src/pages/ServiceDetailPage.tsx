import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Code, Cpu, GraduationCap, MessageSquare, CreditCard, Hotel, ShoppingCart, HeartPulse, Plane, Smartphone } from "lucide-react";
import heroImg from "@/assets/hero-developers.jpg";
import portfolioHotel from "@/assets/portfolio-hotel.jpg";
import portfolioPos from "@/assets/portfolio-pos.jpg";
import portfolioHospital from "@/assets/portfolio-hospital.jpg";
import portfolioTravel from "@/assets/portfolio-travel.jpg";
import portfolioSchool from "@/assets/portfolio-school.jpg";
import portfolioSms from "@/assets/portfolio-sms.jpg";
import portfolioMpesa from "@/assets/portfolio-mpesa.jpg";
import portfolioWebsite from "@/assets/portfolio-website.jpg";
import portfolioEcommerce from "@/assets/portfolio-ecommerce.jpg";
import mobileApp from "@/assets/service-mobile-app.jpg";

interface ServiceInfo {
  icon: typeof Code;
  title: string;
  desc: string;
  details: string[];
  features: { name: string; desc: string }[];
  img: string;
  benefits: string[];
  modules?: string[];
}

const serviceData: Record<string, ServiceInfo> = {
  "web-development": {
    icon: Code,
    title: "Website Development",
    desc: "Custom responsive websites built with modern technologies and best practices.",
    img: portfolioWebsite,
    details: [
      "We build fast, SEO-optimized, mobile-responsive websites using React, Next.js, WordPress, and custom frameworks. From corporate websites to complex web applications, we deliver pixel-perfect designs that convert visitors into customers.",
      "Our development process includes discovery, wireframing, UI/UX design, development, testing, and deployment. Every website is built with performance, accessibility, and security in mind.",
      "We specialize in corporate websites, e-commerce stores, landing pages, SaaS platforms, blogs, directory websites, and progressive web applications (PWAs)."
    ],
    features: [
      { name: "Responsive Design", desc: "Looks perfect on desktop, tablet, and mobile devices with fluid layouts." },
      { name: "SEO Optimization", desc: "Built-in SEO best practices including meta tags, schema markup, and fast loading." },
      { name: "E-Commerce Integration", desc: "Full online store functionality with product management, cart, and checkout." },
      { name: "CMS Integration", desc: "WordPress, Strapi, or custom CMS for easy content management by your team." },
      { name: "Performance Optimization", desc: "Sub-2-second load times with lazy loading, CDN, and code splitting." },
      { name: "Custom UI/UX Design", desc: "Unique brand-aligned designs created by professional designers." },
      { name: "Progressive Web Apps", desc: "Installable PWAs that work offline and feel like native mobile apps." },
      { name: "Analytics & Tracking", desc: "Google Analytics, heatmaps, and conversion tracking integrated from day one." },
    ],
    benefits: ["Increase online visibility by 300%", "Convert more visitors to customers", "Professional brand presence", "24/7 online availability", "Global reach"],
  },
  "software-development": {
    icon: Cpu,
    title: "Software Development",
    desc: "Custom business systems, ERPs, and enterprise software solutions.",
    img: mobileApp,
    details: [
      "We develop custom software solutions including ERPs, CRMs, inventory management systems, HR management, accounting software, and workflow automation tools. Our solutions are scalable, secure, and built to streamline your business operations.",
      "Whether you need a desktop application, web-based platform, or mobile app, our team delivers end-to-end solutions from requirements gathering to deployment and ongoing support.",
      "We use modern tech stacks including React, Node.js, Python/Django, React Native for mobile, PostgreSQL, and cloud platforms like AWS and Google Cloud."
    ],
    features: [
      { name: "Custom ERP Systems", desc: "Full enterprise resource planning covering finance, HR, procurement, and operations." },
      { name: "CRM Development", desc: "Customer relationship management with lead tracking, pipeline, and automation." },
      { name: "Inventory Management", desc: "Real-time stock tracking, purchase orders, suppliers, and warehouse management." },
      { name: "HR & Payroll Systems", desc: "Employee management, leave tracking, payroll processing with KRA compliance." },
      { name: "Accounting Software", desc: "Invoicing, expenses, financial reports, and M-Pesa payment reconciliation." },
      { name: "Mobile App Development", desc: "Cross-platform mobile apps using React Native for iOS and Android." },
      { name: "API Development", desc: "RESTful and GraphQL APIs for system integration and third-party connectivity." },
      { name: "Cloud Deployment", desc: "AWS, Google Cloud, or Azure deployment with auto-scaling and monitoring." },
    ],
    benefits: ["Automate repetitive business tasks", "Reduce operational costs by 40%", "Real-time data and analytics", "Seamless system integration", "Scalable for business growth"],
  },
  "hotel-management": {
    icon: Hotel,
    title: "Hotel Management System",
    desc: "Complete hotel booking, room management, and guest portal solutions.",
    img: portfolioHotel,
    details: [
      "Our hotel management system is a comprehensive platform designed for hotels, lodges, resorts, and guest houses across Kenya and East Africa. It covers every aspect of hotel operations from online booking to revenue reporting.",
      "The system integrates seamlessly with M-Pesa for mobile payments, supports multiple room types and rate plans, and provides a beautiful guest-facing booking website that drives direct reservations.",
      "Built for both small boutique hotels and large chains, our HMS supports multi-property management, channel integration with Booking.com and Expedia, and real-time availability updates."
    ],
    features: [
      { name: "Online Booking Engine", desc: "Beautiful responsive booking widget for your website with real-time availability and instant confirmation." },
      { name: "Room & Rate Management", desc: "Manage room types, seasonal rates, packages, promotions, and occupancy limits." },
      { name: "Guest Check-in/Check-out", desc: "Digital registration, ID scanning, key card integration, and express checkout." },
      { name: "Housekeeping Management", desc: "Room status tracking, cleaning schedules, maintenance requests, and staff assignments." },
      { name: "Revenue Management", desc: "Daily revenue reports, occupancy analytics, ADR tracking, and forecasting tools." },
      { name: "M-Pesa & Card Payments", desc: "Integrated M-Pesa STK Push, card payments, and automated billing with receipts." },
      { name: "Guest Portal & App", desc: "Mobile-friendly guest portal for bookings, room service, requests, and feedback." },
      { name: "Multi-Property Support", desc: "Manage multiple hotels from a single dashboard with consolidated reporting." },
      { name: "Restaurant & Bar POS", desc: "Integrated food and beverage point of sale with menu management and billing." },
      { name: "Channel Manager", desc: "Sync availability with Booking.com, Expedia, Airbnb, and other OTAs." },
    ],
    modules: ["Front Desk", "Reservations", "Housekeeping", "Restaurant & Bar", "Accounting", "Guest Relations", "Reports & Analytics", "Channel Management"],
    benefits: ["Increase direct bookings by 50%", "Reduce no-shows with automated reminders", "Real-time revenue analytics", "Seamless M-Pesa payments", "Multi-channel distribution"],
  },
  "pos-system": {
    icon: ShoppingCart,
    title: "POS System",
    desc: "Complete point of sale for retail, restaurants, supermarkets, and hospitality.",
    img: portfolioPos,
    details: [
      "Our POS system is designed specifically for Kenyan businesses — retail shops, supermarkets, restaurants, pharmacies, and hospitality. It supports M-Pesa integration, KRA-compliant receipt printing, inventory tracking, and real-time sales reporting.",
      "The system works on tablets, touchscreens, and regular computers, making it affordable and accessible for businesses of all sizes. It handles both online and offline sales with automatic sync when internet is restored.",
      "With features like barcode scanning, multi-branch support, customer loyalty programs, and detailed analytics, our POS helps you make smarter business decisions and serve customers faster."
    ],
    features: [
      { name: "Sales & Billing", desc: "Fast checkout with barcode scanning, quick-add items, split bills, and KRA-compliant receipts." },
      { name: "Inventory Management", desc: "Real-time stock levels, low-stock alerts, purchase orders, and supplier management." },
      { name: "M-Pesa Integration", desc: "Accept M-Pesa payments via STK Push with automatic reconciliation and SMS confirmation." },
      { name: "Receipt & Invoice Printing", desc: "Thermal receipt printing, A4 invoices, and KRA eTIMS compliance." },
      { name: "Multi-Branch Support", desc: "Manage multiple store locations from one dashboard with inter-branch transfers." },
      { name: "Staff Management", desc: "Employee roles, attendance tracking, commission tracking, and shift management." },
      { name: "Sales Analytics", desc: "Daily/weekly/monthly reports, best sellers, profit margins, and trend analysis." },
      { name: "Customer Loyalty", desc: "Points system, customer profiles, purchase history, and targeted promotions." },
      { name: "Restaurant Mode", desc: "Table management, kitchen display system, order types (dine-in/takeaway/delivery)." },
      { name: "Offline Mode", desc: "Continue selling when internet is down — syncs automatically when reconnected." },
    ],
    modules: ["Sales Terminal", "Inventory", "Suppliers", "Staff", "Customers", "Reports", "Settings", "Multi-Branch"],
    benefits: ["Speed up checkout by 60%", "Eliminate stock discrepancies", "KRA eTIMS compliant", "Accept all payment methods", "Real-time business insights"],
  },
  "hospital-management": {
    icon: HeartPulse,
    title: "Hospital Management System",
    desc: "Comprehensive hospital and clinic management platform.",
    img: portfolioHospital,
    details: [
      "Our hospital management system (HMS) is a comprehensive platform for hospitals, clinics, and healthcare facilities. It covers patient registration, electronic medical records (EMR), pharmacy, laboratory, billing with NHIF/SHA support, and telemedicine.",
      "The system is built to comply with Kenya's healthcare regulations and integrates with NHIF/SHA for insurance claims processing. It supports ICD-10 coding, HL7 data exchange, and secure patient data management.",
      "From small clinics to large hospitals, our HMS scales to handle thousands of patients with modules for outpatient, inpatient, emergency, maternity, surgical, and specialized care."
    ],
    features: [
      { name: "Patient Registration", desc: "Digital registration with biometric support, ID scanning, and patient numbering system." },
      { name: "Electronic Medical Records", desc: "Complete patient history, diagnoses, prescriptions, lab results, and imaging in one secure record." },
      { name: "Pharmacy Management", desc: "Drug inventory, prescriptions, dispensing, stock alerts, and supplier management." },
      { name: "Laboratory Management", desc: "Sample tracking, test requests, results entry, and automated result delivery to doctors." },
      { name: "Billing & Insurance", desc: "Patient billing, NHIF/SHA claims, corporate accounts, M-Pesa payments, and receipting." },
      { name: "Appointment Scheduling", desc: "Online booking, doctor availability, automated reminders via SMS, and queue management." },
      { name: "Doctor Portal", desc: "Dedicated interface for doctors with patient queue, consultation notes, and prescription writing." },
      { name: "Telemedicine", desc: "Video consultations, e-prescriptions, and remote patient monitoring capabilities." },
      { name: "Radiology & Imaging", desc: "DICOM viewer integration, imaging requests, and digital report management." },
      { name: "Reports & Analytics", desc: "Patient statistics, revenue reports, disease tracking, and MOH reporting compliance." },
    ],
    modules: ["Outpatient (OPD)", "Inpatient (IPD)", "Emergency", "Pharmacy", "Laboratory", "Radiology", "Billing", "Maternity", "Theatre", "Administration"],
    benefits: ["Paperless patient records", "NHIF/SHA claims automation", "Reduce patient wait times", "Accurate billing & revenue tracking", "MOH reporting compliance"],
  },
  "travel-booking": {
    icon: Plane,
    title: "Travel Booking System",
    desc: "Complete travel and tour booking platform with payment integration.",
    img: portfolioTravel,
    details: [
      "Our travel booking system is a comprehensive platform for travel agencies, tour operators, and safari companies in Kenya and East Africa. It covers flight booking, hotel reservations, safari packages, and tour management with integrated payments.",
      "The system features a beautiful customer-facing website with search and booking capabilities, a powerful admin dashboard for managing bookings and packages, and integration with GDS systems for flight booking.",
      "Built for the East African tourism market, it supports multi-currency pricing, M-Pesa and card payments, customizable tour packages, and automated itinerary generation."
    ],
    features: [
      { name: "Flight Booking", desc: "Search and book flights with GDS integration, fare comparison, and e-ticketing." },
      { name: "Hotel Reservations", desc: "Hotel search, availability checking, booking management, and confirmation emails." },
      { name: "Safari & Tour Packages", desc: "Create and sell customizable safari and tour packages with itineraries and pricing." },
      { name: "M-Pesa & Card Payments", desc: "Secure payment processing via M-Pesa STK Push, Visa, Mastercard, and PayPal." },
      { name: "Itinerary Builder", desc: "Drag-and-drop itinerary creation with accommodations, activities, and transfers." },
      { name: "Customer Portal", desc: "Self-service portal for booking management, travel documents, and trip history." },
      { name: "Agent Dashboard", desc: "Booking management, customer CRM, commission tracking, and sales reports." },
      { name: "Multi-Currency Support", desc: "Display prices in KES, USD, EUR, GBP with real-time exchange rates." },
      { name: "Visa Assistance", desc: "Visa application tracking, document checklist, and automated reminders." },
      { name: "Reviews & Ratings", desc: "Customer reviews, ratings, and testimonials for packages and destinations." },
    ],
    modules: ["Flights", "Hotels", "Safaris", "Tours", "Transfers", "Visa Services", "Customer Portal", "Agent CRM"],
    benefits: ["Automate booking management", "Accept payments 24/7", "Beautiful customer-facing website", "Multi-currency for international tourists", "Real-time availability"],
  },
  "school-management": {
    icon: GraduationCap,
    title: "School Management Systems",
    desc: "Complete school administration and learning management platform.",
    img: portfolioSchool,
    details: [
      "Our school management system is used by primary schools, secondary schools, colleges, and universities across Kenya. It covers student enrollment, academic management, fee collection with M-Pesa, parent communication, and comprehensive reporting.",
      "The system provides dedicated portals for administrators, teachers, students, and parents — each with tailored features and role-based access. Real-time SMS notifications keep parents informed about fees, results, and school events.",
      "CBC and 8-4-4 curriculum compliant, the system handles grading, report card generation, exam scheduling, and KNEC data integration for national examinations."
    ],
    features: [
      { name: "Student Management", desc: "Enrollment, admissions, student profiles, class allocation, and academic history." },
      { name: "Fee Management", desc: "Fee structures, invoicing, M-Pesa payment collection, balance tracking, and receipts." },
      { name: "Academic Management", desc: "Exam creation, grading, report cards, class rankings, and CBC/8-4-4 support." },
      { name: "Parent Portal", desc: "View results, fee balances, attendance, communicate with teachers, and receive notifications." },
      { name: "Teacher Portal", desc: "Class management, mark entry, lesson plans, attendance marking, and messaging." },
      { name: "SMS Notifications", desc: "Automated SMS for fee reminders, results release, events, and emergency alerts." },
      { name: "Attendance Tracking", desc: "Daily attendance for students and staff with biometric or manual entry options." },
      { name: "Library Management", desc: "Book catalog, issue/return tracking, fine management, and barcode scanning." },
      { name: "Transport Management", desc: "Bus routes, driver management, student allocation, and GPS tracking." },
      { name: "Report Generation", desc: "KNEC reports, fee reports, attendance summaries, and custom analytics." },
    ],
    modules: ["Admissions", "Academics", "Finance", "Library", "Transport", "Dormitory", "Staff HR", "Communications"],
    benefits: ["Paperless school administration", "M-Pesa fee collection", "Real-time parent updates", "CBC & 8-4-4 compliant", "Comprehensive KNEC reporting"],
  },
  "bulk-sms": {
    icon: MessageSquare,
    title: "Bulk SMS Platform",
    desc: "Marketing, transactional, and OTP SMS solutions with developer API.",
    img: portfolioSms,
    details: [
      "Send thousands of SMS messages instantly for marketing campaigns, transaction alerts, and OTP verification. Our platform connects directly to Safaricom, Airtel, and Telkom networks for maximum delivery rates across Kenya.",
      "The platform includes a developer-friendly REST API for integration with your existing systems, a web dashboard for managing campaigns, contact lists, and delivery reports, and webhook support for real-time status updates.",
      "Whether you need to send promotional offers, order confirmations, appointment reminders, or two-factor authentication codes, our SMS platform handles it with 99.9% delivery rates."
    ],
    features: [
      { name: "Marketing SMS", desc: "Bulk promotional messages with personalization, scheduling, and campaign analytics." },
      { name: "Transactional SMS", desc: "Order confirmations, payment receipts, shipping updates, and system notifications." },
      { name: "OTP Verification", desc: "One-time password delivery for login verification, transactions, and account security." },
      { name: "SMS API Integration", desc: "RESTful API with SDKs for Node.js, Python, PHP, and Java. Send SMS from your apps." },
      { name: "Contact Management", desc: "Import contacts, create groups, manage opt-outs, and segment audiences." },
      { name: "Delivery Reports", desc: "Real-time delivery status, bounce tracking, and comprehensive analytics dashboard." },
      { name: "Scheduled Sending", desc: "Schedule campaigns for optimal delivery times with timezone support." },
      { name: "Custom Sender ID", desc: "Send from your brand name instead of a random number for better recognition." },
    ],
    benefits: ["99.9% delivery rate", "All Kenyan networks", "Developer-friendly API", "Affordable rates from KSh 0.50/SMS", "Real-time delivery reports"],
  },
  "payment-integration": {
    icon: CreditCard,
    title: "Payment Integration",
    desc: "M-Pesa, PayPal, and card payment gateway integration.",
    img: portfolioMpesa,
    details: [
      "We integrate secure payment gateways into your website, mobile app, or business system. From M-Pesa STK Push to PayPal, Visa/Mastercard, and bank transfers, we ensure your customers can pay seamlessly.",
      "Our M-Pesa integration expertise includes STK Push (Lipa Na M-Pesa), C2B (Customer to Business), B2C (Business to Customer for disbursements), and B2B (Business to Business) through Safaricom's Daraja API.",
      "We also build custom payment dashboards for reconciliation, automated receipting, subscription billing, and multi-currency support for international businesses."
    ],
    features: [
      { name: "M-Pesa STK Push", desc: "Lipa Na M-Pesa integration — customers pay with one tap on their phone." },
      { name: "M-Pesa C2B & B2C", desc: "Customer to business payments and business to customer disbursements." },
      { name: "PayPal Integration", desc: "Accept international PayPal payments with automatic currency conversion." },
      { name: "Card Payments", desc: "Visa and Mastercard payments via Stripe, Flutterwave, or Pesapal gateway." },
      { name: "Payment Dashboard", desc: "Real-time payment tracking, reconciliation, and automated financial reports." },
      { name: "Automated Receipts", desc: "Instant digital receipts via SMS and email after every successful payment." },
      { name: "Subscription Billing", desc: "Recurring payment support for SaaS, memberships, and service subscriptions." },
      { name: "Multi-Currency Support", desc: "Accept KES, USD, EUR, GBP with automatic currency conversion." },
    ],
    benefits: ["Increase payment success rate", "Automated reconciliation", "PCI-DSS compliant", "Support all payment methods", "Real-time notifications"],
  },
};

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = serviceData[slug || ""];

  if (!service) {
    return (
      <div className="section-padding text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Service not found</h1>
        <Link to="/services"><Button>Back to Services</Button></Link>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero/75" />
        </div>
        <div className="relative container-max px-4 lg:px-8 py-20">
          <div className="w-16 h-16 rounded-sm bg-accent/20 flex items-center justify-center mb-6">
            <Icon className="w-8 h-8 text-accent" />
          </div>
          <span className="section-label !text-accent">Our Services</span>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-hero-foreground">{service.title}</h1>
          <p className="text-hero-foreground/70 text-lg max-w-2xl mt-4">{service.desc}</p>
        </div>
      </section>

      {/* Product Image */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src={service.img} alt={service.title} className="w-full rounded-sm shadow-lg" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-label">Overview</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">About <span className="text-accent">{service.title}</span></h2>
              {service.details.map((d, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">{d}</p>
              ))}
              {service.benefits && (
                <div className="mt-6">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-accent mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules */}
      {service.modules && (
        <section className="py-12 bg-accent">
          <div className="container-max px-4 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <span className="text-accent-foreground font-heading font-bold text-sm uppercase tracking-wider">System Modules:</span>
              {service.modules.map((m) => (
                <span key={m} className="text-accent-foreground/80 text-sm font-medium border border-accent-foreground/20 px-4 py-1.5 rounded-sm">{m}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section-padding bg-section-alt">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="section-label justify-center">Features</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Comprehensive <span className="text-accent">Features</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-5 bg-card border rounded-sm hover-lift">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-sm mb-1">{f.name}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative container-max px-4 lg:px-8 text-center">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-hero-foreground mb-3">Ready to get started?</h3>
          <p className="text-hero-foreground/60 mb-8 text-sm max-w-md mx-auto">Contact us for a free consultation, demo, and custom quote for your business.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-semibold uppercase text-xs tracking-wider px-8 h-11">
                Get a Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" className="border-hero-foreground/30 text-hero-foreground hover:bg-hero-foreground/10 rounded-sm font-semibold uppercase text-xs tracking-wider px-8 h-11">
                View Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
