<?php

namespace App\Http\Controllers;

use App\Models\LineOaSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LineOaManagerController extends Controller
{
    public function index()
    {
        $settings = LineOaSetting::current();

        // Fetch LINE quota
        $quota = ['quota' => 0, 'used' => 0, 'remaining' => 0];
        try {
            $token = $settings->getEffectiveToken();
            if ($token) {
                $headers = ['Authorization' => 'Bearer ' . $token];
                $quotaRes = Http::withHeaders($headers)->get('https://api.line.me/v2/bot/message/quota');
                $usageRes = Http::withHeaders($headers)->get('https://api.line.me/v2/bot/message/quota/consumption');
                $q = $quotaRes->json('value', 0);
                $u = $usageRes->json('totalUsage', 0);
                $quota = ['quota' => $q, 'used' => $u, 'remaining' => max(0, $q - $u)];
            }
        } catch (\Exception $e) {
            Log::warning('LINE quota fetch failed', ['error' => $e->getMessage()]);
        }

        return Inertia::render('LineOaManager', [
            'settings' => [
                'channel_access_token' => $settings->channel_access_token ? '••••' . substr($settings->channel_access_token, -8) : null,
                'channel_access_token_set' => !empty($settings->channel_access_token),
                'channel_secret' => $settings->channel_secret ? '••••' . substr($settings->channel_secret, -4) : null,
                'channel_secret_set' => !empty($settings->channel_secret),
                'liff_id' => $settings->getEffectiveLiffId(),
                'line_oa_id' => $settings->line_oa_id,
                'rich_menu_config' => $settings->rich_menu_config,
                'liff_base_url' => $settings->getLiffUrl(),
            ],
            'quota' => $quota,
            'envConfig' => [
                'liff_id' => config('services.line.liff_id'),
                'token_set' => !empty(config('services.line.channel_access_token')),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'channel_access_token' => 'nullable|string|max:500',
            'channel_secret' => 'nullable|string|max:255',
            'liff_id' => 'nullable|string|max:50',
            'line_oa_id' => 'nullable|string|max:50',
            'rich_menu_config' => 'nullable|array',
        ]);

        $settings = LineOaSetting::current();

        // Only update token/secret if a new value is provided (not the masked version)
        if (isset($validated['channel_access_token']) && !str_starts_with($validated['channel_access_token'] ?? '', '••••')) {
            $settings->channel_access_token = $validated['channel_access_token'] ?: null;
        }
        if (isset($validated['channel_secret']) && !str_starts_with($validated['channel_secret'] ?? '', '••••')) {
            $settings->channel_secret = $validated['channel_secret'] ?: null;
        }
        if (array_key_exists('liff_id', $validated)) {
            $settings->liff_id = $validated['liff_id'] ?: null;
        }
        if (array_key_exists('line_oa_id', $validated)) {
            $settings->line_oa_id = $validated['line_oa_id'] ?: null;
        }
        if (array_key_exists('rich_menu_config', $validated)) {
            $settings->rich_menu_config = $validated['rich_menu_config'];
        }

        $settings->save();

        return back()->with('success', 'บันทึกการตั้งค่าเรียบร้อย');
    }

    public function sendTestWelcome(Request $request)
    {
        $request->validate(['line_user_id' => 'required|string']);

        $settings = LineOaSetting::current();
        $token = $settings->getEffectiveToken();

        if (!$token) {
            return back()->with('error', 'ยังไม่ได้ตั้งค่า Channel Access Token');
        }

        $appUrl = config('app.url', 'https://badmintonparty.com');
        if (!str_starts_with($appUrl, 'https://')) {
            $appUrl = 'https://badmintonparty.com';
        }
        $logoUrl = $appUrl . '/icons/logo2.png';
        $liffUrl = $settings->getLiffUrl('party-lists');

        $featureItem = function (string $icon, string $text) {
            return [
                'type' => 'box', 'layout' => 'horizontal',
                'contents' => [
                    ['type' => 'text', 'text' => $icon, 'size' => 'sm', 'flex' => 0],
                    ['type' => 'text', 'text' => $text, 'size' => 'sm', 'color' => '#333333', 'wrap' => true, 'flex' => 1, 'margin' => 'md'],
                ],
            ];
        };

        $flexMessage = [
            'type' => 'flex',
            'altText' => 'Badminton Party - สร้างปาร์ตี้แบดมินตันง่ายๆ',
            'contents' => [
                'type' => 'bubble', 'size' => 'mega',
                'header' => [
                    'type' => 'box', 'layout' => 'vertical',
                    'contents' => [['type' => 'image', 'url' => $logoUrl, 'size' => 'xl', 'aspectMode' => 'fit', 'aspectRatio' => '3:1']],
                    'paddingAll' => '20px', 'backgroundColor' => '#f0fdf4',
                ],
                'body' => [
                    'type' => 'box', 'layout' => 'vertical',
                    'contents' => [
                        ['type' => 'text', 'text' => 'ยินดีต้อนรับสู่ Badminton Party!', 'weight' => 'bold', 'size' => 'lg', 'color' => '#166534', 'align' => 'center'],
                        ['type' => 'text', 'text' => 'ระบบจัดการปาร์ตี้แบดมินตันครบวงจร', 'size' => 'sm', 'color' => '#666666', 'align' => 'center', 'margin' => 'sm'],
                        ['type' => 'separator', 'margin' => 'lg'],
                        ['type' => 'box', 'layout' => 'vertical', 'contents' => [
                            $featureItem('🏸', 'สร้างปาร์ตี้แบดมินตัน'),
                            $featureItem('👥', 'เข้าร่วมปาร์ตี้กับเพื่อนๆ'),
                            $featureItem('🎮', 'สร้างเกม จับคู่อัตโนมัติ Track จำนวนเกม'),
                            $featureItem('📊', 'บันทึก & ตรวจสอบประวัติการเล่น'),
                        ], 'margin' => 'lg', 'spacing' => 'md'],
                        ['type' => 'separator', 'margin' => 'lg'],
                        ['type' => 'box', 'layout' => 'vertical', 'contents' => [
                            ['type' => 'box', 'layout' => 'horizontal', 'contents' => [
                                ['type' => 'text', 'text' => 'LINE OA', 'size' => 'xs', 'color' => '#999999', 'flex' => 0],
                                ['type' => 'text', 'text' => $settings->line_oa_id ?: '@badmintonparty', 'size' => 'xs', 'color' => '#06C755', 'align' => 'end', 'weight' => 'bold'],
                            ]],
                            ['type' => 'box', 'layout' => 'horizontal', 'contents' => [
                                ['type' => 'text', 'text' => 'Website', 'size' => 'xs', 'color' => '#999999', 'flex' => 0],
                                ['type' => 'text', 'text' => 'www.badmintonparty.com', 'size' => 'xs', 'color' => '#166534', 'align' => 'end', 'weight' => 'bold'],
                            ], 'margin' => 'sm'],
                        ], 'margin' => 'lg'],
                    ],
                    'paddingAll' => '20px',
                ],
                'footer' => [
                    'type' => 'box', 'layout' => 'vertical',
                    'contents' => [
                        ['type' => 'button', 'action' => ['type' => 'uri', 'label' => 'เริ่มใช้งาน Badminton Party', 'uri' => $liffUrl], 'style' => 'primary', 'color' => '#22c55e', 'height' => 'sm'],
                        ['type' => 'button', 'action' => ['type' => 'uri', 'label' => 'เข้าสู่เว็บไซต์', 'uri' => $appUrl], 'style' => 'link', 'color' => '#166534', 'height' => 'sm', 'margin' => 'sm'],
                    ],
                    'paddingAll' => '15px',
                ],
            ],
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
            ])->post('https://api.line.me/v2/bot/message/push', [
                'to' => $request->input('line_user_id'),
                'messages' => [$flexMessage],
            ]);

            if ($response->successful()) {
                return back()->with('success', 'ส่ง Welcome Message สำเร็จ');
            }

            return back()->with('error', 'ส่งไม่สำเร็จ: ' . $response->body());
        } catch (\Exception $e) {
            return back()->with('error', 'เกิดข้อผิดพลาด: ' . $e->getMessage());
        }
    }

    public function fetchRichMenu()
    {
        $settings = LineOaSetting::current();
        $token = $settings->getEffectiveToken();

        if (!$token) {
            return response()->json(['error' => 'No token configured'], 400);
        }

        try {
            $headers = ['Authorization' => 'Bearer ' . $token];

            $menusRes = Http::withHeaders($headers)->get('https://api.line.me/v2/bot/richmenu/list');
            $defaultRes = Http::withHeaders($headers)->get('https://api.line.me/v2/bot/user/all/richmenu');

            $defaultId = $defaultRes->successful() ? $defaultRes->json('richMenuId') : null;

            return response()->json([
                'richmenus' => $menusRes->json('richmenus', []),
                'defaultRichMenuId' => $defaultId,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
