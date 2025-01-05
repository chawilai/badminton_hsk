<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('player_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('games');
            $table->foreignId('set_id')->constrained('game_sets');
            $table->foreignId('player_id')->constrained('users');
            $table->integer('score');  // Individual player's score
            $table->boolean('is_winner')->default(false);  // Indicates if the player was a winner in this set/game
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('player_scores');
    }
};
