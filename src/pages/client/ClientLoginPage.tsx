import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export default function ClientLoginPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/client/dashboard");
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/client/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && form.password !== form.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setLoading(true);

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name, phone: form.phone },
          emailRedirectTo: window.location.origin,
        },
      });
      setLoading(false);
      if (error) {
        toast({ title: "Registration failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "Please check your email to verify your account before signing in." });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      setLoading(false);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Google Sign-In failed", description: String(error), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Branding Panel */}
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
            Manage your hosting, domains, invoices, and support tickets from one powerful dashboard.
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

      {/* Right - Form Panel */}
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
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold">{isRegister ? "Create Account" : "Sign In"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isRegister ? "Join Abancool to manage your services" : "Access your client dashboard"}
            </p>
          </div>

          <Button variant="outline" onClick={handleGoogleSignIn} className="w-full h-12 rounded-sm mb-6 font-medium text-sm border-2 hover:bg-muted/50 transition-colors">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-3 text-muted-foreground tracking-wider">or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="pl-10 h-12 rounded-sm" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="pl-10 h-12 rounded-sm" />
            </div>
            {isRegister && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Phone Number (+254...)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="pl-10 h-12 rounded-sm" />
              </div>
            )}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="pl-10 pr-10 h-12 rounded-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isRegister && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required className="pl-10 h-12 rounded-sm" />
              </div>
            )}

            {!isRegister && (
              <div className="flex justify-end">
                <Link to="#" className="text-xs text-accent hover:underline font-medium">Forgot password?</Link>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-semibold uppercase text-xs tracking-wider">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>{isRegister ? "Create Account" : "Sign In"} <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsRegister(!isRegister)} className="text-accent font-semibold hover:underline">
              {isRegister ? "Sign In" : "Create Account"}
            </button>
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
