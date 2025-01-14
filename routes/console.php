<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('sendmail', function () {
    $data = [
        'send_date' => '2025-01-13 23:48:35',
        'summary_title' => 'API send data for Hormones service FROM CBOs to IHRI',
        'site_data' => [
            ['site_name' => 'CCM', 'uid_count' => 2, 'uid_lists' => ['P24-10831', 'P25-00172']],
            ['site_name' => 'MCM', 'uid_count' => 1, 'uid_lists' => ['P24-10833']],
            ['site_name' => 'MCR', 'uid_count' => 1, 'uid_lists' => ['P24-10835']],
            ['site_name' => 'MPL', 'uid_count' => 1, 'uid_lists' => ['P24-10837']],
            ['site_name' => 'RBK', 'uid_count' => 2, 'uid_lists' => ['P24-10837', 'P25-00178']],
            ['site_name' => 'RCB', 'uid_count' => 3, 'uid_lists' => ['P24-10844', 'P25-00122', 'P25-00333']],
            ['site_name' => 'RHY', 'uid_count' => 1, 'uid_lists' => ['P25-00133']],
            ['site_name' => 'RUB', 'uid_count' => 1, 'uid_lists' => ['P25-00199']],
        ],
    ];

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


    Mail::html($htmlContent, function ($message) {
        $date = date("Y-m-d");
        $message->to('wat.chawilai@gmail.com')
            // ->cc(['it@ihri.org', 'pravit@ihri.org', 'pintusorn@ihri.org'])
            ->subject("API Summary for Hormones Service : {$date} (Testing)");
    });
})->purpose('Display an inspiring quote')->hourly();


Schedule::call(function () {

    $data = [
        'send_date' => '2025-01-13 23:48:35',
        'summary_title' => 'API send data for Hormones service FROM CBOs to IHRI',
        'site_data' => [
            ['site_name' => 'CCM', 'uid_count' => 2, 'uid_lists' => ['P24-10831', 'P25-00172']],
            ['site_name' => 'MCM', 'uid_count' => 1, 'uid_lists' => ['P24-10833']],
            ['site_name' => 'MCR', 'uid_count' => 1, 'uid_lists' => ['P24-10835']],
            ['site_name' => 'MPL', 'uid_count' => 1, 'uid_lists' => ['P24-10837']],
            ['site_name' => 'RBK', 'uid_count' => 2, 'uid_lists' => ['P24-10837', 'P25-00178']],
            ['site_name' => 'RCB', 'uid_count' => 3, 'uid_lists' => ['P24-10844', 'P25-00122', 'P25-00333']],
            ['site_name' => 'RHY', 'uid_count' => 1, 'uid_lists' => ['P25-00133']],
            ['site_name' => 'RUB', 'uid_count' => 1, 'uid_lists' => ['P25-00199']],
        ],
    ];

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

    Mail::html($htmlContent, function ($message) {
        $date = date("Y-m-d");
        $message->to('wat.chawilai@gmail.com')
            // ->cc(['it@ihri.org', 'pravit@ihri.org', 'pintusorn@ihri.org'])
            ->subject("API Summary for Hormones Service : {$date} (Testing)");
    });
// })->daily();
})->everyMinute();
