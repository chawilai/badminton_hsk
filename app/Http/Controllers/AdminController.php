<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\FeedbackReply;
use App\Models\Court;
use App\Models\Party;
use App\Models\User;
use App\Services\LinePushService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalParties' => Party::count(),
            'totalCourts' => Court::count(),
            'totalFeedbacks' => Feedback::count(),
            'pendingFeedbacks' => Feedback::where('status', 'pending')->count(),
        ];

        $recentFeedbacks = Feedback::with('user')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Admin', [
            'stats' => $stats,
            'recentFeedbacks' => $recentFeedbacks,
        ]);
    }

    public function feedbacks(): Response
    {
        $feedbacks = Feedback::with(['user', 'replies.user'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('AdminFeedback', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function updateFeedbackStatus(Feedback $feedback, Request $request): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,resolved,closed',
        ]);

        $oldStatus = $feedback->status;
        $feedback->update(['status' => $request->status]);

        // Send LINE push to user
        if ($oldStatus !== $request->status && $feedback->user) {
            $statusLabels = [
                'pending' => '⏳ รอตรวจสอบ',
                'reviewed' => '🔍 กำลังพิจารณา',
                'resolved' => '✅ แก้ไขแล้ว',
                'closed' => '📁 ปิดแล้ว',
            ];
            $typeLabels = [
                'feedback' => 'ข้อเสนอแนะ',
                'feature_request' => 'ขอฟีเจอร์',
                'bug_report' => 'แจ้งปัญหา',
            ];
            $label = $statusLabels[$request->status] ?? $request->status;
            $typeLabel = $typeLabels[$feedback->type] ?? $feedback->type;
            $appUrl = config('app.url', '');

            $service = new LinePushService();
            $service->sendPush(
                $feedback->user,
                'feedback',
                "อัพเดทสถานะ",
                "ประเภท: {$typeLabel}\nหัวข้อ: {$feedback->subject}\nสถานะ: {$label}",
                [
                    'feedback_id' => $feedback->id,
                    'new_status' => $request->status,
                    'action_url' => $appUrl . '/feedback',
                    'action_label' => 'ดูข้อเสนอแนะของฉัน',
                ]
            );
        }

        return back()->with('success', 'อัพเดทสถานะเรียบร้อย');
    }

    public function replyFeedback(Feedback $feedback, Request $request): RedirectResponse
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        FeedbackReply::create([
            'feedback_id' => $feedback->id,
            'user_id' => auth()->id(),
            'message' => $request->message,
            'is_admin' => true,
        ]);

        // Auto-update status to reviewed if still pending
        if ($feedback->status === 'pending') {
            $feedback->update(['status' => 'reviewed']);
        }

        // Send LINE push to user
        if ($feedback->user) {
            $adminName = auth()->user()->name ?? 'Admin';
            $appUrl = config('app.url', '');

            $service = new LinePushService();
            $service->sendPush(
                $feedback->user,
                'feedback',
                "มีคำตอบจากทีมงาน",
                "หัวข้อ: {$feedback->subject}\nตอบโดย: {$adminName}\n\n{$request->message}",
                [
                    'feedback_id' => $feedback->id,
                    'reply' => true,
                    'action_url' => $appUrl . '/feedback',
                    'action_label' => 'ดูคำตอบ',
                ]
            );
        }

        return back()->with('success', 'ตอบกลับเรียบร้อย');
    }
}
