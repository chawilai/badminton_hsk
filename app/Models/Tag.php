<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['name'];

    public function words()
    {
        return $this->morphedByMany(ChineseWord::class, 'taggable');
    }
}
