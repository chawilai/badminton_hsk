<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hanzi extends Model
{
    use HasFactory;

    protected $table = 'hanzi';

    protected $fillable = [
        "hanzi",
        "radical",
        "pinyin",
        "pinyin_eng",
        "meaning_thai",
        "meaning_english",
    ];
}
