<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeedbackResource;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $feedbacks = Feedback::where('user_id', $request->user()->id)
            ->with('replies.admin')
            ->latest()
            ->get();

        return response()->json(['feedbacks' => FeedbackResource::collection($feedbacks)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:bug,suggestion,feature,other',
            'subject' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'screenshot' => 'nullable|image|max:5120',
        ]);

        $screenshotPath = null;
        if ($request->hasFile('screenshot')) {
            $screenshotPath = $request->file('screenshot')->store('feedbacks', 'public');
        }

        $feedback = Feedback::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'screenshot_path' => $screenshotPath,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'ส่งข้อเสนอแนะเรียบร้อย',
            'feedback' => new FeedbackResource($feedback),
        ], 201);
    }
}
