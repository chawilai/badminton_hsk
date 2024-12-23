<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'provider',
        'provider_id',
        'avatar',
        'profile_picture',
        'provider_name',
        'gender',
        'date_of_birth',
        'badminton_rank_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $dates = ['date_of_birth'];

    // Accessor for age
    public function getAgeAttribute()
    {
        return $this->date_of_birth ? Carbon::parse($this->date_of_birth)->age : null;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function badmintonRank()
    {
        return $this->belongsTo(BadmintonRank::class, 'badminton_rank_id');
    }

    // Users have many GamePlayers
    public function gamePlayers()
    {
        return $this->hasMany(GamePlayer::class);
    }

    // Optional: Users might have many PartyMembers if that relationship is useful for other features
    public function partyMembers()
    {
        return $this->hasMany(PartyMember::class);
    }
}
