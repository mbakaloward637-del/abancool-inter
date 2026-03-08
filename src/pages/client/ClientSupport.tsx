import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const tickets = [
  { id: "TKT-001", subject: "SSL Certificate Issue", dept: "Technical", status: "Open", date: "2026-03-05" },
  { id: "TKT-002", subject: "Invoice Query", dept: "Billing", status: "Closed", date: "2026-02-20" },
];

export default function ClientSupport() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Ticket submitted", description: "We'll respond shortly." });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Support Tickets</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground border-0">
          {showForm ? "Cancel" : "Open Ticket"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-card border card-shadow p-6 space-y-4">
          <Select>
            <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="technical">Technical Support</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Subject" required />
          <Textarea placeholder="Describe your issue..." rows={5} required />
          <Button type="submit" className="gradient-primary text-primary-foreground border-0">Submit Ticket</Button>
        </form>
      )}

      <div className="rounded-xl bg-card border card-shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Subject</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Department</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{t.id}</td>
                <td className="p-3">{t.subject}</td>
                <td className="p-3">{t.dept}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.status === "Open" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{t.date}</td>
                <td className="p-3"><Button size="sm" variant="outline" className="text-xs h-7">View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
