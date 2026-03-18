<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    protected $fillable = [
        'user_id',
        'enabled',
        'party_invite',
        'party_reminder',
        'game_start',
        'game_result',
        'friend_request',
        'party_member_joined',
    ];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'party_invite' => 'boolean',
            'party_reminder' => 'boolean',
            'game_start' => 'boolean',
            'game_result' => 'boolean',
            'friend_request' => 'boolean',
            'party_member_joined' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
