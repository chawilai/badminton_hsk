<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChineseWordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chinese_words', function (Blueprint $table) {
            $table->id();
            $table->string('word');
            $table->string('pinyin');
            $table->string('tag');
            $table->string('part_of_speech');
            $table->string('meaning_eng');
            $table->string('meaning_thai');
            $table->text('example');
            $table->text('example_pinyin');
            $table->text('example_eng');
            $table->text('example_thai');
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
        Schema::dropIfExists('chinese_words');
    }
}
