<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserHanzi extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hanzi_id',
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

    public function hanzi()
    {
        return $this->belongsTo(DictionaryZhHans::class, 'hanzi_id');
    }
}
