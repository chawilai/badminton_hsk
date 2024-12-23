<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameShuttlecock extends Model
{
    use HasFactory;

    protected $fillable = ['game_id', 'type', 'quantity'];

    /**
     * Get the game that the shuttlecock entry belongs to.
     */
    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
