<?php

namespace App\Http\Controllers;

use App\Models\Court;
use App\Models\Party;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourtController extends Controller
{
    /**
     * Display the court management page.
     */
    public function index()
    {
        $courts = Court::orderBy('name')->get();

        return Inertia::render('Courts', [
            'courts' => $courts,
        ]);
    }

    /**
     * Display the court map page.
     */
    public function map()
    {
        $courts = Court::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->orderBy('name')
            ->get([
                'id', 'name', 'address', 'phone',
                'latitude', 'longitude',
                'field_total', 'court_type', 'play_price',
                'operation_days', 'operation_hours',
                'google_map_url', 'line_oa',
                'has_buffet_session', 'buffet_days', 'buffet_start_time',
                'buffet_entry_fee', 'buffet_shuttle_fee',
                'available_for_booking',
            ]);

        return Inertia::render('CourtMap', [
            'courts' => $courts,
        ]);
    }

    /**
     * Store a newly created court.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'field_total' => 'integer|min:1',
            'court_type' => 'nullable|string|in:rubber,wood,synthetic',
            'play_price' => 'nullable|numeric|min:0',
            'geolocation' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'available_for_booking' => 'boolean',
        ]);

        $validated['field_total'] = $validated['field_total'] ?? 1;
        $validated['available_for_booking'] = $validated['available_for_booking'] ?? true;

        Court::create($validated);

        return back()->with('success', 'Court created successfully.');
    }

    /**
     * Update the specified court.
     */
    public function update(Request $request, Court $court)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'field_total' => 'integer|min:1',
            'court_type' => 'nullable|string|in:rubber,wood,synthetic',
            'play_price' => 'nullable|numeric|min:0',
            'geolocation' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'available_for_booking' => 'boolean',
        ]);

        $court->update($validated);

        return back()->with('success', 'Court updated successfully.');
    }

    /**
     * Remove the specified court.
     */
    public function destroy(Court $court)
    {
        // Check if any parties reference this court
        $partyCount = Party::where('court_id', $court->id)->count();

        if ($partyCount > 0) {
            return back()->withErrors(['court' => 'Cannot delete court, it is used by parties.']);
        }

        $court->delete();

        return back()->with('success', 'Court deleted successfully.');
    }
}
