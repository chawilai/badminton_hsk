<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Party;
use App\Models\User;

class PartyMembersSeeder extends Seeder
{
    public function run()
    {
        // Iterate over each party
        Party::all()->each(function ($party) {
            // Calculate the number of members to add, excluding the host and reserving one spot for the admin
            $numberOfMembersToAdd = max(0, $party->max_players - 2); // Subtract 2 for the host and admin

            // Get eligible users to be members, excluding the party creator
            $users = User::where('id', '!=', $party->creator_id)
                         ->inRandomOrder()
                         ->take($numberOfMembersToAdd + 1) // +1 to include potential admin
                         ->get();

            if ($users->isNotEmpty()) {
                // Assign one user as Admin and remove from the collection
                $admin = $users->shift(); // Get one user from the list to be the admin

                // Create a member record with 'Admin' role
                $party->members()->create([
                    'user_id' => $admin->id,
                    'role' => 'Admin',
                    'status' => 'Confirmed', // Assuming admin is automatically confirmed
                    'confirm_date' => now()
                ]);

                // Add remaining users as regular members
                foreach ($users as $user) {
                    $party->members()->create([
                        'user_id' => $user->id,
                        'role' => 'Member',
                        'status' => $this->getRandomStatus(), // Random status for members
                        'confirm_date' => now() // Set confirm date if needed based on status
                    ]);
                }
            }
        });
    }

    private function getRandomStatus()
    {
        // Define potential statuses excluding 'Host'
        $statuses = [
            'Pending Confirmation', 'Cancelled', 'Waitlisted', 'Checked-in', 'No Show',
            'Inviting', 'Requesting', 'Rejected', 'Accepted', 'Confirmed'
        ];

        return collect($statuses)->random();
    }
}
