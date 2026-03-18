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
        Schema::create('mmr_levels', function (Blueprint $table) {
            $table->id();
            $table->integer('level')->unique();
            $table->integer('min_mmr');
            $table->integer('max_mmr');
            $table->string('name_th');
            $table->string('name_en');
            $table->string('tier_th');
            $table->string('tier_en');
            $table->string('tier_color', 7);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mmr_levels');
    }
};
