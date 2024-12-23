<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameScore extends Model
{
    use HasFactory;

    // Define the table associated with the model if different from 'game_scores'
    protected $table = 'player_scores';

    // Define fillable properties to allow mass assignment
    protected $fillable = [
        'game_id',
        'set_id',
        'player_id',
        'score',
        'is_winner'
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
     * Relationship to the GameSet model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function gameSet()
    {
        return $this->belongsTo(GameSet::class, 'set_id');
    }

    /**
     * Relationship to the User model (assuming User represents players).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function player()
    {
        return $this->belongsTo(User::class, 'player_id');
    }
}
