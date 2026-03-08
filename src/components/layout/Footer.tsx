import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-hero text-hero-foreground">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">A</span>
              </div>
              <span className="font-heading font-bold text-lg">Abancool</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Professional technology solutions for modern businesses. Based in Garissa, Kenya, serving clients locally and internationally.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <div className="space-y-2 text-sm opacity-70">
              <Link to="/services/web-development" className="block hover:opacity-100 transition-opacity">Web Development</Link>
              <Link to="/services/software-development" className="block hover:opacity-100 transition-opacity">Software Development</Link>
              <Link to="/hosting" className="block hover:opacity-100 transition-opacity">Web Hosting</Link>
              <Link to="/domains" className="block hover:opacity-100 transition-opacity">Domain Registration</Link>
              <Link to="/services/bulk-sms" className="block hover:opacity-100 transition-opacity">Bulk SMS</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm opacity-70">
              <Link to="/about" className="block hover:opacity-100 transition-opacity">About Us</Link>
              <Link to="/portfolio" className="block hover:opacity-100 transition-opacity">Portfolio</Link>
              <Link to="/contact" className="block hover:opacity-100 transition-opacity">Contact</Link>
              <Link to="/client/login" className="block hover:opacity-100 transition-opacity">Client Login</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm opacity-70">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>0728825152</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@abancool.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Garissa, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-hero-foreground/10 text-center text-sm opacity-50">
          © {new Date().getFullYear()} Abancool Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
