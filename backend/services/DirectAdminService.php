<?php
/**
 * DirectAdminService — DirectAdmin API wrapper
 * Handles account management and SSO for DirectAdmin panel.
 */
class DirectAdminService
{
    private string $host;
    private int $port;
    private string $adminUser;
    private string $adminPassword;
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->host = env('DA_HOST', 'da.abancool.com');
        $this->port = (int) env('DA_PORT', 2222);
        $this->adminUser = env('DA_ADMIN_USER', 'admin');
        $this->adminPassword = env('DA_ADMIN_PASSWORD', '');
        $this->apiKey = env('DA_API_KEY', '');
        $this->baseUrl = "https://{$this->host}:{$this->port}";
    }

    /**
     * Make an authenticated DirectAdmin API request.
     */
    private function request(string $endpoint, array $params = [], string $method = 'GET'): array
    {
        $url = "{$this->baseUrl}/{$endpoint}";

        $ch = curl_init();
        $headers = ['Content-Type: application/x-www-form-urlencoded'];

        // Auth: API key or basic auth
        if ($this->apiKey) {
            $headers[] = "Authorization: Bearer {$this->apiKey}";
        } else {
            curl_setopt($ch, CURLOPT_USERPWD, "{$this->adminUser}:{$this->adminPassword}");
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTPHEADER     => $headers,
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

        // DirectAdmin returns URL-encoded or JSON
        $data = json_decode($response, true);
        if (!$data) {
            parse_str($response, $data);
        }

        $data['http_code'] = $httpCode;
        return $data;
    }

    /**
     * Create a new DirectAdmin user account.
     */
    public function createAccount(string $username, string $domain, string $package, string $email, string $password): array
    {
        $result = $this->request('CMD_API_ACCOUNT_USER', [
            'action'   => 'create',
            'add'      => 'Submit',
            'username' => $username,
            'domain'   => $domain,
            'package'  => $package,
            'email'    => $email,
            'passwd'   => $password,
            'passwd2'  => $password,
            'ip'       => 'shared',
            'notify'   => 'yes',
        ], 'POST');

        $success = isset($result['error']) && $result['error'] === '0';

        return [
            'success'  => $success,
            'username' => $username,
            'raw'      => $result,
        ];
    }

    /**
     * Suspend a user account.
     */
    public function suspendAccount(string $username): array
    {
        return $this->request('CMD_API_SELECT_USERS', [
            'location' => 'CMD_SELECT_USERS',
            'suspend'  => 'Suspend',
            'select0'  => $username,
        ], 'POST');
    }

    /**
     * Unsuspend a user account.
     */
    public function unsuspendAccount(string $username): array
    {
        return $this->request('CMD_API_SELECT_USERS', [
            'location'  => 'CMD_SELECT_USERS',
            'unsuspend' => 'Unsuspend',
            'select0'   => $username,
        ], 'POST');
    }

    /**
     * Delete a user account.
     */
    public function deleteAccount(string $username): array
    {
        return $this->request('CMD_API_SELECT_USERS', [
            'confirmed' => 'Confirm',
            'delete'    => 'yes',
            'select0'   => $username,
        ], 'POST');
    }

    /**
     * Get account usage stats.
     */
    public function getAccountStats(string $username): array
    {
        $result = $this->request('CMD_API_SHOW_USER_USAGE', ['user' => $username]);

        return [
            'success'            => true,
            'disk_used_mb'       => (int) ($result['quota'] ?? 0),
            'disk_limit_mb'      => (int) ($result['quota_limit'] ?? 0),
            'bandwidth_used_mb'  => (int) ($result['bandwidth'] ?? 0),
            'bandwidth_limit_mb' => (int) ($result['bandwidth_limit'] ?? 0),
            'email_accounts'     => (int) ($result['nemails'] ?? 0),
            'email_limit'        => (int) ($result['nemails_limit'] ?? 0),
            'databases'          => (int) ($result['mysql'] ?? 0),
            'database_limit'     => (int) ($result['mysql_limit'] ?? 0),
            'addon_domains'      => (int) ($result['ndomains'] ?? 0),
            'parked_domains'     => (int) ($result['npointers'] ?? 0),
            'suspended'          => ($result['suspended'] ?? 'no') === 'yes',
            'plan'               => $result['package'] ?? 'unknown',
        ];
    }

    /**
     * Create a one-time login URL for DirectAdmin SSO.
     */
    public function createLoginUrl(string $username): ?string
    {
        // Create a login key
        $keyName = 'sso_' . time();
        $result = $this->request('CMD_API_LOGIN_KEYS', [
            'action'     => 'create',
            'keyname'    => $keyName,
            'key'        => bin2hex(random_bytes(16)),
            'key2'       => '',
            'never_expires' => 'no',
            'max_uses'   => 1,
            'allow_htm'  => 'yes',
            'select_allow0' => 'ALL',
            'passwd'     => $this->adminPassword,
        ], 'POST');

        if (isset($result['error']) && $result['error'] !== '0') {
            return null;
        }

        // Build login URL
        return "{$this->baseUrl}/CMD_LOGIN?username={$username}&key={$keyName}";
    }

    /**
     * List all user accounts.
     */
    public function listAccounts(): array
    {
        $result = $this->request('CMD_API_SHOW_ALL_USERS');
        if (isset($result['list'])) {
            return $result['list'];
        }
        // DA may return users as keys
        return array_keys(array_filter($result, fn($v, $k) => is_numeric($k), ARRAY_FILTER_USE_BOTH));
    }
}
