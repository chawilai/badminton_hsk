<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_words', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('chinese_word_id')->constrained('chinese_words')->onDelete('cascade'); // Reference to the id of chinese_words table
            $table->enum('status', ['unknown', 'familiar', 'proficient', 'mastered'])->default('unknown');
            $table->json('recent_attempts')->nullable(); // To store the last 5 attempts as an array of booleans
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_words');
    }
};
