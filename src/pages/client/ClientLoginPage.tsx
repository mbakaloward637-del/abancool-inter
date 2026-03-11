import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ClientLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-hero items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 px-12 text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-sm gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-heading font-extrabold text-2xl">A</span>
            </div>
          </Link>
          <h2 className="font-heading text-3xl xl:text-4xl font-extrabold text-hero-foreground mb-4">
            Welcome to<br />Abancool Technology
          </h2>
          <p className="text-hero-foreground/70 text-base max-w-sm mx-auto mb-8">
            Manage your hosting, domains, invoices, and support tickets from your client portal.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {[
              { label: "Hosting", value: "99.9% Uptime" },
              { label: "Domains", value: "50+ Extensions" },
              { label: "Support", value: "24/7 Help" },
              { label: "Security", value: "SSL Included" },
            ].map((s) => (
              <div key={s.label} className="bg-hero-foreground/10 backdrop-blur-sm rounded-sm p-3 text-center border border-hero-foreground/10">
                <div className="text-accent font-heading font-bold text-xs">{s.value}</div>
                <div className="text-hero-foreground/50 text-[10px] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-sm gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold">A</span>
              </div>
              <span className="font-heading font-bold text-xl">Abancool</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold">Client Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Access your hosting client portal</p>
          </div>

          {/* WHMCS Login Form */}
          <form method="post" action="https://billing.abancool.com/dologin.php" className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                name="username"
                placeholder="Email Address"
                required
                className="pl-10 h-12 rounded-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="pl-10 pr-10 h-12 rounded-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <a
                href="https://billing.abancool.com/pwreset.php"
                className="text-xs text-accent hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-semibold uppercase text-xs tracking-wider"
            >
              Sign In <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <a
              href="https://billing.abancool.com/register.php"
              className="text-accent font-semibold hover:underline"
            >
              Create Account
            </a>
          </p>

          <div className="text-center mt-6">
            <Link to="/" className="text-xs text-muted-foreground hover:text-accent transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
