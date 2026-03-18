<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MmrLevel extends Model
{
    protected $fillable = [
        'level',
        'min_mmr',
        'max_mmr',
        'name_th',
        'name_en',
        'tier_th',
        'tier_en',
        'tier_color',
    ];

    /**
     * Get all users whose MMR falls within this level's range.
     */
    public function users()
    {
        return User::whereBetween('mmr', [$this->min_mmr, $this->max_mmr])->get();
    }
}
