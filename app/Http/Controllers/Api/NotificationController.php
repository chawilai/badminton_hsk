<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationSettingResource;
use App\Models\NotificationSetting;
use App\Services\LinePushService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function settings(Request $request)
    {
        $setting = NotificationSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['enabled' => true]
        );

        return response()->json(['settings' => new NotificationSettingResource($setting)]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'enabled' => 'boolean',
            'party_invite' => 'boolean',
            'party_reminder' => 'boolean',
            'game_start' => 'boolean',
            'game_result' => 'boolean',
            'friend_request' => 'boolean',
            'party_member_joined' => 'boolean',
            'feedback' => 'boolean',
        ]);

        $setting = NotificationSetting::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return response()->json([
            'message' => 'อัพเดทการแจ้งเตือนเรียบร้อย',
            'settings' => new NotificationSettingResource($setting),
        ]);
    }

    public function sendTest(Request $request)
    {
        $service = new LinePushService();
        $result = $service->sendPush(
            $request->user(),
            'party_invite',
            '🔔 ทดสอบการแจ้งเตือน',
            'นี่คือข้อความทดสอบจาก Badminton Party',
            []
        );

        return response()->json([
            'success' => $result,
            'message' => $result ? 'ส่งการแจ้งเตือนทดสอบแล้ว' : 'ไม่สามารถส่งได้ (ตรวจสอบ LINE connection)',
        ]);
    }

    public function lineQuota()
    {
        return response()->json((new LinePushService())->getQuota());
    }
}
