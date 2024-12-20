<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DictionaryZhHant extends Model
{
    use HasFactory;

    protected $table = 'dictionary_zh_hant';

    protected $fillable = [
        'character',
        'set',
        'definition',
        'pinyin',
        'radical',
        'decomposition',
        'acjk',
    ];

    protected $casts = [
        'set' => 'array',
        'pinyin' => 'array',
    ];
}
