<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    public function index(): Response
    {
        $myFeedbacks = Feedback::where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return Inertia::render('Feedback', [
            'myFeedbacks' => $myFeedbacks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:feedback,feature_request,bug_report',
            'subject' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'screenshot' => 'nullable|image|max:5120',
        ]);

        $screenshotPath = null;
        if ($request->hasFile('screenshot')) {
            $screenshotPath = $request->file('screenshot')->store('feedbacks', 'public');
        }

        Feedback::create([
            'user_id' => auth()->id(),
            'type' => $validated['type'],
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'screenshot_path' => $screenshotPath,
        ]);

        return redirect()->route('profile.index')->with('success', 'ส่งข้อเสนอแนะเรียบร้อยแล้ว ขอบคุณครับ!');
    }
}
