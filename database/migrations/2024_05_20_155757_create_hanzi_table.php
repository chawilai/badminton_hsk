<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Hanzi Characters
        Schema::create('hanzi', function (Blueprint $table) {
            $table->id();
            $table->string('hanzi', 50)->unique();
            $table->string('radical', 50)->nullable();
            $table->string('pinyin', 50);
            $table->string('pinyin_eng', 50);
            $table->text('meaning_thai');
            $table->text('meaning_english');
        });

        // Radicals
        Schema::create('radicals', function (Blueprint $table) {
            $table->id();
            $table->string('radical', 50)->unique();
            $table->string('pinyin', 50);
            $table->string('pinyin_eng', 50);
            $table->text('meaning_thai')->nullable();
            $table->text('description_thai')->nullable();
            $table->text('meaning_english')->nullable();
            $table->text('description_english')->nullable();
        });

        // Parts of Speech
        Schema::create('parts_of_speech', function (Blueprint $table) {
            $table->id();
            $table->string('title_thai', 50)->unique();
            $table->string('abbreviation_thai', 10)->unique();
            $table->text('meaning_thai');
            $table->string('title_english', 50)->unique();
            $table->string('abbreviation_english', 10)->unique();
            $table->text('meaning_english');
        });

        // Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('title_thai', 50)->unique(); // Examples: "HSK 1", "Common Hanzi"
            $table->string('title_english', 50)->unique(); // Examples: "HSK 1", "Common Hanzi"
        });

        // Hanzi Lists
        Schema::create('hanzi_lists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('list_reference', 255)->nullable();
            $table->string('list_name', 255)->nullable();
            $table->unsignedTinyInteger('box_number')->default(1);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users'); // Assuming you have a 'users' table
        });

        // Junction Tables
        Schema::create('hanzi_list_words', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hanzi_list_id');
            $table->unsignedBigInteger('hanzi_id');

            $table->foreign('hanzi_list_id')->references('id')->on('hanzi_lists')->onDelete('cascade');
            $table->foreign('hanzi_id')->references('id')->on('hanzi')->onDelete('cascade');

            $table->unique(['hanzi_list_id', 'hanzi_id']);
        });

        Schema::create('hanzi_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hanzi_id');
            $table->unsignedBigInteger('category_id');

            $table->foreign('hanzi_id')->references('id')->on('hanzi')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });

        Schema::create('hanzi_radicals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hanzi_id');
            $table->unsignedBigInteger('radical_id');

            $table->foreign('hanzi_id')->references('id')->on('hanzi')->onDelete('cascade');
            $table->foreign('radical_id')->references('id')->on('radicals')->onDelete('cascade');
        });

        Schema::create('hanzi_parts_of_speech', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hanzi_id');
            $table->unsignedBigInteger('parts_of_speech_id');

            $table->foreign('hanzi_id')->references('id')->on('hanzi')->onDelete('cascade');
            $table->foreign('parts_of_speech_id')->references('id')->on('parts_of_speech')->onDelete('cascade');
        });

    }

    public function down()
    {
        Schema::dropIfExists('hanzi_parts_of_speech');
        Schema::dropIfExists('hanzi_radicals');
        Schema::dropIfExists('hanzi_categories');
        Schema::dropIfExists('hanzi_list_words');
        Schema::dropIfExists('hanzi_lists');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('parts_of_speech');
        Schema::dropIfExists('radicals');
        Schema::dropIfExists('hanzi');
    }
};
