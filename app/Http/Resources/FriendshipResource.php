<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FriendshipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'status' => $this->status,
            'sender' => $this->when(
                $this->relationLoaded('sender'),
                fn() => new UserCompactResource($this->sender)
            ),
            'receiver' => $this->when(
                $this->relationLoaded('receiver'),
                fn() => new UserCompactResource($this->receiver)
            ),
            'created_at' => $this->created_at,
        ];
    }
}
