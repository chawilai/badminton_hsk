<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedback_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feedback_id')->constrained('feedbacks')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->boolean('is_admin')->default(false);
            $table->timestamps();

            $table->index(['feedback_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback_replies');
    }
};
