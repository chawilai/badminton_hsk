<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('party_id');
            $table->enum('game_type', ['double', 'quadruple']);
            $table->enum('status', ['setting', 'listing', 'playing', 'finished']);
            $table->timestamp('game_create_date')->useCurrent();
            $table->timestamp('game_list_date')->nullable();
            $table->timestamp('game_start_date')->nullable();
            $table->timestamp('game_end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('games');
    }
}
