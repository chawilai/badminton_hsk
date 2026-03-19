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
        'mmr',
        'mmr_games_played',
        'mmr_calibrated',
        'mmr_quiz_completed',
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
            'mmr_calibrated' => 'boolean',
            'mmr_quiz_completed' => 'boolean',
        ];
    }

    public function badmintonRank()
    {
        return $this->belongsTo(BadmintonRank::class, 'badminton_rank_id');
    }

    public function latestSkillAssessment()
    {
        return $this->hasOne(SkillAssessment::class)->latestOfMany();
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

    /**
     * Friend requests sent by this user.
     */
    public function sentFriendships()
    {
        return $this->hasMany(Friendship::class, 'sender_id');
    }

    /**
     * Friend requests received by this user.
     */
    public function receivedFriendships()
    {
        return $this->hasMany(Friendship::class, 'receiver_id');
    }

    /**
     * Check if this user has an accepted friendship with the given user ID.
     */
    public function isFriendWith($userId): bool
    {
        return Friendship::where('status', 'accepted')
            ->where(function ($q) use ($userId) {
                $q->where(function ($q2) use ($userId) {
                    $q2->where('sender_id', $this->id)
                       ->where('receiver_id', $userId);
                })->orWhere(function ($q2) use ($userId) {
                    $q2->where('sender_id', $userId)
                       ->where('receiver_id', $this->id);
                });
            })
            ->exists();
    }

    /**
     * Get a collection of user IDs who are friends with this user.
     */
    public function friendIds()
    {
        $sent = Friendship::where('status', 'accepted')
            ->where('sender_id', $this->id)
            ->pluck('receiver_id');

        $received = Friendship::where('status', 'accepted')
            ->where('receiver_id', $this->id)
            ->pluck('sender_id');

        return $sent->merge($received)->unique()->values();
    }

    /**
     * Get the MmrLevel for the user's current MMR.
     */
    public function mmrLevel(): ?MmrLevel
    {
        return MmrLevel::where('min_mmr', '<=', $this->mmr)
            ->where('max_mmr', '>=', $this->mmr)
            ->first();
    }

    /**
     * MMR history relationship.
     */
    public function mmrHistory()
    {
        return $this->hasMany(MmrHistory::class);
    }

    public function notificationSetting()
    {
        return $this->hasOne(NotificationSetting::class);
    }

    public function notificationLogs()
    {
        return $this->hasMany(NotificationLog::class);
    }

    /**
     * Accessor for mmr_level attribute.
     */
    public function getMmrLevelAttribute(): ?MmrLevel
    {
        return $this->mmrLevel();
    }
}
