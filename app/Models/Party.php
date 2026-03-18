<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Party extends Model
{
    use HasFactory;

    // Define the table associated with the model if it's not the default 'parties'
    protected $table = 'parties';

    // Define fillable properties to allow mass assignment
    protected $fillable = [
        'creator_id', // ID of the user who created or is hosting the party
        'name',       // Party name
        'default_game_type', // double (1v1) or quadruple (2v2)
        'play_date',  // Date of the party
        'court_id',   // Associated court for the party
        'play_hours', // Duration of play time
        'max_players', // Maximum number of players
        'start_time', // Start time of the party
        'end_time',   // End time of the party
        'status',     // Status of the party (e.g., 'open', 'full', 'completed')
        'is_private',   // Whether the party is open to the public or private
        'cost_type',    // per_person, split_equal, free
        'cost_amount',  // Cost amount
        'shuttlecock_cost', // Shuttlecock cost
        'notes',        // Party notes/rules
        'is_inc_playing',   // Show playing player to make the game
        'is_break_aftergame',   // Set game_status to break after the game end
        'default_initial_shuttlecocks',   // Default shuttlecock
        'age_range',  // Optional: Age range of participants
        'gender',     // Optional: Gender requirement if any
        'badminton_level', // Optional: Skill level required
        'party_start_date', // When the Owner make party start
        'party_end_date', // When the Owner make party end
        'court_booking_details', // Details about court bookings
        'min_mmr_level', // Minimum MMR level filter
        'max_mmr_level', // Maximum MMR level filter
    ];

    protected $casts = [
        'age_range' => 'array', // Casts to array
        'badminton_level' => 'array', // Casts to array
        'is_private' => 'boolean', // Ensure this is treated as a boolean
        'party_start_date' => 'datetime', // Optional: cast to datetime
        'party_end_date' => 'datetime' // Optional: cast to datetime
    ];

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s'); // Custom format
    }

    protected static function booted()
    {
        static::created(function ($party) {
            // Assuming you have a party_members table and a corresponding model
            $party->members()->create([
                'user_id' => $party->creator_id,
                'role' => 'Host',
                'status' => 'Confirmed',
                'confirm_date' => now()
            ]);
        });
    }

    /**
     * Relationship to the User model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Relationship to the Game model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function games()
    {
        return $this->hasMany(Game::class, 'party_id');
    }

    /**
     * Relationship to the Court model (if courts are a separate entity).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function court()
    {
        return $this->belongsTo(Court::class, 'court_id');
    }

    /**
     * Get the members for the party.
     */
    public function members()
    {
        return $this->hasMany(PartyMember::class);
    }

    /**
     * Scope a query to only include active or upcoming parties.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'open');
    }

    public function courtBookings()
    {
        return $this->hasMany(PartyCourtBooking::class);
    }
}
