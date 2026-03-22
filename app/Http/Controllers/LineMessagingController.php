<?php

namespace App\Http\Controllers;

use App\Models\LineOaSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LineMessagingController extends Controller
{
    public function webhook(Request $request)
    {
        $events = $request->input('events', []);

        foreach ($events as $event) {
            if ($event['type'] === 'follow') {
                $this->sendWelcomeMessage($event['replyToken']);
            }
        }

        return response('OK', 200);
    }

    private function sendWelcomeMessage(string $replyToken): void
    {
        $settings = LineOaSetting::current();
        $flexMessage = $settings->buildWelcomeFlexMessage();

        try {
            Http::withHeaders([
                'Authorization' => 'Bearer ' . $settings->getEffectiveToken(),
                'Content-Type' => 'application/json',
            ])->post('https://api.line.me/v2/bot/message/reply', [
                'replyToken' => $replyToken,
                'messages' => [$flexMessage],
            ]);
        } catch (\Exception $e) {
            Log::error('LINE welcome message failed', ['error' => $e->getMessage()]);
        }
    }
}
