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
        Schema::create('mmr_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('game_id')->constrained('games')->cascadeOnDelete();
            $table->integer('mmr_before');
            $table->integer('mmr_after');
            $table->integer('mmr_change');
            $table->enum('result', ['win', 'loss', 'draw']);
            $table->integer('team_avg_mmr');
            $table->integer('opponent_avg_mmr');
            $table->boolean('is_calibration')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mmr_history');
    }
};
