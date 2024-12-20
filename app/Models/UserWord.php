<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserWord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'chinese_word_id',
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

    public function chineseWord()
    {
        return $this->belongsTo(ChineseWord::class, 'chinese_word_id');
    }
}
