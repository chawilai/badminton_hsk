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
        Schema::create('game_shuttlecocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('games');
            $table->enum('type', ['initial', 'additional', 'returned']); // Type of shuttlecock request
            $table->integer('quantity'); // Positive for initial/additional, negative for returned
            $table->timestamp('request_time')->useCurrent(); // Time of request
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_shuttlecocks');
    }
};
