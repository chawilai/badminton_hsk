<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('game_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('games');
            $table->integer('set_number');
            $table->string('team1_start_side')->default('north');  // Example: 'north' or 'south'
            $table->string('team2_start_side')->default('south');
            $table->integer('team1_score')->default(0)->comment('Score for Team 1');
            $table->integer('team2_score')->default(0)->comment('Score for Team 2');
            $table->enum('winning_team', ['team1', 'team2', null])->nullable()->comment('Winning team for this set');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_sets');
    }
};
