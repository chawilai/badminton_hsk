<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedbacks';

    protected $fillable = [
        'user_id',
        'type',
        'subject',
        'description',
        'screenshot_path',
        'status',
        'admin_notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
