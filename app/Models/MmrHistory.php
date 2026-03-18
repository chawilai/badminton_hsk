<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MmrHistory extends Model
{
    protected $table = 'mmr_history';

    protected $fillable = [
        'user_id',
        'game_id',
        'mmr_before',
        'mmr_after',
        'mmr_change',
        'result',
        'team_avg_mmr',
        'opponent_avg_mmr',
        'is_calibration',
    ];

    protected function casts(): array
    {
        return [
            'is_calibration' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
