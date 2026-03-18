<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MmrAssessment extends Model
{
    protected $fillable = [
        'user_id',
        'answers',
        'raw_score',
        'starting_mmr',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
