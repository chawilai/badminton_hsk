<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verification_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['phone', 'email']);
            $table->string('target'); // phone number or email
            $table->string('code', 6);
            $table->timestamp('expires_at');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_codes');
    }
};
