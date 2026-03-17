<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'status',
    ];

    /**
     * The user who sent the friend request.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * The user who received the friend request.
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * Scope: accepted friendships for a given user (either as sender or receiver).
     */
    public function scopeAcceptedFor($query, $userId)
    {
        return $query->where('status', 'accepted')
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)
                  ->orWhere('receiver_id', $userId);
            });
    }

    /**
     * Scope: pending friendships received by a given user.
     */
    public function scopePendingFor($query, $userId)
    {
        return $query->where('status', 'pending')
            ->where('receiver_id', $userId);
    }

    /**
     * Scope: pending friendships sent by a given user.
     */
    public function scopeSentBy($query, $userId)
    {
        return $query->where('status', 'pending')
            ->where('sender_id', $userId);
    }
}
