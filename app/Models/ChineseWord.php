<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChineseWord extends Model
{
    protected $fillable = [
        'word',
        'pinyin',
        'tag',
        'part_of_speech',
        'meaning_eng',
        'meaning_thai',
        'example',
        'example_pinyin',
        'example_eng',
        'example_thai'
    ];

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
