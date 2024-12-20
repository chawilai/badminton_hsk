<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DictionaryJa extends Model
{
    use HasFactory;

    protected $table = 'dictionary_ja';

    protected $fillable = [
        'character',
        'set',
        'definition',
        'kun',
        'on',
        'radical',
        'decomposition',
        'acjk',
    ];

    protected $casts = [
        'set' => 'array',
        'kun' => 'array',
        'on' => 'array',
    ];
}
