<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GraphicsZhHant extends Model
{
    use HasFactory;

    protected $table = 'graphics_zh_hant';

    protected $fillable = [
        'character',
        'strokes',
        'medians',
    ];

    protected $casts = [
        'strokes' => 'array',
        'medians' => 'array',
    ];
}
