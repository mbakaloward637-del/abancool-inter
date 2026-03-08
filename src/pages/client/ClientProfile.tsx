import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function ClientProfile() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-heading text-2xl font-bold">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="rounded-xl bg-card border card-shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <Input defaultValue="John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input defaultValue="john@example.com" type="email" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Phone</label>
            <Input defaultValue="0712345678" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Company</label>
            <Input defaultValue="Acme Ltd" />
          </div>
        </div>
        <Button type="submit" className="gradient-primary text-primary-foreground border-0">Save Changes</Button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Password updated" }); }} className="rounded-xl bg-card border card-shadow p-6 space-y-4">
        <h2 className="font-heading font-semibold">Change Password</h2>
        <Input type="password" placeholder="Current Password" required />
        <Input type="password" placeholder="New Password" required />
        <Input type="password" placeholder="Confirm New Password" required />
        <Button type="submit" variant="outline">Update Password</Button>
      </form>
    </div>
  );
}
