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
    ];

    protected function casts(): array
    {
        return [
            'rich_menu_config' => 'array',
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
}
