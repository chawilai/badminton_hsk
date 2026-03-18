<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackReply extends Model
{
    protected $fillable = [
        'feedback_id',
        'user_id',
        'message',
        'is_admin',
    ];

    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
        ];
    }

    public function feedback()
    {
        return $this->belongsTo(Feedback::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
