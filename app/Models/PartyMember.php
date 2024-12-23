<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'party_id',
        'user_id',
        'role',
        'status',
        'game_status',
        'invite_date',
        'request_date',
        'accept_date',
        'confirm_date'
    ];

    /**
     * Get the party that the member belongs to.
     */
    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Optional: Each PartyMember might be associated with many GamePlayers if needed
    public function gamePlayers()
    {
        return $this->hasMany(GamePlayer::class);
    }
}
