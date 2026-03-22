<?php

namespace App\Http\Controllers;

use App\Models\LinkedAccount;
use App\Models\LineOaSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LineOaManagerController extends Controller
{
    private function getHeaders(): array
    {
        $token = LineOaSetting::current()->getEffectiveToken();
        return ['Authorization' => 'Bearer ' . $token];
    }

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

        // Users with LINE linked accounts
        $lineUsers = LinkedAccount::where('provider', 'line')
            ->with('user:id,name,avatar,profile_picture')
            ->get()
            ->map(fn($la) => [
                'id' => $la->user_id,
                'name' => $la->provider_name ?: $la->user?->name,
                'avatar' => $la->provider_avatar ?: $la->user?->avatar ?: $la->user?->profile_picture,
                'line_user_id' => $la->provider_id,
            ]);

        return Inertia::render('LineOaManager', [
            'settings' => [
                'channel_access_token' => $settings->channel_access_token ? '••••' . substr($settings->channel_access_token, -8) : null,
                'channel_access_token_set' => !empty($settings->channel_access_token),
                'channel_secret' => $settings->channel_secret ? '••••' . substr($settings->channel_secret, -4) : null,
                'channel_secret_set' => !empty($settings->channel_secret),
                'liff_id' => $settings->getEffectiveLiffId(),
                'line_oa_id' => $settings->line_oa_id,
                'rich_menu_config' => $settings->rich_menu_config,
                'welcome_message_config' => $settings->welcome_message_config,
                'liff_base_url' => $settings->getLiffUrl(),
            ],
            'quota' => $quota,
            'lineUsers' => $lineUsers,
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
            'welcome_message_config' => 'nullable|array',
        ]);

        $settings = LineOaSetting::current();

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
        if (array_key_exists('welcome_message_config', $validated)) {
            $settings->welcome_message_config = $validated['welcome_message_config'];
        }

        $settings->save();

        return back()->with('success', 'บันทึกการตั้งค่าเรียบร้อย');
    }

    // ==================== Welcome Message ====================

    public function sendTestWelcome(Request $request)
    {
        $request->validate([
            'line_user_ids' => 'required|array|min:1',
            'line_user_ids.*' => 'required|string',
        ]);

        $settings = LineOaSetting::current();
        $token = $settings->getEffectiveToken();

        if (!$token) {
            return back()->with('error', 'ยังไม่ได้ตั้งค่า Channel Access Token');
        }

        $flexMessage = $settings->buildWelcomeFlexMessage();
        $ids = $request->input('line_user_ids');
        $sent = 0;
        $failed = 0;

        foreach ($ids as $lineUserId) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $token,
                    'Content-Type' => 'application/json',
                ])->post('https://api.line.me/v2/bot/message/push', [
                    'to' => $lineUserId,
                    'messages' => [$flexMessage],
                ]);

                if ($response->successful()) {
                    $sent++;
                } else {
                    $failed++;
                }
            } catch (\Exception $e) {
                $failed++;
            }
        }

        if ($failed === 0) {
            return back()->with('success', "ส่ง Welcome Message สำเร็จ {$sent} คน");
        }

        return back()->with('error', "ส่งสำเร็จ {$sent} คน, ล้มเหลว {$failed} คน");
    }

    public function updateWelcomeMessage(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:100',
            'subtitle' => 'nullable|string|max:200',
            'features' => 'nullable|array|max:6',
            'features.*.icon' => 'required|string|max:10',
            'features.*.text' => 'required|string|max:100',
            'button_label' => 'nullable|string|max:40',
            'button_path' => 'nullable|string|max:100',
            'header_color' => 'nullable|string|max:10',
            'button_color' => 'nullable|string|max:10',
        ]);

        $settings = LineOaSetting::current();
        $settings->welcome_message_config = $validated;
        $settings->save();

        return back()->with('success', 'บันทึก Welcome Message สำเร็จ');
    }

    // ==================== Rich Menu ====================

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

            // Fetch images for each menu
            $menus = $menusRes->json('richmenus', []);
            foreach ($menus as &$menu) {
                $menu['imageUrl'] = '/api/lineoa-richmenu/' . $menu['richMenuId'] . '/image';
            }

            return response()->json([
                'richmenus' => $menus,
                'defaultRichMenuId' => $defaultId,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function fetchRichMenuImage(string $richMenuId)
    {
        $token = LineOaSetting::current()->getEffectiveToken();
        if (!$token) {
            abort(400, 'No token');
        }

        try {
            $response = Http::withHeaders(['Authorization' => 'Bearer ' . $token])
                ->get("https://api-data.line.me/v2/bot/richmenu/{$richMenuId}/content");

            if (!$response->successful()) {
                abort(404);
            }

            return response($response->body())
                ->header('Content-Type', $response->header('Content-Type', 'image/png'))
                ->header('Cache-Control', 'public, max-age=3600');
        } catch (\Exception $e) {
            abort(500, $e->getMessage());
        }
    }

    public function createRichMenu(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:300',
            'chat_bar_text' => 'required|string|max:14',
            'width' => 'required|integer|in:2500,1200',
            'height' => 'required|integer|min:250|max:1686',
            'areas' => 'required|array|min:1|max:20',
            'areas.*.x' => 'required|integer|min:0',
            'areas.*.y' => 'required|integer|min:0',
            'areas.*.width' => 'required|integer|min:1',
            'areas.*.height' => 'required|integer|min:1',
            'areas.*.action_type' => 'required|string|in:uri,message,postback',
            'areas.*.action_value' => 'required|string',
            'set_default' => 'boolean',
        ]);

        $token = LineOaSetting::current()->getEffectiveToken();
        if (!$token) {
            return response()->json(['error' => 'No token configured'], 400);
        }

        $headers = ['Authorization' => 'Bearer ' . $token, 'Content-Type' => 'application/json'];

        // Build areas array for LINE API
        $areas = array_map(function ($area) {
            $action = match ($area['action_type']) {
                'uri' => ['type' => 'uri', 'uri' => $area['action_value']],
                'message' => ['type' => 'message', 'text' => $area['action_value']],
                'postback' => ['type' => 'postback', 'data' => $area['action_value']],
            };

            return [
                'bounds' => [
                    'x' => $area['x'],
                    'y' => $area['y'],
                    'width' => $area['width'],
                    'height' => $area['height'],
                ],
                'action' => $action,
            ];
        }, $validated['areas']);

        $body = [
            'size' => ['width' => $validated['width'], 'height' => $validated['height']],
            'selected' => true,
            'name' => $validated['name'],
            'chatBarText' => $validated['chat_bar_text'],
            'areas' => $areas,
        ];

        try {
            $response = Http::withHeaders($headers)->post('https://api.line.me/v2/bot/richmenu', $body);

            if (!$response->successful()) {
                return response()->json(['error' => $response->json('message', 'Failed'), 'details' => $response->json()], $response->status());
            }

            $richMenuId = $response->json('richMenuId');

            // Set as default if requested
            if ($validated['set_default'] ?? false) {
                Http::withHeaders($headers)
                    ->post("https://api.line.me/v2/bot/user/all/richmenu/{$richMenuId}");
            }

            return response()->json(['richMenuId' => $richMenuId, 'message' => 'สร้าง Rich Menu สำเร็จ']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function uploadRichMenuImage(Request $request, string $richMenuId)
    {
        $request->validate([
            'image' => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        $token = LineOaSetting::current()->getEffectiveToken();
        if (!$token) {
            return response()->json(['error' => 'No token configured'], 400);
        }

        $file = $request->file('image');
        $mimeType = $file->getMimeType();

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => $mimeType,
            ])->withBody(
                file_get_contents($file->getRealPath()),
                $mimeType
            )->post("https://api-data.line.me/v2/bot/richmenu/{$richMenuId}/content");

            if ($response->successful()) {
                return response()->json(['message' => 'อัพโหลดรูป Rich Menu สำเร็จ']);
            }

            return response()->json(['error' => $response->json('message', 'Upload failed')], $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function setDefaultRichMenu(string $richMenuId)
    {
        $token = LineOaSetting::current()->getEffectiveToken();
        if (!$token) {
            return response()->json(['error' => 'No token configured'], 400);
        }

        try {
            $response = Http::withHeaders(['Authorization' => 'Bearer ' . $token])
                ->post("https://api.line.me/v2/bot/user/all/richmenu/{$richMenuId}");

            if ($response->successful()) {
                return response()->json(['message' => 'ตั้ง default Rich Menu สำเร็จ']);
            }

            return response()->json(['error' => $response->json('message', 'Failed')], $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteRichMenu(string $richMenuId)
    {
        $token = LineOaSetting::current()->getEffectiveToken();
        if (!$token) {
            return response()->json(['error' => 'No token configured'], 400);
        }

        try {
            $response = Http::withHeaders(['Authorization' => 'Bearer ' . $token])
                ->delete("https://api.line.me/v2/bot/richmenu/{$richMenuId}");

            if ($response->successful()) {
                return response()->json(['message' => 'ลบ Rich Menu สำเร็จ']);
            }

            return response()->json(['error' => $response->json('message', 'Failed')], $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateRichMenuAreas(Request $request, string $richMenuId)
    {
        $validated = $request->validate([
            'areas' => 'required|array|min:1|max:20',
            'areas.*.x' => 'required|integer|min:0',
            'areas.*.y' => 'required|integer|min:0',
            'areas.*.width' => 'required|integer|min:1',
            'areas.*.height' => 'required|integer|min:1',
            'areas.*.action_type' => 'required|string|in:uri,message,postback',
            'areas.*.action_value' => 'required|string',
        ]);

        // LINE API doesn't support updating areas directly — need to recreate
        // First, get current menu info
        $token = LineOaSetting::current()->getEffectiveToken();
        if (!$token) {
            return response()->json(['error' => 'No token configured'], 400);
        }

        $headers = ['Authorization' => 'Bearer ' . $token];

        try {
            // Get current menu
            $menuRes = Http::withHeaders($headers)->get("https://api.line.me/v2/bot/richmenu/{$richMenuId}");
            if (!$menuRes->successful()) {
                return response()->json(['error' => 'Rich Menu not found'], 404);
            }
            $menu = $menuRes->json();

            // Get current image
            $imageRes = Http::withHeaders($headers)->get("https://api-data.line.me/v2/bot/richmenu/{$richMenuId}/content");
            $imageData = $imageRes->successful() ? $imageRes->body() : null;
            $imageMime = $imageRes->successful() ? $imageRes->header('Content-Type') : null;

            // Check if this is the default
            $defaultRes = Http::withHeaders($headers)->get('https://api.line.me/v2/bot/user/all/richmenu');
            $isDefault = $defaultRes->successful() && $defaultRes->json('richMenuId') === $richMenuId;

            // Build new areas
            $areas = array_map(function ($area) {
                $action = match ($area['action_type']) {
                    'uri' => ['type' => 'uri', 'uri' => $area['action_value']],
                    'message' => ['type' => 'message', 'text' => $area['action_value']],
                    'postback' => ['type' => 'postback', 'data' => $area['action_value']],
                };
                return [
                    'bounds' => ['x' => $area['x'], 'y' => $area['y'], 'width' => $area['width'], 'height' => $area['height']],
                    'action' => $action,
                ];
            }, $validated['areas']);

            // Create new menu with updated areas
            $newMenuBody = [
                'size' => $menu['size'],
                'selected' => $menu['selected'] ?? true,
                'name' => $menu['name'],
                'chatBarText' => $menu['chatBarText'],
                'areas' => $areas,
            ];

            $createRes = Http::withHeaders(array_merge($headers, ['Content-Type' => 'application/json']))
                ->post('https://api.line.me/v2/bot/richmenu', $newMenuBody);

            if (!$createRes->successful()) {
                return response()->json(['error' => 'สร้าง Rich Menu ใหม่ไม่สำเร็จ: ' . $createRes->json('message', '')], 500);
            }

            $newRichMenuId = $createRes->json('richMenuId');

            // Upload image to new menu
            if ($imageData) {
                Http::withHeaders(array_merge($headers, ['Content-Type' => $imageMime ?: 'image/png']))
                    ->withBody($imageData, $imageMime ?: 'image/png')
                    ->post("https://api-data.line.me/v2/bot/richmenu/{$newRichMenuId}/content");
            }

            // Set as default if the old one was
            if ($isDefault) {
                Http::withHeaders($headers)
                    ->post("https://api.line.me/v2/bot/user/all/richmenu/{$newRichMenuId}");
            }

            // Delete old menu
            Http::withHeaders($headers)->delete("https://api.line.me/v2/bot/richmenu/{$richMenuId}");

            return response()->json([
                'message' => 'อัพเดท Rich Menu สำเร็จ',
                'oldRichMenuId' => $richMenuId,
                'newRichMenuId' => $newRichMenuId,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
