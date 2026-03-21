<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserCompactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'avatar' => $this->avatar,
            'profile_picture' => $this->profile_picture,
            'badminton_rank_id' => $this->badminton_rank_id,
            'mmr' => $this->mmr,
        ];
    }
}
