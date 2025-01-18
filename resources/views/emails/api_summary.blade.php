<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Summary Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; }
        .email-container { width: 90%; max-width: 800px; margin: 20px auto; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 150px; margin-bottom: 10px; }
        .header h1 { font-size: 20px; margin: 0; color: #555; }
        .table-container { margin: 20px 0; border-collapse: collapse; width: 100%; }
        .table-container th, .table-container td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table-container th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://actse.co.th/dist/img/logo/logo_actse.png" alt="ACTSE Logo">
            <h1>API Summary for Hormones Service</h1>
        </div>
        <p><strong>{{ $data['summary_title'] }}</strong></p>
        <p><strong>Send Date:</strong> {{ $data['send_date'] }}</p>
        <p><strong>Lab Entry Date:</strong> {{ $data['clinic_date'] }}</p>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Site Name</th>
                        <th>UID Count</th>
                        <th colspan="2">UID Lists</th>
                    </tr>
                    <tr>
                        <th colspan="2"></th>
                        <th>Service Date</th>
                        <th>UID</th>
                    </tr>
                </thead>
                <tbody>
                    {!! $tableRows !!}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
