<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    // Define the table associated with the model if it's not the default 'games'
    protected $table = 'games';

    // Define fillable properties to allow mass assignment
    protected $fillable = [
        'party_id',
        'game_type',  // e.g., 'double' or 'quadruple'
        'status',     // e.g., 'setting', 'listing', 'playing', 'finished'
        'court_number',
        'game_create_date',
        'game_list_date',
        'game_start_date',
        'game_end_date'
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

    /**
     * Relationship to the Party model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function party()
    {
        return $this->belongsTo(Party::class, 'party_id');
    }

    /**
     * Relationship to the GameSet model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gameSets()
    {
        return $this->hasMany(GameSet::class, 'game_id');
    }

    /**
     * Relationship to GamePlayers.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gamePlayers()
    {
        return $this->hasMany(GamePlayer::class, 'game_id');
    }

    /**
     * Get the shuttlecock requests associated with the game.
     */
    public function shuttlecocks()
    {
        return $this->hasMany(GameShuttlecock::class);
    }
}
