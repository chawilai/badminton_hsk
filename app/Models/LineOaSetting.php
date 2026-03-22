<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LineOaSetting extends Model
{
    protected $fillable = [
        'channel_access_token',
        'channel_secret',
        'liff_id',
        'line_oa_id',
        'rich_menu_config',
        'welcome_message_config',
    ];

    protected function casts(): array
    {
        return [
            'rich_menu_config' => 'array',
            'welcome_message_config' => 'array',
        ];
    }

    /**
     * Get the singleton settings row, creating with defaults if needed.
     */
    public static function current(): self
    {
        return static::firstOrCreate([], [
            'channel_access_token' => config('services.line.channel_access_token'),
            'liff_id' => config('services.line.liff_id'),
            'line_oa_id' => '@badmintonparty',
        ]);
    }

    /**
     * Get effective value: DB value if set, otherwise config fallback.
     */
    public function getEffectiveToken(): string
    {
        return $this->channel_access_token ?: config('services.line.channel_access_token', '');
    }

    public function getEffectiveLiffId(): string
    {
        return $this->liff_id ?: config('services.line.liff_id', '');
    }

    public function getLiffUrl(string $path = ''): string
    {
        $base = 'https://liff.line.me/' . $this->getEffectiveLiffId();
        return $path ? $base . '/' . ltrim($path, '/') : $base;
    }

    /**
     * Build welcome Flex Message using saved config (or defaults).
     */
    public function buildWelcomeFlexMessage(): array
    {
        $config = $this->welcome_message_config ?? [];
        $appUrl = config('app.url', 'https://badmintonparty.com');
        if (!str_starts_with($appUrl, 'https://')) {
            $appUrl = 'https://badmintonparty.com';
        }

        $title = $config['title'] ?? 'ยินดีต้อนรับสู่ Badminton Party!';
        $subtitle = $config['subtitle'] ?? 'ระบบจัดการปาร์ตี้แบดมินตันครบวงจร';
        $buttonLabel = $config['button_label'] ?? 'เริ่มใช้งาน Badminton Party';
        $buttonPath = $config['button_path'] ?? '/party-lists';
        $headerColor = $config['header_color'] ?? '#f0fdf4';
        $buttonColor = $config['button_color'] ?? '#22c55e';

        $features = $config['features'] ?? [
            ['icon' => '🏸', 'text' => 'สร้างปาร์ตี้แบดมินตัน'],
            ['icon' => '👥', 'text' => 'เข้าร่วมปาร์ตี้กับเพื่อนๆ'],
            ['icon' => '🎮', 'text' => 'สร้างเกม จับคู่อัตโนมัติ Track จำนวนเกม'],
            ['icon' => '📊', 'text' => 'บันทึก & ตรวจสอบประวัติการเล่น'],
        ];

        $logoUrl = $appUrl . '/icons/logo2.png';
        $liffUrl = $this->getLiffUrl(ltrim($buttonPath, '/'));

        $featureItems = array_map(fn($f) => [
            'type' => 'box', 'layout' => 'horizontal',
            'contents' => [
                ['type' => 'text', 'text' => $f['icon'], 'size' => 'sm', 'flex' => 0],
                ['type' => 'text', 'text' => $f['text'], 'size' => 'sm', 'color' => '#333333', 'wrap' => true, 'flex' => 1, 'margin' => 'md'],
            ],
        ], $features);

        return [
            'type' => 'flex',
            'altText' => $title,
            'contents' => [
                'type' => 'bubble', 'size' => 'mega',
                'header' => [
                    'type' => 'box', 'layout' => 'vertical',
                    'contents' => [['type' => 'image', 'url' => $logoUrl, 'size' => 'xl', 'aspectMode' => 'fit', 'aspectRatio' => '3:1']],
                    'paddingAll' => '20px', 'backgroundColor' => $headerColor,
                ],
                'body' => [
                    'type' => 'box', 'layout' => 'vertical',
                    'contents' => [
                        ['type' => 'text', 'text' => $title, 'weight' => 'bold', 'size' => 'lg', 'color' => '#166534', 'align' => 'center'],
                        ['type' => 'text', 'text' => $subtitle, 'size' => 'sm', 'color' => '#666666', 'align' => 'center', 'margin' => 'sm'],
                        ['type' => 'separator', 'margin' => 'lg'],
                        ['type' => 'box', 'layout' => 'vertical', 'contents' => $featureItems, 'margin' => 'lg', 'spacing' => 'md'],
                        ['type' => 'separator', 'margin' => 'lg'],
                        ['type' => 'box', 'layout' => 'vertical', 'contents' => [
                            ['type' => 'box', 'layout' => 'horizontal', 'contents' => [
                                ['type' => 'text', 'text' => 'LINE OA', 'size' => 'xs', 'color' => '#999999', 'flex' => 0],
                                ['type' => 'text', 'text' => $this->line_oa_id ?: '@badmintonparty', 'size' => 'xs', 'color' => '#06C755', 'align' => 'end', 'weight' => 'bold'],
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
                        ['type' => 'button', 'action' => ['type' => 'uri', 'label' => $buttonLabel, 'uri' => $liffUrl ?: $appUrl . '/party-lists'], 'style' => 'primary', 'color' => $buttonColor, 'height' => 'sm'],
                        ['type' => 'button', 'action' => ['type' => 'uri', 'label' => 'เข้าสู่เว็บไซต์', 'uri' => $appUrl], 'style' => 'link', 'color' => '#166534', 'height' => 'sm', 'margin' => 'sm'],
                    ],
                    'paddingAll' => '15px',
                ],
            ],
        ];
    }
}
