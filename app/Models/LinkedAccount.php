<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LinkedAccount extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'provider_id',
        'provider_name',
        'provider_avatar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
