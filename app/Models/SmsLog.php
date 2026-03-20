<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsLog extends Model
{
    protected $fillable = [
        'user_id', 'phone', 'message', 'purpose', 'status', 'http_status', 'response_body',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
