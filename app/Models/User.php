<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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

    public function addExperience(int $amount, string $reason = null)
    {
        $this->experience += $amount;
        $this->save();

        $this->experienceHistory()->create([
            'change' => $amount,
            'reason' => $reason,
        ]);
    }

    public function cutExperience(int $amount, string $reason = null)
    {
        $this->experience = max(0, $this->experience - $amount);
        $this->save();

        $this->experienceHistory()->create([
            'change' => -$amount,
            'reason' => $reason,
        ]);
    }

    public function experienceHistory()
    {
        return $this->hasMany(ExperienceHistory::class);
    }
}
