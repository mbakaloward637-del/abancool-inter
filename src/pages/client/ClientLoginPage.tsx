import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function ClientLoginPage() {
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: isRegister ? "Registration" : "Login", description: "This feature requires backend integration." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-section-alt px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold">A</span>
            </div>
            <span className="font-heading font-bold text-xl">Abancool</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold">{isRegister ? "Create Account" : "Client Login"}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRegister ? "Register for a new account" : "Access your dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card border card-shadow space-y-4">
          {isRegister && (
            <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          )}
          <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          {isRegister && (
            <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          )}
          <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

          <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
            {isRegister ? "Create Account" : "Sign In"}
          </Button>

          {!isRegister && (
            <Link to="#" className="block text-center text-sm text-primary hover:underline">Forgot password?</Link>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-primary font-medium hover:underline">
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
