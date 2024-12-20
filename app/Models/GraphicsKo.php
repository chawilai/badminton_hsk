<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GraphicsKo extends Model
{
    use HasFactory;

    protected $table = 'graphics_ko';

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
