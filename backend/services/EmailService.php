<?php
/**
 * EmailService — SMTP email sender using PHP sockets (no Composer needed).
 * Works on cPanel shared hosting without external libraries.
 */
class EmailService
{
    private string $host;
    private int $port;
    private string $user;
    private string $pass;
    private string $fromEmail;
    private string $fromName;

    public function __construct()
    {
        $this->host = env('SMTP_HOST', 'mail.abancool.com');
        $this->port = (int) env('SMTP_PORT', 587);
        $this->user = env('SMTP_USER', '');
        $this->pass = env('SMTP_PASS', '');
        $this->fromEmail = env('SMTP_FROM_EMAIL', 'support1@abancool.com');
        $this->fromName = env('SMTP_FROM_NAME', 'Abancool Technology');
    }

    /**
     * Send email via PHP mail() as fallback (works on all cPanel).
     */
    public function send(string $to, string $subject, string $htmlBody, string $textBody = ''): bool
    {
        $boundary = md5(time());
        
        $headers = [
            "From: {$this->fromName} <{$this->fromEmail}>",
            "Reply-To: {$this->fromEmail}",
            "MIME-Version: 1.0",
            "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
            "X-Mailer: Abancool-PHP",
        ];

        $body = "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
        $body .= ($textBody ?: strip_tags($htmlBody)) . "\r\n\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
        $body .= $htmlBody . "\r\n\r\n";
        $body .= "--{$boundary}--";

        $result = @mail($to, $subject, $body, implode("\r\n", $headers));
        
        if (!$result) {
            appLog("Email send failed to {$to}: {$subject}", 'error');
        }
        
        return $result;
    }

    /**
     * Send payment confirmation email.
     */
    public function sendPaymentConfirmation(string $to, string $name, float $amount, string $reference, string $method): bool
    {
        $subject = "Payment Received — KSh " . number_format($amount, 2);
        $html = $this->template("
            <h2>Payment Confirmed ✅</h2>
            <p>Dear {$name},</p>
            <p>We have received your payment. Details below:</p>
            <table style='width:100%;border-collapse:collapse;margin:20px 0'>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Amount</td><td style='padding:10px;border:1px solid #ddd'>KSh " . number_format($amount, 2) . "</td></tr>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Method</td><td style='padding:10px;border:1px solid #ddd'>" . strtoupper($method) . "</td></tr>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Reference</td><td style='padding:10px;border:1px solid #ddd'>{$reference}</td></tr>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Date</td><td style='padding:10px;border:1px solid #ddd'>" . date('M d, Y H:i') . "</td></tr>
            </table>
            <p>Your service will be activated shortly.</p>
        ");
        return $this->send($to, $subject, $html);
    }

    /**
     * Send hosting provisioned email.
     */
    public function sendHostingProvisioned(string $to, string $name, string $domain, string $username, string $panelUrl): bool
    {
        $subject = "Hosting Account Ready — {$domain}";
        $html = $this->template("
            <h2>Your Hosting is Live! 🚀</h2>
            <p>Dear {$name},</p>
            <p>Your hosting account has been set up successfully:</p>
            <table style='width:100%;border-collapse:collapse;margin:20px 0'>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Domain</td><td style='padding:10px;border:1px solid #ddd'>{$domain}</td></tr>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Username</td><td style='padding:10px;border:1px solid #ddd'>{$username}</td></tr>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Control Panel</td><td style='padding:10px;border:1px solid #ddd'><a href='{$panelUrl}'>{$panelUrl}</a></td></tr>
            </table>
            <p>You can also log in directly from your <a href='https://abancool.com/client/dashboard/cpanel'>dashboard</a>.</p>
        ");
        return $this->send($to, $subject, $html);
    }

    /**
     * Send invoice notification email.
     */
    public function sendInvoice(string $to, string $name, string $invoiceNumber, float $amount, string $dueDate, string $description): bool
    {
        $subject = "Invoice #{$invoiceNumber} — KSh " . number_format($amount, 2);
        $html = $this->template("
            <h2>New Invoice</h2>
            <p>Dear {$name},</p>
            <p>A new invoice has been generated for your account:</p>
            <table style='width:100%;border-collapse:collapse;margin:20px 0'>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Invoice #</td><td style='padding:10px;border:1px solid #ddd'>{$invoiceNumber}</td></tr>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Amount</td><td style='padding:10px;border:1px solid #ddd'>KSh " . number_format($amount, 2) . "</td></tr>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Due Date</td><td style='padding:10px;border:1px solid #ddd'>{$dueDate}</td></tr>
                <tr><td style='padding:10px;border:1px solid #ddd;font-weight:bold'>Description</td><td style='padding:10px;border:1px solid #ddd'>{$description}</td></tr>
            </table>
            <p><a href='https://abancool.com/client/dashboard/payments' style='background:#2563eb;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block'>Pay Now</a></p>
        ");
        return $this->send($to, $subject, $html);
    }

    /**
     * Wrap content in branded email template.
     */
    private function template(string $content): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
        <body style='margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif'>
            <div style='max-width:600px;margin:0 auto;padding:20px'>
                <div style='background:#1e293b;padding:24px;text-align:center;border-radius:12px 12px 0 0'>
                    <h1 style='color:#fff;margin:0;font-size:24px'>Abancool Technology</h1>
                    <p style='color:#94a3b8;margin:4px 0 0;font-size:14px'>Web Hosting & Software Solutions</p>
                </div>
                <div style='background:#fff;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.05)'>
                    {$content}
                </div>
                <div style='text-align:center;padding:20px;color:#71717a;font-size:12px'>
                    <p>&copy; " . date('Y') . " Abancool Technology. All rights reserved.</p>
                    <p>Nairobi, Kenya | support@abancool.com | +254 700 000 000</p>
                </div>
            </div>
        </body>
        </html>";
    }
}
