<?php

namespace Database\Seeders;

use App\Models\ChineseWord;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChineseWordsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path = database_path('sql/chinese_words.sql');
        DB::unprepared(file_get_contents($path));

        $tag_hsk1 = Tag::firstOrCreate(['name' => 'HSK 1']);
        $tag_hsk2 = Tag::firstOrCreate(['name' => 'HSK 2']);
        $tag_hsk3 = Tag::firstOrCreate(['name' => 'HSK 3']);
        $tag_hsk4 = Tag::firstOrCreate(['name' => 'HSK 4']);

        $words = ChineseWord::all();

        foreach ($words as $word) {
            if ($word->tag === 'HSK 1') $word->tags()->attach($tag_hsk1->id);
            if ($word->tag === 'HSK 2') $word->tags()->attach($tag_hsk2->id);
            if ($word->tag === 'HSK 3') $word->tags()->attach($tag_hsk3->id);
            if ($word->tag === 'HSK 4') $word->tags()->attach($tag_hsk4->id);
        }
    }
}

