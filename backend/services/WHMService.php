<?php
/**
 * WHMService — WHM/cPanel API wrapper
 * Handles account creation, suspension, stats, and SSO via WHM JSON API.
 */
class WHMService
{
    private string $host;
    private int $port;
    private string $token;
    private string $baseUrl;

    public function __construct()
    {
        $this->host = env('WHM_HOST', 'server.abancool.com');
        $this->port = (int) env('WHM_PORT', 2087);
        $this->token = env('WHM_TOKEN', '');
        $this->baseUrl = "https://{$this->host}:{$this->port}/json-api";
    }

    /**
     * Make an authenticated WHM API request.
     */
    private function request(string $endpoint, array $params = [], string $method = 'GET'): array
    {
        $url = "{$this->baseUrl}/{$endpoint}";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTPHEADER     => [
                "Authorization: whm root:{$this->token}",
                'Content-Type: application/x-www-form-urlencoded',
            ],
        ]);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        } else {
            $url .= '?' . http_build_query($params);
            curl_setopt($ch, CURLOPT_URL, $url);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return ['success' => false, 'error' => "cURL error: {$error}"];
        }

        $data = json_decode($response, true);
        if (!$data) {
            return ['success' => false, 'error' => 'Invalid response from WHM', 'http_code' => $httpCode];
        }

        return $data;
    }

    /**
     * Generate a unique cPanel username from domain.
     */
    private function generateUsername(string $domain): string
    {
        $clean = preg_replace('/[^a-z0-9]/', '', strtolower($domain));
        return substr($clean, 0, 8);
    }

    /**
     * Create a new cPanel account.
     */
    public function createAccount(string $username, string $domain, string $plan, string $contactemail): array
    {
        $result = $this->request('createacct', [
            'username'     => $username,
            'domain'       => $domain,
            'plan'         => $plan,
            'contactemail' => $contactemail,
            'reseller'     => 0,
        ], 'POST');

        $success = isset($result['result'][0]['status']) && $result['result'][0]['status'] == 1;

        return [
            'success'    => $success,
            'cpanel_url' => "https://{$this->host}:2083",
            'username'   => $username,
            'raw'        => $result,
        ];
    }

    /**
     * Suspend a cPanel account.
     */
    public function suspendAccount(string $username, string $reason = 'Suspended by admin'): array
    {
        return $this->request('suspendacct', [
            'user'   => $username,
            'reason' => $reason,
        ], 'POST');
    }

    /**
     * Unsuspend a cPanel account.
     */
    public function unsuspendAccount(string $username): array
    {
        return $this->request('unsuspendacct', [
            'user' => $username,
        ], 'POST');
    }

    /**
     * Terminate (delete) a cPanel account.
     */
    public function terminateAccount(string $username): array
    {
        return $this->request('removeacct', [
            'user' => $username,
        ], 'POST');
    }

    /**
     * Get account resource usage stats.
     */
    public function getAccountStats(string $username): array
    {
        $result = $this->request('accountsummary', ['user' => $username]);

        if (!isset($result['acct'][0])) {
            return ['success' => false, 'error' => 'Account not found'];
        }

        $acct = $result['acct'][0];

        return [
            'success'          => true,
            'disk_used_mb'     => (int) ($acct['diskused'] ?? 0),
            'disk_limit_mb'    => $acct['disklimit'] === 'unlimited' ? -1 : (int) ($acct['disklimit'] ?? 0),
            'bandwidth_used_mb'  => (int) (($acct['bandwidthused'] ?? 0) / 1048576),
            'bandwidth_limit_mb' => $acct['bandwidthlimit'] === 'unlimited' ? -1 : (int) ($acct['bandwidthlimit'] ?? 0),
            'email_accounts'   => (int) ($acct['emailcount'] ?? 0),
            'email_limit'      => $acct['maxpop'] === 'unlimited' ? -1 : (int) ($acct['maxpop'] ?? 0),
            'databases'        => (int) ($acct['sqlcount'] ?? 0),
            'database_limit'   => $acct['maxsql'] === 'unlimited' ? -1 : (int) ($acct['maxsql'] ?? 0),
            'addon_domains'    => (int) ($acct['addondomains'] ?? 0),
            'parked_domains'   => (int) ($acct['parkeddomains'] ?? 0),
            'suspended'        => (bool) ($acct['suspended'] ?? false),
            'plan'             => $acct['plan'] ?? 'unknown',
        ];
    }

    /**
     * Create a one-time SSO session URL for auto-login to cPanel.
     */
    public function createSession(string $username): ?string
    {
        $result = $this->request('create_user_session', [
            'user'    => $username,
            'service' => 'cpaneld',
        ], 'POST');

        if (isset($result['data']['url'])) {
            return $result['data']['url'];
        }

        // Fallback: try alternate response structure
        if (isset($result['url'])) {
            return $result['url'];
        }

        return null;
    }

    /**
     * List all accounts on the server.
     */
    public function listAccounts(): array
    {
        $result = $this->request('listaccts');
        return $result['acct'] ?? [];
    }

    /**
     * Generate username from domain (public helper).
     */
    public function makeUsername(string $domain): string
    {
        return $this->generateUsername($domain);
    }
}
