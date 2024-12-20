<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dictionary extends Model
{
    use HasFactory;

    protected $table = 'dictionary';

    protected $fillable = [
        'character',
        'definition',
        'pinyin',
        'decomposition',
        'etymology',
        'radical',
        'matches',
    ];

    protected $casts = [
        'pinyin' => 'array',
        'etymology' => 'array',
        'matches' => 'array',
    ];
}
