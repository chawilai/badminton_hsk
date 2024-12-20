<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSentence extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'sentence_id',
        'status',
        'recent_attempts',
    ];

    protected $casts = [
        'recent_attempts' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sentence()
    {
        return $this->belongsTo(Sentence::class, 'sentence_id');
    }
}
