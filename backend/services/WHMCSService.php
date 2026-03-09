<?php
/**
 * WHMCSService — WHMCS API wrapper
 * Handles client management, orders, and billing sync.
 */
class WHMCSService
{
    private string $url;
    private string $identifier;
    private string $secret;

    public function __construct()
    {
        $this->url = env('WHMCS_URL', '');
        $this->identifier = env('WHMCS_API_IDENTIFIER', '');
        $this->secret = env('WHMCS_API_SECRET', '');
    }

    /**
     * Make a WHMCS API request.
     */
    private function request(string $action, array $params = []): array
    {
        $params = array_merge($params, [
            'identifier'   => $this->identifier,
            'secret'       => $this->secret,
            'action'       => $action,
            'responsetype' => 'json',
        ]);

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $this->url,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($params),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT        => 30,
        ]);

        $response = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return ['result' => 'error', 'message' => "cURL error: {$error}"];
        }

        return json_decode($response, true) ?: ['result' => 'error', 'message' => 'Invalid response'];
    }

    /**
     * Add a new client to WHMCS.
     */
    public function addClient(array $data): ?int
    {
        $result = $this->request('AddClient', [
            'firstname'   => $data['firstname'] ?? '',
            'lastname'    => $data['lastname'] ?? '',
            'email'       => $data['email'] ?? '',
            'phonenumber' => $data['phone'] ?? '',
            'address1'    => $data['address'] ?? 'N/A',
            'city'        => $data['city'] ?? 'Nairobi',
            'state'       => $data['state'] ?? 'Nairobi',
            'postcode'    => $data['postcode'] ?? '00100',
            'country'     => $data['country'] ?? 'KE',
            'password2'   => bin2hex(random_bytes(8)),
        ]);

        if ($result['result'] === 'success') {
            return (int) $result['clientid'];
        }

        return null;
    }

    /**
     * Find a WHMCS client by email.
     */
    public function getClientByEmail(string $email): ?array
    {
        $result = $this->request('GetClients', [
            'search' => $email,
        ]);

        if ($result['result'] === 'success' && !empty($result['clients']['client'])) {
            foreach ($result['clients']['client'] as $client) {
                if (strtolower($client['email']) === strtolower($email)) {
                    return $client;
                }
            }
        }

        return null;
    }

    /**
     * Add a hosting order in WHMCS.
     */
    public function addOrder(int $clientId, int $productId, string $domain, string $billingCycle, string $paymentMethod = 'mailin'): ?int
    {
        $result = $this->request('AddOrder', [
            'clientid'      => $clientId,
            'pid'           => $productId,
            'domain'        => $domain,
            'billingcycle'  => $billingCycle, // monthly, annually
            'paymentmethod' => $paymentMethod,
        ]);

        if ($result['result'] === 'success') {
            return (int) $result['orderid'];
        }

        return null;
    }

    /**
     * Accept (activate) an order.
     */
    public function acceptOrder(int $orderId): bool
    {
        $result = $this->request('AcceptOrder', [
            'orderid' => $orderId,
        ]);

        return $result['result'] === 'success';
    }

    /**
     * Record an invoice payment in WHMCS.
     */
    public function addInvoicePayment(int $invoiceId, string $transactionId, float $amount, string $gateway): bool
    {
        $result = $this->request('AddInvoicePayment', [
            'invoiceid' => $invoiceId,
            'transid'   => $transactionId,
            'amount'    => $amount,
            'gateway'   => $gateway,
        ]);

        return $result['result'] === 'success';
    }

    /**
     * Get client's products/services.
     */
    public function getClientProducts(int $clientId): array
    {
        $result = $this->request('GetClientsProducts', [
            'clientid' => $clientId,
        ]);

        if ($result['result'] === 'success' && isset($result['products']['product'])) {
            return $result['products']['product'];
        }

        return [];
    }
}
