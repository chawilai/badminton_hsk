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
            'https://caremat.actse-clinic.com/api/ihri_data_api_send.php',
            'https://mplus-cmi.actse-clinic.com/api/ihri_data_api_send.php',
            'https://mplus-cri.actse-clinic.com/api/ihri_data_api_send.php',
            'https://mplus-plk.actse-clinic.com/api/ihri_data_api_send.php',
            'https://rsat-bkk.actse-clinic.com/api/ihri_data_api_send.php',
            'https://rsat-cbi.actse-clinic.com/api/ihri_data_api_send.php',
            'https://rsat-ska.actse-clinic.com/api/ihri_data_api_send.php',
            'https://rsat-ubn.actse-clinic.com/api/ihri_data_api_send.php',
        ];

        // $sites = [
        //     'https://carematapp.com.test/api/ihri_data_api_send.php',
        // ];

        $api_date = date('Y-m-d');
        // $api_date = '2025-01-14';

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
                        'uid_count' => count($json['uid_lists_email'] ?? []),
                        'uid_lists_email' => count($json['uid_lists_email']) > 0 ? $json['uid_lists_email'] : [],
                    ];
                } else {
                    $this->error("Failed to fetch data from: $site");
                }
            } catch (\Exception $e) {
                $this->error("Error connecting to $site: " . $e->getMessage());
            }
        }

        // Check if at least one site has records before sending the email
        $hasData = collect($data['site_data'])->contains(function ($site) {
            return $site['uid_count'] > 0;
        });

        if ($hasData) {
            $this->sendEmail($data);
            $this->info('API summary email sent successfully!');
        } else {
            $this->info('No data to send. Email not sent.');
        }

        // Save the summary data to the log file
        $jsonData = json_encode($data, JSON_UNESCAPED_UNICODE);
        $logFile = storage_path('logs/api_summary.json');
        file_put_contents($logFile, $jsonData);
    }


    private function sendEmail($data)
    {
        // Generate the HTML email content
        $tableRows = '';
        foreach ($data['site_data'] as $site) {

            if (count($site['uid_lists_email']) > 0) {
                $tableRows .= "<tr>
                    <td rowspan='" . (count($site['uid_lists_email']) + 1) . "'>{$site['site_name']}</td>
                    <td rowspan='" . (count($site['uid_lists_email']) + 1) . "'>{$site['uid_count']}</td>
                </tr>";
                // Add rows for UID Lists
                foreach ($site['uid_lists_email'] as $uidData) {
                    $tableRows .= "<tr>
                        <td>{$uidData['service_date']}</td>
                        <td>{$uidData['uid']}</td>
                    </tr>";
                }
            } else {
                $tableRows .= "<tr>
                    <td rowspan='" . (count($site['uid_lists_email']) + 1) . "'>{$site['site_name']}</td>
                    <td rowspan='" . (count($site['uid_lists_email']) + 1) . "'>{$site['uid_count']}</td>
                    <td></td>
                    <td></td>
                </tr>";
            }
        }

        $htmlContent = view('emails.api_summary', ['data' => $data, 'tableRows' => $tableRows])->render();

        // Send the email
        Mail::html($htmlContent, function ($message) {
            $date = date("Y-m-d");
            $message->to('wat.chawilai@gmail.com')
                ->cc(['it@ihri.org', 'pravit@ihri.org', 'pathompong.s@ihri.org', 'tidarat@ihri.org'])
                ->subject("API Summary for Hormones Service : {$date} (Testing)");
        });
    }
}
