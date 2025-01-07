<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameSet extends Model
{
    use HasFactory;

    // Define the table associated with the model if different from 'game_sets'
    protected $table = 'game_sets';

    // Define fillable properties to allow mass assignment
    protected $fillable = [
        'game_id',
        'set_number',
        'team1_start_side', // Assuming you've added fields for start sides as per previous discussion
        'team2_start_side',
        'team1_score',
        'team2_score',
        'winning_team',
    ];

    /**
     * Relationship to the Game model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function game()
    {
        return $this->belongsTo(Game::class, 'game_id');
    }

    /**
     * Relationship to the GameScore model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function gameScores()
    {
        return $this->hasMany(GameScore::class, 'set_id');
    }

    /**
     * Scope a query to filter sets by a specific game.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  mixed  $gameId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByGame($query, $gameId)
    {
        return $query->where('game_id', $gameId);
    }
}
