<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

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
        'fcm_token',
        'gender',
        'date_of_birth',
        'phone',
        'phone_verified_at',
        'subdistrict',
        'district',
        'province',
        'badminton_rank_id',
        'mmr',
        'mmr_games_played',
        'mmr_calibrated',
        'mmr_quiz_completed',
        'email_verified_at',
        'pdpa_consented_at',
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
            'phone_verified_at' => 'datetime',
            'pdpa_consented_at' => 'datetime',
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

    public function partyMembers()
    {
        return $this->hasMany(PartyMember::class);
    }

    public function linkedAccounts()
    {
        return $this->hasMany(LinkedAccount::class);
    }

    public function hasLinkedProvider(string $provider): bool
    {
        return $this->linkedAccounts()->where('provider', $provider)->exists();
    }

    public function getLinkedAccount(string $provider): ?LinkedAccount
    {
        return $this->linkedAccounts()->where('provider', $provider)->first();
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
     * Get list of missing profile fields.
     */
    public function profileMissingFields(): array
    {
        $missing = [];

        if (empty($this->gender)) {
            $missing[] = 'gender';
        }
        if (empty($this->date_of_birth)) {
            $missing[] = 'date_of_birth';
        }
        if (empty($this->phone) || empty($this->phone_verified_at)) {
            $missing[] = 'phone';
        }
        if (empty($this->email) || str_ends_with($this->email, '@example.com') || empty($this->email_verified_at)) {
            $missing[] = 'email';
        }
        if (empty($this->province)) {
            $missing[] = 'address';
        }

        return $missing;
    }

    /**
     * Total number of profile fields tracked for completeness.
     */
    public const PROFILE_TOTAL_FIELDS = 5;

    /**
     * Check if user profile is complete.
     */
    public function isProfileComplete(): bool
    {
        return empty($this->profileMissingFields());
    }

    /**
     * Accessor for mmr_level attribute.
     */
    public function getMmrLevelAttribute(): ?MmrLevel
    {
        return $this->mmrLevel();
    }
}
