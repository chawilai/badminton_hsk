<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'last_message' => $this->last_message,
            'last_message_at' => $this->last_message_at,
            'participants' => $this->when(
                $this->relationLoaded('participants'),
                fn() => $this->participants->map(fn($p) => [
                    'user_id' => $p->user_id,
                    'user' => new UserCompactResource($p->user),
                    'read_at' => $p->read_at,
                ])
            ),
            'unread_count' => $this->when(isset($this->unread_count), $this->unread_count),
            'created_at' => $this->created_at,
        ];
    }
}
