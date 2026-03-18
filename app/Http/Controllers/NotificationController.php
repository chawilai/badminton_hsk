<?php

namespace App\Http\Controllers;

use App\Models\NotificationLog;
use App\Models\NotificationSetting;
use App\Models\User;
use App\Services\LinePushService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Show notification settings page.
     */
    public function settings(): Response
    {
        $user = auth()->user();

        $settings = NotificationSetting::firstOrCreate(
            ['user_id' => $user->id],
            ['enabled' => true]
        );

        $recentLogs = NotificationLog::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return Inertia::render('NotificationSettings', [
            'settings' => $settings,
            'recentLogs' => $recentLogs,
            'hasLineAccount' => $user->provider === 'line' && !empty($user->provider_id),
        ]);
    }

    /**
     * Update notification settings.
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => 'boolean',
            'party_invite' => 'boolean',
            'party_reminder' => 'boolean',
            'game_start' => 'boolean',
            'game_result' => 'boolean',
            'friend_request' => 'boolean',
            'party_member_joined' => 'boolean',
        ]);

        NotificationSetting::updateOrCreate(
            ['user_id' => auth()->id()],
            $validated
        );

        return back()->with('success', 'บันทึกการตั้งค่าแจ้งเตือนเรียบร้อย');
    }

    /**
     * Send a test push notification to the current user.
     */
    public function sendTest(): RedirectResponse
    {
        $user = auth()->user();
        $service = new LinePushService();

        $result = $service->sendPush(
            $user,
            'party_invite',
            'ทดสอบแจ้งเตือน',
            'นี่คือข้อความทดสอบจาก Badminton Party 🏸 ถ้าเห็นข้อความนี้ แสดงว่าระบบแจ้งเตือนทำงานปกติ!',
            ['test' => true]
        );

        if ($result) {
            return back()->with('success', 'ส่งข้อความทดสอบเรียบร้อย! เช็ค LINE ได้เลย');
        }

        return back()->with('error', 'ส่งไม่สำเร็จ — ตรวจสอบว่าบัญชี LINE เชื่อมต่ออยู่');
    }

    /**
     * Admin: view notification logs.
     */
    public function adminLogs(): Response
    {
        $logs = NotificationLog::with('user')
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        return Inertia::render('AdminNotificationLogs', [
            'logs' => $logs,
        ]);
    }
}
