import { motion } from "framer-motion";
import { Award, Users, Target, Globe } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function AboutPage() {
  return (
    <>
      <section className="gradient-hero text-hero-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">About Abancool Technology</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            A professional technology company based in Garissa, Kenya providing modern digital solutions for businesses, organizations, and startups.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
            <h2 className="font-heading text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Abancool Technology, we believe every business deserves access to world-class technology solutions. We bridge the digital gap by providing affordable, reliable, and innovative technology services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From web development and custom software to hosting infrastructure and payment integrations, we empower businesses to thrive in the digital economy.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Award, title: "Excellence", desc: "Committed to delivering top-quality solutions" },
              { icon: Users, title: "Partnership", desc: "We grow alongside our clients" },
              { icon: Target, title: "Innovation", desc: "Embracing cutting-edge technology" },
              { icon: Globe, title: "Global Reach", desc: "Serving Kenya and international clients" },
            ].map((v, i) => (
              <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="p-5 rounded-xl bg-card border card-shadow text-center">
                <v.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-sm mb-1">{v.title}</h3>
                <p className="text-xs text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
