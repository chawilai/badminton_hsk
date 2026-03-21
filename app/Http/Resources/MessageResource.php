<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'chat_id' => $this->chat_id,
            'user_id' => $this->user_id,
            'content' => $this->content,
            'sender' => $this->when(
                $this->relationLoaded('user'),
                fn() => new UserCompactResource($this->user)
            ),
            'created_at' => $this->created_at,
        ];
    }
}
