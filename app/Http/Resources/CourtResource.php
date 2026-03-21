<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourtResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'field_total' => $this->field_total,
            'court_type' => $this->court_type,
            'play_price' => $this->play_price,
            'is_buffet' => $this->is_buffet,
            'buffet_price_per_person' => $this->buffet_price_per_person,
            'buffet_play_hours' => $this->buffet_play_hours,
            'shuttle_brand' => $this->shuttle_brand,
            'shuttle_price' => $this->shuttle_price,
            'has_parking' => $this->has_parking,
            'has_shower' => $this->has_shower,
            'has_shop' => $this->has_shop,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'created_at' => $this->created_at,
        ];
    }
}
