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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('mmr')->default(1000)->after('badminton_rank_id');
            $table->integer('mmr_games_played')->default(0)->after('mmr');
            $table->boolean('mmr_calibrated')->default(false)->after('mmr_games_played');
            $table->boolean('mmr_quiz_completed')->default(false)->after('mmr_calibrated');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['mmr', 'mmr_games_played', 'mmr_calibrated', 'mmr_quiz_completed']);
        });
    }
};
