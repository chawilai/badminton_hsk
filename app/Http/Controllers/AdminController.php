<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Court;
use App\Models\Party;
use App\Models\User;
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
        $feedbacks = Feedback::with('user')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('AdminFeedback', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function updateFeedbackStatus(Feedback $feedback, \Illuminate\Http\Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,resolved,closed',
        ]);

        $feedback->update(['status' => $request->status]);

        return back()->with('success', 'อัพเดทสถานะเรียบร้อย');
    }
}
