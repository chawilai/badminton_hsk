<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creator_id')->constrained('users')->onDelete('restrict');
            $table->date('play_date');
            $table->foreignId('court_id')->constrained('courts')->onDelete('restrict');
            $table->integer('play_hours');
            $table->integer('max_players');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', ['Open', 'Full', 'Over'])->default('Open')->index();
            $table->boolean('is_private')->default(false); // false for public, true for private
            $table->boolean('is_inc_playing')->default(false);
            $table->boolean('is_break_aftergame')->default(false);
            $table->integer('default_initial_shuttlecocks')->default(0);
            $table->string('age_range')->nullable();
            $table->string('gender')->nullable();
            $table->string('badminton_level')->nullable();
            $table->timestamp('party_start_date')->nullable();
            $table->timestamp('party_end_date')->nullable();
            $table->text('court_booking_details')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Enables soft deleting
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parties');
    }
};
