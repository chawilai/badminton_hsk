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
            $table->string('address');
            $table->string('geolocation')->nullable();
            $table->string('phone')->nullable();
            $table->string('contact_url')->nullable(); // Can be used for Facebook page or website
            $table->integer('field_total');
            $table->string('court_type'); // Material of the court e.g., rubber, wood
            $table->decimal('play_price', 8, 2);
            $table->string('additional_facilities')->nullable(); // Such as showers, equipment rental, etc.
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
