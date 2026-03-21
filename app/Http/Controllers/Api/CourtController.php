<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourtResource;
use App\Models\Court;
use Illuminate\Http\Request;

class CourtController extends Controller
{
    public function index()
    {
        return response()->json(['courts' => CourtResource::collection(Court::all())]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'field_total' => 'nullable|integer|min:1',
            'court_type' => 'nullable|string',
            'play_price' => 'nullable|numeric|min:0',
            'is_buffet' => 'nullable|boolean',
            'buffet_price_per_person' => 'nullable|numeric|min:0',
            'buffet_play_hours' => 'nullable|numeric|min:0',
            'shuttle_brand' => 'nullable|string',
            'shuttle_price' => 'nullable|numeric|min:0',
            'has_parking' => 'nullable|boolean',
            'has_shower' => 'nullable|boolean',
            'has_shop' => 'nullable|boolean',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $court = Court::create($validated);

        return response()->json(['message' => 'สร้างสนามเรียบร้อย', 'court' => new CourtResource($court)], 201);
    }

    public function update(Request $request, Court $court)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'field_total' => 'nullable|integer|min:1',
            'court_type' => 'nullable|string',
            'play_price' => 'nullable|numeric|min:0',
            'is_buffet' => 'nullable|boolean',
            'buffet_price_per_person' => 'nullable|numeric|min:0',
            'buffet_play_hours' => 'nullable|numeric|min:0',
            'shuttle_brand' => 'nullable|string',
            'shuttle_price' => 'nullable|numeric|min:0',
            'has_parking' => 'nullable|boolean',
            'has_shower' => 'nullable|boolean',
            'has_shop' => 'nullable|boolean',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $court->update($validated);

        return response()->json(['message' => 'อัพเดทสนามเรียบร้อย', 'court' => new CourtResource($court)]);
    }

    public function destroy(Court $court)
    {
        $court->delete();
        return response()->json(['message' => 'ลบสนามเรียบร้อย']);
    }
}
