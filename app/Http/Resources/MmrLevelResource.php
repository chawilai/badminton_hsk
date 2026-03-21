<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MmrLevelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'level' => $this->level,
            'name_th' => $this->name_th,
            'name_en' => $this->name_en,
            'tier_th' => $this->tier_th,
            'tier_en' => $this->tier_en,
            'tier_color' => $this->tier_color,
            'min_mmr' => $this->min_mmr,
            'max_mmr' => $this->max_mmr,
        ];
    }
}
