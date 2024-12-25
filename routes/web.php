<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\SocialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PartyController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckUserSetup;
use App\Models\Game;
use App\Models\Party;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/', function () {
//     Auth::logout();
//     return Inertia::render('Prime');
// });

Route::get('/', function () {

    return redirect('/party');

    // return Inertia::render('Warrior', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
})->name('home');

Route::get('/organic', function () {
    return Inertia::render('Organic');
});

Route::get('/warrior_home', function () {
    return Inertia::render('Warrior');
});

Route::get('/test', function () {

    return Inertia::render('Test');
});

Route::get('/test2', function () {

    return Inertia::render('Test2');
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/landing', function () {
    return Inertia::render('Landing');
});

Route::get('/home', function () {
    return redirect('/party');
});

Route::get('/crud', function () {
    return Inertia::render('Prime/Crud');
});

// game
// Using web routes (if your application uses CSRF protection and sessions)
Route::post('/games', [GameController::class, 'store'])->name('games.store');

// // Using API routes (for stateless API)
// Route::post('/games', [GameController::class, 'store'])->name('games.store');

// Add a route to add a player to a game
Route::post('/games/{game}/add-player', [GameController::class, 'addPlayer'])->name('games.add-player');
Route::post('/games/{game}/remove-player', [GameController::class, 'removePlayer'])->name('games.remove-player');
Route::post('/games/{game}/list', [GameController::class, 'listGame'])->name('games.list');
Route::post('/games/{game}/start', [GameController::class, 'startGame'])->name('games.start');
Route::post('/games/{game}/finish', [GameController::class, 'finishGame'])->name('games.finish');
Route::post('/games/{game}/auto-add-players', [GameController::class, 'autoAddPlayers'])->name('games.auto-add-players');
Route::post('/games/{game}/set-game-initial-shuttlecocks', [GameController::class, 'setInitialShuttlecocks'])->name('games.set-game-initial-shuttlecocks');
Route::post('/games/{game}/add-shuttlecock', [GameController::class, 'addAdditionalShuttlecocks'])->name('games.add-shuttlecock');
Route::post('/party_player', [GameController::class, 'fetchReadyPlayers'])->name('games.fetch-ready-player');
// game


// LINE LIFF
Route::post('/register-line', [RegisteredUserController::class, 'storeLine']);
// LINE LIFF

// OAuth Provider
Route::get('login/{provider}', [SocialController::class, 'redirectToProvider'])->name('social.login');
Route::get('login/{provider}/callback', [SocialController::class, 'handleProviderCallback']);
// OAuth Provider

// party
Route::post('/parties/{party}/set-party-initial-shuttlecocks', [PartyController::class, 'setInitialShuttlecocks'])->name('parties.set-party-initial-shuttlecocks');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');

    Route::get('/party', [PartyController::class, 'index'])->name('party');
    Route::get('/party', [PartyController::class, 'index'])->name('party')->middleware(CheckUserSetup::class);
});

Route::get('/setup', [UserController::class, 'showSetupForm'])->name('user.setup');
Route::post('/setup', [UserController::class, 'updateSetup'])->name('user.setup.update');

Route::get('login/{provider}', [SocialController::class, 'redirectToProvider'])->name('social.login');
Route::get('login/{provider}/callback', [SocialController::class, 'handleProviderCallback']);
Route::post('login/lineliff', [SocialController::class, 'handleLineLiffLogin']);

Route::fallback(function () {
    return Inertia::render('404');
});

require __DIR__ . '/auth.php';

// Route::get('/login', function () {
//     return Inertia::render('Login');
// })->name('login');

// Route::post('/logout', function () {
//     Auth::logout();
//     request()->session()->invalidate();
//     request()->session()->regenerateToken();
//     return redirect('/');
// })->name('logout');
