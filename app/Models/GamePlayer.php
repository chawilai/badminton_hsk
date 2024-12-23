<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamePlayer extends Model
{
    use HasFactory;

    // Define the table if it's not the default 'game_players'
    protected $table = 'game_players';

    // Define fillable properties to allow mass assignment
    protected $fillable = [
        'game_id',
        'user_id',
        'team'
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
     * Relationship to the User model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope a query to filter game players by a specific game.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  mixed  $gameId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByGame($query, $gameId)
    {
        return $query->where('game_id', $gameId);
    }

    /**
     * Scope a query to filter game players by team.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $team
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByTeam($query, $team)
    {
        return $query->where('team', $team);
    }
}
