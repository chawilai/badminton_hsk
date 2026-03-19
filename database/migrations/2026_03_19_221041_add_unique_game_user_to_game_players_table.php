<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove existing duplicate records before adding constraint
        if (DB::getDriverName() === 'mysql') {
            DB::statement('
                DELETE gp1 FROM game_players gp1
                INNER JOIN game_players gp2
                WHERE gp1.id > gp2.id
                  AND gp1.game_id = gp2.game_id
                  AND gp1.user_id = gp2.user_id
            ');
        } else {
            // SQLite compatible
            DB::statement('
                DELETE FROM game_players WHERE id NOT IN (
                    SELECT MIN(id) FROM game_players GROUP BY game_id, user_id
                )
            ');
        }

        Schema::table('game_players', function (Blueprint $table) {
            $table->unique(['game_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->dropUnique(['game_id', 'user_id']);
        });
    }
};
