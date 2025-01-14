<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameSet;
use App\Models\GamePlayer;
use App\Models\Party;
use App\Models\PartyMember;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class GameController extends Controller
{

    public function index(Request $request)
    {
        $games = Game::with([
            'gamePlayers.user',
            'shuttlecocks',
            'gameSets'
        ])
            ->withCount('gamePlayers')
            ->with(['gamePlayers' => function ($query) {
                $query->leftJoin('party_members', 'game_players.user_id', '=', 'party_members.user_id')
                    ->select('game_players.*', 'party_members.display_name');
            }])
            ->where('party_id', 2) // Filter games with party_id = 2
            ->orderBy('id', 'desc')
            ->get();

        $parties = Party::with([
            'members',
            'members.user',
        ])
            ->withCount('members')
            ->get();

        $readyPlayers = $this->fetchReadyPlayersByPartyID(2);

        return Inertia::render('Game', [
            'parties' => $parties,
            'games' => $games,
            'readyPlayers' => $readyPlayers
        ]);
    }

    /**
     * Store a new game.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $request->validate([
            'party_id' => 'required|exists:parties,id',
            'game_type' => 'required|in:double,quadruple',
            'status' => 'required|in:setting,listing,playing,finished',
            'initial_shuttlecock_game' => 'sometimes|numeric|min:0'
        ]);

        // Check if there's already a game in the 'setting' status for the same party
        $existingGameSetting = Game::where('party_id', $request->party_id)
            ->where('status', 'setting')
            ->exists();

        if ($existingGameSetting) {
            return back()->with('error', ['existSettingGame' => 'There is already a game in the setting status for this party.']);
        }

        $game = Game::create([
            'party_id' => $request->party_id,
            'game_type' => $request->game_type,
            'status' => $request->status,
            'game_create_date' => now(),
        ]);

        // Fetch default shuttlecocks from the party if not provided
        $party = Party::find($request->party_id);
        $initialShuttlecocks = $request->input('initial_shuttlecock_game', $party->default_initial_shuttlecocks);

        // Check for an existing initial shuttlecock record
        $initialShuttlecockEntry = $game->shuttlecocks()->where('type', 'initial')->first();

        if ($initialShuttlecocks > 0) {
            if ($initialShuttlecockEntry) {
                // Update the existing record if it exists
                $initialShuttlecockEntry->update([
                    'quantity' => $initialShuttlecocks
                ]);
            } else {
                // Create a new record if no existing record is found
                $game->shuttlecocks()->create([
                    'type' => 'initial',
                    'quantity' => $initialShuttlecocks
                ]);
            }
        } else {
            // If $initialShuttlecocks is 0 and an entry exists, consider deleting or updating it to 0
            if ($initialShuttlecockEntry) {
                $initialShuttlecockEntry->update(['quantity' => 0]);
            }
        }

        return back();
    }

    /**
     * Add a "ready" party member to a game.
     *
     * @param Request $request
     * @param Game $game
     * @return \Illuminate\Http\Response
     */
    public function addPlayer(Request $request, Game $game)
    {
        $request->validate([
            'party_member_id' => 'required|exists:party_members,id',
            'team' => 'required|in:team1,team2',
        ]);

        // Check if the game is in the 'setting' state
        if ($game->status !== 'setting') {
            return back()->with('error', ['onlyOnSetting' => 'Players can only be added when the game is setting.']);
        }

        // Define the maximum players allowed for each team based on the game type
        $maxPlayersPerTeam = $game->game_type === 'double' ? 1 : 2;

        // Check the current number of players in the specific team
        $currentTeamPlayerCount = $game->gamePlayers()->where('team', $request->team)->count();
        if ($currentTeamPlayerCount >= $maxPlayersPerTeam) {

            session()->flash('error', ['team_player_limit' => "The maximum number of players for {$request->team} in a {$game->game_type} game has already been reached."]);
            return redirect()->route('party');
        }

        // Fetch the party member
        $partyMember = PartyMember::where('id', $request->party_member_id)->firstOrFail();

        // Add the player to the game
        $game->gamePlayers()->create([
            'game_id' => $game->id,
            'user_id' => $partyMember->user_id,
            'team' => $request->team
        ]);

        return back()->with('success', 'Player added successfully to the game.');
    }

    /**
     * Fetch players in the party with status 'ready' based on game_id.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function fetchReadyPlayers(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:games,id'
        ]);

        // Assuming a Game has a Party through a relationship
        $game = Game::with('party')->find($request->game_id);

        if (!$game || !$game->party) {
            return response()->json(['error' => 'No party associated with this game'], 404);
        }

        $currentDateTime = now(); // Get the current date and time

        // Fetching party members who are ready, and eager load their User, BadmintonRank, and their games
        $query = PartyMember::with([
            'user.badmintonRank',
            'user',
            'user.gamePlayers.game',
            'user.gamePlayers.game.gameSets'
        ])
            ->where('party_id', $game->party_id)
            ->where('game_status', 'ready')
            ->whereDoesntHave('user.gamePlayers.game', function ($subQuery) {
                $subQuery->whereIn('status', ['setting', 'listing']);
            });

        if (!$game->party->is_inc_playing) {
            $query->whereDoesntHave('user.gamePlayers.game', function ($subQuery) {
                $subQuery->whereIn('status', ['playing']);
            });
        }

        $readyPlayers = $query->get();

        // dd($readyPlayers);


        $mappedPlayers = $readyPlayers->map(function ($player) use ($game, $currentDateTime) {
            // $finishedGamesCount = $player->user->gamePlayers->where('game.status', 'finished')->count(); // Counting finished games associated with the user

            $finishedGamesCount = GamePlayer::where('user_id', $player->user_id)
                ->whereHas('game', function ($query) use ($game) {
                    $query->where('status', 'finished')
                        ->where('party_id', $game->party_id);
                })
                ->count();

            $lastGameEndTime = GamePlayer::where('user_id', $player->user_id)
                ->join('games', 'game_players.game_id', '=', 'games.id')
                ->where('games.status', 'finished')
                ->latest('games.game_end_date')
                ->select('game_players.*', 'games.game_end_date as game_end_date') // Ensure to select game_end_date
                ->first();

            // Calculate waiting time in seconds
            $waitingTime = $lastGameEndTime ?
                abs(round($currentDateTime->diffInSeconds($lastGameEndTime->game->game_end_date, false))) :
                abs(round($currentDateTime->diffInSeconds($game->party->party_start_date, false)));

            $gameDetails = $player->user->gamePlayers->filter(function ($gamePlayer) {
                return $gamePlayer->game !== null; // Filter out null game instances
            })->map(function ($gamePlayer) {
                // Group players by team within the game
                $teamPlayers = $gamePlayer->game->gamePlayers
                    ->groupBy('team')
                    ->map(function ($teamGroup) {
                        // Map each team's players
                        return $teamGroup->map(function ($player) {
                            return [
                                'player_id' => $player->user_id,
                                'name' => $player->user->name
                            ];
                        });
                    });

                // Mapping game sets to include starting sides
                $gameSets = $gamePlayer->game->gameSets->map(function ($set) {
                    return ['team1' => ['side' => $set->team1_start_side], 'team2' => ['side' => $set->team2_start_side]];
                });

                return [
                    'game_id' => $gamePlayer->game->id,
                    'party_id' => $gamePlayer->game->party_id,
                    'status' => $gamePlayer->game->status,
                    'teams' => [
                        'team1' => $teamPlayers->get('team1') ?? [],
                        'team2' => $teamPlayers->get('team2') ?? []
                    ],
                    'game_sets' => $gameSets  // Added game sets with starting sides
                ];
            });

            return [
                'user_id' => $player->user->id,
                'party_member_id' => $player->id,
                'name' => $player->user->name,
                'display_name' => $player->display_name ?? $player->user->name,
                'gender' => $player->user->gender,
                'avatar' => $player->user->avatar,
                'age' => $player->user->age,
                'date_of_birth' => $player->user->date_of_birth,
                'badminton_level' => $player->user->badmintonRank->id,
                'badminton_rank' => $player->user->badmintonRank->education_rank,
                'game_status' => $player->game_status,
                'finished_games_count' => $finishedGamesCount,
                'games' => $gameDetails,  // Include game details for each player
                'waiting_time' => $waitingTime
            ];
        });

        return back()->with(['response' => $mappedPlayers]);
    }

    public function fetchReadyPlayersByPartyID(2partyId)
    {
        $party = Party::find($partyId);

        if (!$party) {
            return []; // Return an empty array if the party doesn't exist
        }

        $currentDateTime = now();

        $query = PartyMember::with([
            'user.badmintonRank',
            'user',
            'user.gamePlayers.game',
            'user.gamePlayers.game.gameSets'
        ])
            ->where('party_id', $party->id)
            ->where('game_status', 'ready')
            ->whereDoesntHave('user.gamePlayers.game', function ($subQuery) {
                $subQuery->whereIn('status', ['setting', 'listing']);
            });

        if (!$party->is_inc_playing) {
            $query->whereDoesntHave('user.gamePlayers.game', function ($subQuery) {
                $subQuery->whereIn('status', ['playing']);
            });
        }

        $readyPlayers = $query->get();

        return $readyPlayers->map(function ($player) use ($party, $currentDateTime) {
            $finishedGamesCount = GamePlayer::where('user_id', $player->user_id)
                ->whereHas('game', function ($query) use ($party) {
                    $query->where('status', 'finished')
                        ->where('party_id', $party->id);
                })
                ->count();

            $lastGameEndTime = GamePlayer::where('user_id', $player->user_id)
                ->join('games', 'game_players.game_id', '=', 'games.id')
                ->where('games.status', 'finished')
                ->latest('games.game_end_date')
                ->select('game_players.*', 'games.game_end_date as game_end_date')
                ->first();

            $waitingTime = $lastGameEndTime
                ? abs(round($currentDateTime->diffInSeconds($lastGameEndTime->game_end_date, false)))
                : abs(round($currentDateTime->diffInSeconds($party->party_start_date, false)));

            $waitingTimeReadable = $this->convertWaitingTimeToReadableFormat($waitingTime);

            return [
                'user_id' => $player->user->id,
                'party_member_id' => $player->id,
                'name' => $player->user->name,
                'display_name' => $player->display_name ?? $player->user->name,
                'gender' => $player->user->gender,
                'avatar' => $player->user->avatar,
                'age' => $player->user->age,
                'date_of_birth' => $player->user->date_of_birth,
                'badminton_level' => $player->user->badmintonRank->id,
                'badminton_rank' => $player->user->badmintonRank->education_rank,
                'game_status' => $player->game_status,
                'finished_games_count' => $finishedGamesCount,
                'waiting_time' => $waitingTime,
                'waiting_time_readable' => $waitingTimeReadable,
            ];
        });
    }

    public function removePlayer(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:games,id',
            'user_id' => 'required|exists:users,id',
        ]);

        // Retrieve the game and ensure it's in the correct state
        $game = Game::findOrFail($request->game_id);

        // Allow removal only if the game is in the 'setting' or 'listing' state
        if (!in_array($game->status, ['setting', 'listing'])) {
            return back()->with('error', ['onlyOnSettingOrListing' => 'Players can only be removed when the game is in the setting or listing state.']);
        }

        // Retrieve the player to be removed
        $gamePlayer = GamePlayer::where('game_id', $request->game_id)
            ->where('user_id', $request->user_id)
            ->first();

        if (!$gamePlayer) {
            return back()->with('error', ['noPlayerFound' => 'Player not found in the specified game.']);
        }

        // Remove the player from the game
        $gamePlayer->delete();

        // If the game was in the 'listing' state, set it back to 'setting' if no players are left
        if ($game->status === 'listing') {
            $game->update(['status' => 'setting']);
        }

        return back()->with('success', 'Player has been removed and set to ready.');
    }

    public function listGame(Request $request, $gameId)
    {
        // Validate the request input for starting sides
        $validatedData = $request->validate([
            'team1_start_side' => [
                'sometimes',
                Rule::in(['north', 'south'])
            ]
        ]);

        // Find the game or fail with a 404 error
        $game = Game::with('gamePlayers')->findOrFail($gameId);

        // Determine the required number of players per team
        $requiredPlayersPerTeam = $game->game_type === 'double' ? 1 : 2;
        $requiredTotalPlayers = $requiredPlayersPerTeam * 2;

        // Check if the game has enough players
        if ($game->gamePlayers->count() < $requiredTotalPlayers) {
            return back()->with('error', ['notEnoughPlayers' => 'Cannot list the game: not enough players.']);
        }

        // Check if the game is already in progress or has started
        if ($game->status !== 'setting') {
            return back()->with('error', ['notInSetting' => 'Game is not in a setting state to list']);
        }

        // Start the game
        $game->status = 'listing';
        $game->game_list_date = Carbon::now();
        $game->save();

        return back()->with('success', 'The game has been listed for play.');
    }

    public function createGame(Request $request)
    {
        // Validate the request input
        $validatedData = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'game_type' => 'required|in:double,quadruple',
            'players' => 'required|array|min:2',
            'team1_start_side' => 'sometimes|in:north,south',
            'initial_shuttlecock_game' => 'sometimes|numeric|min:0',
            'process' => 'required|in:listing,playing', // Accept process to set status
        ]);

        $party = Party::findOrFail($validatedData['party_id']);
        $requiredPlayers = $validatedData['game_type'] === 'double' ? 2 : 4;

        // Validate the number of players matches the game type
        if (count($validatedData['players']) !== $requiredPlayers) {
            return back()->with('error', ['notMatchType' => 'The number of players does not match the game type requirements.']);
        }

        // Check if there's already a game in the 'setting' status for this party
        $existingGameSetting = Game::where('party_id', $validatedData['party_id'])
            ->where('status', 'setting')
            ->exists();

        if ($existingGameSetting) {
            return back()->with('error', ['existSettingGame' => 'There is already a game in the setting status for this party.']);
        }

        // Set game_start_date if process is playing
        $gameStartDate = $validatedData['process'] === 'playing' ? now() : null;

        // Create the game
        $game = Game::create([
            'party_id' => $validatedData['party_id'],
            'game_type' => $validatedData['game_type'],
            'status' => $validatedData['process'], // Set the status based on process
            'game_list_date' => now(),
            'game_start_date' => $gameStartDate, // Add start date if process is playing
            'game_create_date' => now(),
        ]);

        // Assign players to the game
        foreach ($validatedData['players'] as $index => $playerId) {
            $team = ($index < $requiredPlayers / 2) ? 1 : 2; // Split players into two teams
            $game->gamePlayers()->create([
                'user_id' => $playerId,
                'team' => $team,
            ]);
        }

        // Handle initial shuttlecocks
        $initialShuttlecocks = $request->input('initial_shuttlecock_game', 0);
        if ($initialShuttlecocks > 0) {
            $game->shuttlecocks()->create([
                'type' => 'initial',
                'quantity' => $initialShuttlecocks,
            ]);
        }

        if($validatedData['process'] === 'playing') {
            // Determine sides for the game set
            $team1StartSide = $validatedData['team1_start_side'] ?? 'north';
            $team2StartSide = $team1StartSide === 'north' ? 'south' : 'north';

            // Initialize the first game set
            $game->gameSets()->create([
                'set_number' => 1,
                'team1_start_side' => $team1StartSide,
                'team2_start_side' => $team2StartSide,
            ]);
        }

        return back()->with('success', 'The game has been successfully created with the status set to ' . $validatedData['process'] . '.');
    }

    public function startGame(Request $request, $gameId)
    {
        $validatedData = $request->validate([
            'team1_start_side' => [
                'sometimes',
                Rule::in(['north', 'south'])
            ]
        ]);

        // Find the game or fail with a 404 error
        $game = Game::with('gamePlayers')->findOrFail($gameId);

        // Check if the game is already in progress or has started
        if ($game->status !== 'listing') {
            return back()->with('error', ['notInListing' => 'Game is not in a state listing to start']);
        }

        // Check if any player is currently playing in another game within the same party
        $playerUserIds = $game->gamePlayers->pluck('user_id')->toArray();
        $activeGamesCount = GamePlayer::whereIn('user_id', $playerUserIds)
            ->whereHas('game', function ($query) use ($gameId, $game) {
                $query->where('id', '!=', $gameId) // Ignore the current game
                    ->where('status', 'playing') // Only consider games that are currently playing
                    ->where('party_id', $game->party_id); // Restrict to games within the same party
            })
            ->count();

        if ($activeGamesCount > 0) {
            return back()->with('error', ['playerPlaying' => 'One or more players are currently playing in another game within the same party.']);
        }

        // Start the game
        $game->status = 'playing';
        $game->game_start_date = Carbon::now();
        $game->save();

        // Determine sides based on input or default values
        $team1StartSide = $validatedData['team1_start_side'] ?? 'north';
        $team2StartSide = $team1StartSide === 'north' ? 'south' : 'north';

        // Determine the next set number by finding the highest current set number and adding 1
        $nextSetNumber = $game->gameSets()->max('set_number') + 1 ?? 1;

        // Initialize the first game set with specified or default sides
        $game->gameSets()->create([
            'set_number' => $nextSetNumber,
            'team1_start_side' => $team1StartSide,
            'team2_start_side' => $team2StartSide,
        ]);

        return back()->with('success', 'Game is starting.');
    }

    public function finishGame(Request $request, $gameId)
    {
        $game = Game::with('gamePlayers')->findOrFail($gameId);

        if ($game->status !== 'playing') {
            return back()->with('error', ['notInPlaying' => 'Game is not in a state that can be finished']);
        }

        $game->status = 'finished';
        $game->game_end_date = Carbon::now();  // Assuming you have a field for tracking game end time
        $game->save();

        // Fetch the user IDs of all game players
        $playerUserIds = $game->gamePlayers->pluck('user_id');

        // Conditionally update game_status to 'break' if the party setting is true
        if ($game->party->is_break_aftergame) {
            PartyMember::whereIn('user_id', $playerUserIds)
                ->where('party_id', $game->party_id)
                ->update(['game_status' => 'break']);
        }

        // Retrieve returned shuttlecocks count from the request
        $returnedShuttlecocks = $request->input('returned_shuttlecocks', 0);

        // Log the returned shuttlecocks
        if ($returnedShuttlecocks > 0) {
            $game->shuttlecocks()->create([
                'type' => 'returned',
                'quantity' => -$returnedShuttlecocks // Negative to denote returns
            ]);
        }

        return back()->with('success', 'Game finished successfully');
    }

    // auto add player to the game
    public function autoAddPlayers(Request $request, $gameId)
    {
        $game = Game::with('gamePlayers')->findOrFail($gameId);

        // Check if the game is in the 'setting' state
        if ($game->status !== 'setting') {
            return back()->with('error', ['notInSetting' => 'Players can only be added when the game is setting.']);
        }

        // Determine the maximum players per team based on the game type
        $maxPlayersPerTeam = $game->game_type === 'double' ? 1 : 2;
        $totalMaxPlayers = $maxPlayersPerTeam * 2; // Since there are two teams

        // Initial check to see if the game is already full
        if ($game->gamePlayers()->count() >= $totalMaxPlayers) {
            return back()->with('error', ['gameIsFull' => 'The game is already full and cannot accept more players.']);
        }

        // Retrieve all ready party members
        $readyMembers = PartyMember::where('party_id', $game->party_id)
            ->where('game_status', 'ready')
            ->get()
            ->shuffle();

        foreach ($readyMembers as $member) {
            // Check if the player is already in the game
            $isPlayerInGame = $game->gamePlayers()->where('user_id', $member->user_id)->exists();

            if (!$isPlayerInGame) {
                // Check if both teams are full
                $team1Count = $game->gamePlayers()->where('team', 'team1')->count();
                $team2Count = $game->gamePlayers()->where('team', 'team2')->count();

                // Assign to team1 if it's not full
                if ($team1Count < $maxPlayersPerTeam) {
                    $this->addPlayerToGame($game, $member, 'team1');
                }
                // Otherwise, assign to team2 if it's not full
                elseif ($team2Count < $maxPlayersPerTeam) {
                    $this->addPlayerToGame($game, $member, 'team2');
                }

                // Break if both teams are full
                if ($team1Count >= $maxPlayersPerTeam && $team2Count >= $maxPlayersPerTeam) {
                    break;
                }
            }
        }

        return back()->with('success', 'Players added automatically to the game.');
    }

    protected function addPlayerToGame($game, $member, $team)
    {
        // Check the current number of players in the specific team
        $currentTeamPlayerCount = $game->gamePlayers()->where('team', $team)->count();
        $maxPlayersPerTeam = $game->game_type === 'double' ? 1 : 2;

        if ($currentTeamPlayerCount < $maxPlayersPerTeam) {
            // Add the player to the game
            $game->gamePlayers()->create([
                'user_id' => $member->user_id,
                'team' => $team
            ]);
        }
    }

    // Shuttlecocks
    public function setInitialShuttlecocks(Game $game, $quantity)
    {
        $game->shuttlecocks()->create([
            'type' => 'initial',
            'quantity' => $quantity
        ]);
    }

    public function addAdditionalShuttlecocks(Game $game, Request $request)
    {

        // Check if the game is finished
        // if ($game->status === 'finished') {
        //     return back()->with('error', ['finishedGame' => 'Cannot add shuttlecocks to a finished game']);
        // }

        $quantity = $request->input('quantity', 1);

        $game->shuttlecocks()->create([
            'type' => 'additional',
            'quantity' => $quantity
        ]);
    }

    public function returnShuttlecocks(Game $game, Request $request)
    {

        $quantity = $request->input('quantity', 1);

        // Calculate the current total of shuttlecocks
        $currentTotalShuttlecocks = $game->shuttlecocks()->sum('quantity');

        // Check if the return would result in a negative total
        if ($currentTotalShuttlecocks - $quantity < 0) {
            return back()->with('error', ['shuttlecocksIsZero' => 'Cannot return shuttlecocks. Total would be below zero.']);
        }

        $game->shuttlecocks()->create([
            'type' => 'returned',
            'quantity' => -$quantity // Negative to indicate returns
        ]);
    }

    public function deleteGame(Game $game)
    {
        // Check if the game status is 'setting' or 'listing'
        if (!in_array($game->status, ['setting', 'listing'])) {
            return back()->with('error', ['onlyOnSettingOrListing' => 'The game can only be deleted when its status is "setting" or "listing".']);
        }

        // Delete the game
        $game->delete();

        return back()->with('success', 'The game has been successfully deleted.');
    }

    public function convertWaitingTimeToReadableFormat($seconds)
    {
        if ($seconds < 60) {
            return "{$seconds} seconds";
        }

        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;

        if ($minutes < 60) {
            return $remainingSeconds > 0
                ? "{$minutes} minutes, {$remainingSeconds} seconds"
                : "{$minutes} minutes";
        }

        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        return $remainingMinutes > 0
            ? "{$hours} hours, {$remainingMinutes} minutes"
            : "{$hours} hours";
    }

    /**
     * Update or insert multiple sets for a game.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateGameSets(Request $request, $game)
    {
        // Validate the request
        $validated = $request->validate([
            'sets' => 'required|array',
            'sets.*.set_number' => 'required|integer|min:1',
            'sets.*.team1_start_side' => 'required|in:north,south',
            'sets.*.team2_start_side' => 'required|in:north,south',
            'sets.*.team1_score' => 'required|integer|min:0',
            'sets.*.team2_score' => 'required|integer|min:0',
            'sets.*.winning_team' => 'nullable|in:team1,team2',
        ]);

        // Process each set
        $sets = $validated['sets'];

        // Retrieve existing sets for this game
        $existingSets = GameSet::where('game_id', $game)->get();

        // Track set numbers sent in the request
        $sentSetNumbers = collect($sets)->pluck('set_number');


        foreach ($sets as $set) {
            GameSet::updateOrCreate(
                [
                    'game_id' => $game,
                    'set_number' => $set['set_number'],
                ],
                [
                    'team1_start_side' => $set['team1_start_side'],
                    'team2_start_side' => $set['team2_start_side'],
                    'team1_score' => $set['team1_score'],
                    'team2_score' => $set['team2_score'],
                    'winning_team' => $set['winning_team'],
                ]
            );
        }

        // Delete any sets that are not in the sent set numbers
        $existingSets
            ->filter(fn($existingSet) => !$sentSetNumbers->contains($existingSet->set_number))
            ->each(fn($set) => $set->delete());

        return back()->with('response', [
            'message' => 'Game sets updated successfully',
            'sets' => $sets,
        ]);
    }
}
