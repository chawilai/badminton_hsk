<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillAssessmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'serve' => $this->serve,
            'smash' => $this->smash,
            'clear' => $this->clear,
            'net_play' => $this->net_play,
            'defense' => $this->defense,
            'backhand' => $this->backhand,
            'deception' => $this->deception,
            'footwork' => $this->footwork,
            'speed' => $this->speed,
            'stamina' => $this->stamina,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
