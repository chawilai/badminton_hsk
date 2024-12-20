<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DictionaryKo extends Model
{
    use HasFactory;

    protected $table = 'dictionary_ko';

    protected $fillable = [
        'character',
        'set',
        'definition',
        'radical',
        'decomposition',
        'acjk',
    ];

    protected $casts = [
        'set' => 'array',
    ];
}
