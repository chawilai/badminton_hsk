<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('dictionary_ja', function (Blueprint $table) {
            $table->id();
            $table->string('character', 10);
            $table->json('set')->nullable();
            $table->string('definition')->nullable();
            $table->json('kun')->nullable();
            $table->json('on')->nullable();
            $table->string('radical', 10)->nullable();
            $table->string('decomposition')->nullable();
            $table->string('acjk')->nullable();
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
        Schema::dropIfExists('dictionary_ja');
    }
};