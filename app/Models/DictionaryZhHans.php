<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DictionaryZhHans extends Model
{
    use HasFactory;

    protected $table = 'dictionary_zh_hans';

    protected $fillable = [
        'character',
        'set',
        'meaning_thai',
        'definition',
        'pinyin',
        'pinyin_english',
        'radical',
        'decomposition',
        'acjk',
    ];

    protected $casts = [
        'set' => 'array',
        'pinyin' => 'array',
    ];

    // Define an accessor for the set attribute
    public function getSetAttribute($value)
    {
        return is_array(json_decode($value, true)) ? json_decode($value, true)[0] : '';
    }

    // Define an accessor for the pinyin attribute
    public function getPinyinAttribute($value)
    {
        return $this->filterPinyin($value);
    }

    // Custom method to filter and return the string in front of the biggest number
    protected function filterPinyin($value)
    {
        // Remove the surrounding brackets and quotes if present
        $value = trim($value, '["]');

        // Split the string into individual parts
        $parts = explode(' ', $value);

        $maxNumber = 0;
        $result = '';

        // if(count($parts) == 1) return $parts[0];

        foreach ($parts as $part) {
            if (preg_match('/(.+?)\((\d+)\)/', $part, $matches)) {
                $string = $matches[1];
                $number = (int) $matches[2];

                if ($number > $maxNumber) {
                    $maxNumber = $number;
                    $result = $string;
                }
            } else {
                $result = $part;
            }
        }

        return $result;
    }

    public function hanziListWords()
    {
        return $this->hasMany(HanziListWord::class);
    }

    // public function hanziLists()
    // {
    //     return $this->belongsToMany(HanziList::class, 'hanzi_list_words', 'hanzi_id', 'hanzi_list_id');
    // }
}
