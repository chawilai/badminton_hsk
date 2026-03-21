<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartyMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'party_id' => $this->party_id,
            'user' => $this->when(
                $this->relationLoaded('user'),
                fn() => new UserCompactResource($this->user)
            ),
            'display_name' => $this->display_name,
            'role' => $this->role,
            'status' => $this->status,
            'game_status' => $this->game_status,
            'created_at' => $this->created_at,
        ];
    }
}
