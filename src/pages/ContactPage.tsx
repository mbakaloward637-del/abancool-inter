import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you shortly." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <>
      <section className="gradient-hero text-hero-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Get in touch with our team for inquiries, quotes, or support.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-5 mb-8">
              {[
                { icon: Phone, label: "Phone", value: "0728825152" },
                { icon: Mail, label: "Email", value: "info@abancool.com" },
                { icon: MapPin, label: "Location", value: "Garissa, Kenya" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{c.label}</div>
                    <div className="font-medium">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl overflow-hidden border h-64 bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Google Maps — Garissa, Kenya
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border card-shadow space-y-4"
          >
            <h2 className="font-heading text-2xl font-bold mb-2">Send a Message</h2>
            <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Textarea placeholder="Your Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
              <Send className="w-4 h-4 mr-2" /> Send Message
            </Button>
          </motion.form>
        </div>
      </section>
    </>
  );
}
