<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExperienceHistory extends Model
{

    use HasFactory;

    protected $fillable = ['user_id', 'change', 'reason'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

