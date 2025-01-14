<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class SendIHRIApiSummaryEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:send-ihri-summary';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send API requests to sites, summarize the results, and email the summary';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sites = [
            'https://www.caremat.actse-clinic.com/api/ihri_data_api_send.php',
            'https://www.mplus-cmi.actse-clinic.com/api/ihri_data_api_send.php',
            'https://www.mplus-cri.actse-clinic.com/api/ihri_data_api_send.php',
            'https://www.mplus-plk.actse-clinic.com/api/ihri_data_api_send.php',
            'https://www.rsat-bkk.actse-clinic.com/api/ihri_data_api_send.php',
            'https://www.rsat-cbi.actse-clinic.com/api/ihri_data_api_send.php',
            'https://www.rsat-ska.actse-clinic.com/api/ihri_data_api_send.php',
            'https://www.rsat-ubn.actse-clinic.com/api/ihri_data_api_send.php',
        ];

        // Loop through each site and collect API responses
        $api_date = date('Y-m-d');
        // $api_date = '2025-01-11';

        $data = [
            'send_date' => now()->format('Y-m-d H:i:s'),
            'clinic_date' => $api_date,
            'summary_title' => 'Summary of API Responses for Hormones Service',
            'site_data' => [],
        ];

        foreach ($sites as $site) {
            try {
                $response = Http::post($site, [
                    'api_date' => $api_date,
                ]);
                if ($response->successful()) {
                    $json = $response->json();
                    $data['site_data'][] = [
                        'site_name' => $json['site_name'] ?? 'Unknown Site',
                        'uid_count' => count($json['uid_lists'] ?? []),
                        'uid_lists' => count($json['uid_lists']) > 0 ? array_keys($json['uid_lists']) : [],
                    ];
                } else {
                    $this->error("Failed to fetch data from: $site");
                }
            } catch (\Exception $e) {
                $this->error("Error connecting to $site: " . $e->getMessage());
            }
        }

        $this->sendEmail($data);
        // \Log::info('API Summary Data:', $data);

        $jsonData = json_encode($data, JSON_UNESCAPED_UNICODE);
        $logFile = storage_path('logs/api_summary.json');
        file_put_contents($logFile, $jsonData . PHP_EOL, FILE_APPEND);
        // file_put_contents($logFile, $jsonData);

        $this->info('API summary email sent successfully!');
    }

    private function sendEmail($data)
    {
        // Generate the HTML email content
        $tableRows = '';
        foreach ($data['site_data'] as $site) {
            $tableRows .= "<tr>
                <td>{$site['site_name']}</td>
                <td>{$site['uid_count']}</td>
                <td>" . implode(', ', $site['uid_lists']) . "</td>
            </tr>";
        }

        $htmlContent = view('emails.api_summary', ['data' => $data, 'tableRows' => $tableRows])->render();

        // Send the email
        Mail::html($htmlContent, function ($message) {
            $date = date("Y-m-d");
            $message->to('wat.chawilai@gmail.com')
                ->cc(['it@ihri.org', 'pravit@ihri.org', 'pintusorn@ihri.org'])
                ->subject("API Summary for Hormones Service : {$date} (Testing)");
        });
    }
}
