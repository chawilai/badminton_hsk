<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ยืนยันอีเมล</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Helvetica Neue',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#2d6a4f,#40916c);padding:32px 24px;text-align:center;">
                            <div style="font-size:48px;margin-bottom:8px;">🏸</div>
                            <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;">Badminton Party</h1>
                            <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:6px 0 0;">ยืนยันอีเมลของคุณ</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding:32px 24px;">
                            <p style="color:#333;font-size:15px;margin:0 0 8px;">สวัสดี <strong>{{ $userName }}</strong>,</p>
                            <p style="color:#666;font-size:14px;margin:0 0 24px;line-height:1.6;">กรุณาใช้รหัสด้านล่างเพื่อยืนยันอีเมลของคุณ รหัสจะหมดอายุใน 10 นาที</p>

                            <!-- OTP Code -->
                            <div style="background-color:#f0faf4;border:2px dashed #40916c;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                                <div style="font-size:36px;font-weight:800;letter-spacing:12px;color:#2d6a4f;font-family:'Courier New',monospace;">{{ $code }}</div>
                            </div>

                            <p style="color:#999;font-size:12px;margin:0;line-height:1.5;">หากคุณไม่ได้ทำรายการนี้ กรุณาเพิกเฉยต่ออีเมลนี้<br>รหัสนี้ใช้ได้ครั้งเดียวเท่านั้น</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f9f7f3;padding:16px 24px;text-align:center;border-top:1px solid #eee;">
                            <p style="color:#aaa;font-size:11px;margin:0;">&copy; {{ date('Y') }} Badminton Party. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
