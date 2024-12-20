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
        Schema::create('user_sentences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('sentence_id')->constrained('sentences')->onDelete('cascade'); // Assuming you have a sentences table
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
        Schema::dropIfExists('user_sentences');
    }
};
