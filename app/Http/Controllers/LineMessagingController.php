<?php

namespace App\Http\Controllers;

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
        $appUrl = config('app.url', 'https://badmintonparty.com');
        $logoUrl = $appUrl . '/icons/logo2.png';
        $liffUrl = 'https://liff.line.me/' . config('services.line.liff_id', '') . '/party-lists';

        $flexMessage = [
            'type' => 'flex',
            'altText' => 'Badminton Party - สร้างปาร์ตี้แบดมินตันง่ายๆ',
            'contents' => [
                'type' => 'bubble',
                'size' => 'mega',
                'header' => [
                    'type' => 'box',
                    'layout' => 'vertical',
                    'contents' => [
                        [
                            'type' => 'image',
                            'url' => $logoUrl,
                            'size' => 'xl',
                            'aspectMode' => 'fit',
                            'aspectRatio' => '3:1',
                        ],
                    ],
                    'paddingAll' => '20px',
                    'backgroundColor' => '#f0fdf4',
                ],
                'body' => [
                    'type' => 'box',
                    'layout' => 'vertical',
                    'contents' => [
                        [
                            'type' => 'text',
                            'text' => 'ยินดีต้อนรับสู่ Badminton Party!',
                            'weight' => 'bold',
                            'size' => 'lg',
                            'color' => '#166534',
                            'align' => 'center',
                        ],
                        [
                            'type' => 'text',
                            'text' => 'ระบบจัดการปาร์ตี้แบดมินตันครบวงจร',
                            'size' => 'sm',
                            'color' => '#666666',
                            'align' => 'center',
                            'margin' => 'sm',
                        ],
                        [
                            'type' => 'separator',
                            'margin' => 'lg',
                        ],
                        [
                            'type' => 'box',
                            'layout' => 'vertical',
                            'contents' => [
                                $this->featureItem('🏸', 'สร้างปาร์ตี้แบดมินตัน'),
                                $this->featureItem('👥', 'เข้าร่วมปาร์ตี้กับเพื่อนๆ'),
                                $this->featureItem('🎮', 'สร้างเกม จับคู่อัตโนมัติ Track จำนวนเกม'),
                                $this->featureItem('📊', 'บันทึก & ตรวจสอบประวัติการเล่น'),
                            ],
                            'margin' => 'lg',
                            'spacing' => 'md',
                        ],
                        [
                            'type' => 'separator',
                            'margin' => 'lg',
                        ],
                        [
                            'type' => 'box',
                            'layout' => 'vertical',
                            'contents' => [
                                [
                                    'type' => 'box',
                                    'layout' => 'horizontal',
                                    'contents' => [
                                        ['type' => 'text', 'text' => 'LINE OA', 'size' => 'xs', 'color' => '#999999', 'flex' => 0],
                                        ['type' => 'text', 'text' => '@badmintonparty', 'size' => 'xs', 'color' => '#06C755', 'align' => 'end', 'weight' => 'bold'],
                                    ],
                                ],
                                [
                                    'type' => 'box',
                                    'layout' => 'horizontal',
                                    'contents' => [
                                        ['type' => 'text', 'text' => 'Website', 'size' => 'xs', 'color' => '#999999', 'flex' => 0],
                                        ['type' => 'text', 'text' => 'www.badmintonparty.com', 'size' => 'xs', 'color' => '#166534', 'align' => 'end', 'weight' => 'bold'],
                                    ],
                                    'margin' => 'sm',
                                ],
                            ],
                            'margin' => 'lg',
                        ],
                    ],
                    'paddingAll' => '20px',
                ],
                'footer' => [
                    'type' => 'box',
                    'layout' => 'vertical',
                    'contents' => [
                        [
                            'type' => 'button',
                            'action' => [
                                'type' => 'uri',
                                'label' => 'เริ่มใช้งาน Badminton Party',
                                'uri' => $liffUrl ?: $appUrl . '/party-lists',
                            ],
                            'style' => 'primary',
                            'color' => '#22c55e',
                            'height' => 'sm',
                        ],
                        [
                            'type' => 'button',
                            'action' => [
                                'type' => 'uri',
                                'label' => 'เข้าสู่เว็บไซต์',
                                'uri' => $appUrl,
                            ],
                            'style' => 'link',
                            'color' => '#166534',
                            'height' => 'sm',
                            'margin' => 'sm',
                        ],
                    ],
                    'paddingAll' => '15px',
                ],
            ],
        ];

        try {
            Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.line.channel_access_token'),
                'Content-Type' => 'application/json',
            ])->post('https://api.line.me/v2/bot/message/reply', [
                'replyToken' => $replyToken,
                'messages' => [$flexMessage],
            ]);
        } catch (\Exception $e) {
            Log::error('LINE welcome message failed', ['error' => $e->getMessage()]);
        }
    }

    private function featureItem(string $icon, string $text): array
    {
        return [
            'type' => 'box',
            'layout' => 'horizontal',
            'contents' => [
                ['type' => 'text', 'text' => $icon, 'size' => 'sm', 'flex' => 0],
                ['type' => 'text', 'text' => $text, 'size' => 'sm', 'color' => '#333333', 'wrap' => true, 'flex' => 1, 'margin' => 'md'],
            ],
        ];
    }
}
