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
        Schema::create('courts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('geolocation')->nullable();
            $table->string('location')->nullable();
            $table->string('phone')->nullable();
            $table->string('contact_url')->nullable();
            $table->integer('field_total')->nullable();
            $table->string('court_type')->nullable();
            $table->decimal('play_price', 8, 2)->nullable();
            $table->text('additional_facilities')->nullable(); // Such as showers, equipment rental, etc.
            $table->boolean('available_for_booking')->default(true); // To check if the court is available for booking
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courts');
    }
};
