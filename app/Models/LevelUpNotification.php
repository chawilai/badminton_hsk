<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LevelUpNotification extends Model
{
    protected $fillable = [
        'user_id', 'old_level', 'new_level',
        'old_tier_th', 'new_tier_th', 'new_tier_color',
        'mmr_before', 'mmr_after', 'is_seen',
    ];

    protected $casts = [
        'is_seen' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
