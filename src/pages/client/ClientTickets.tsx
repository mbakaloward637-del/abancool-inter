import { useEffect, useState } from "react";
import { fetchTickets, openTicket } from "@/lib/whmcs-api";
import { Headphones, Plus, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ClientTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "", deptid: "1", priority: "Medium" });

  const loadTickets = () => {
    setLoading(true);
    fetchTickets()
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await openTicket(form);
      toast({ title: "Ticket created", description: "Your support ticket has been submitted." });
      setShowForm(false);
      setForm({ subject: "", message: "", deptid: "1", priority: "Medium" });
      loadTickets();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open": return "bg-green-100 text-green-700 border-green-200";
      case "answered": return "bg-primary/10 text-primary border-primary/20";
      case "closed": return "bg-muted text-muted-foreground border-border";
      case "customer-reply": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-extrabold">Support Tickets</h1>
          <p className="text-muted-foreground text-sm mt-1">Get help from our support team</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm"
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? "Cancel" : "New Ticket"}
        </Button>
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-sm border border-border p-6 space-y-4">
          <h3 className="font-heading font-bold text-lg">Open a Support Ticket</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Department</label>
              <select
                value={form.deptid}
                onChange={(e) => setForm({ ...form, deptid: e.target.value })}
                className="w-full h-10 px-3 rounded-sm border border-input bg-background text-sm"
              >
                <option value="1">General Support</option>
                <option value="2">Billing</option>
                <option value="3">Technical Support</option>
                <option value="4">Sales</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full h-10 px-3 rounded-sm border border-input bg-background text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Subject</label>
            <Input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Brief description of your issue"
              required
              className="rounded-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe your issue in detail..."
              required
              rows={5}
              className="rounded-sm"
            />
          </div>
          <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit Ticket
          </Button>
        </form>
      )}

      {/* Tickets Table */}
      <div className="bg-card rounded-sm border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20">
            <Headphones className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No support tickets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Ticket #</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Subject</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Department</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Last Reply</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t: any) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">#{t.tid}</td>
                    <td className="px-6 py-4">
                      <span className="text-foreground font-medium">
                        {t.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{t.department}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={statusColor(t.status)}>{t.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{t.lastreply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
