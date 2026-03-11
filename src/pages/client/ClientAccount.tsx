import { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "@/lib/whmcs-api";
import { User, Loader2, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function ClientAccount() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    companyname: "",
    address1: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
  });

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          phonenumber: data.phonenumber || "",
          companyname: data.companyname || "",
          address1: data.address1 || "",
          city: data.city || "",
          state: data.state || "",
          postcode: data.postcode || "",
          country: data.country || "KE",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast({ title: "Profile updated", description: "Your account details have been saved." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold">My Account</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your profile information</p>
      </div>

      <form onSubmit={handleSave} className="bg-card rounded-sm border border-border p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">{form.firstname} {form.lastname}</h2>
            <p className="text-sm text-muted-foreground">{form.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">First Name</label>
            <Input value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} className="rounded-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Last Name</label>
            <Input value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} className="rounded-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone</label>
            <Input value={form.phonenumber} onChange={(e) => setForm({ ...form, phonenumber: e.target.value })} className="rounded-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Company</label>
            <Input value={form.companyname} onChange={(e) => setForm({ ...form, companyname: e.target.value })} className="rounded-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Address</label>
            <Input value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} className="rounded-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">City</label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Country</label>
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="rounded-sm" />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center gap-4">
          <Button type="submit" disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
          <a
            href="https://billing.abancool.com/pwreset.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline"
          >
            Change Password →
          </a>
        </div>
      </form>
    </div>
  );
}
