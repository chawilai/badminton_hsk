<?php

use App\Http\Controllers\Auth\SocialController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Warrior', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/organic', function () {
    return Inertia::render('Organic');
});

Route::get('/warrior_home', function () {
    return Inertia::render('Warrior');
});

Route::get('/warrior_textbook', function () {
    return Inertia::render('WarriorHSKTextbook');
});

Route::get('/warrior_workbook', function () {
    return Inertia::render('WarriorHSKWorkbook');
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('login/{provider}', [SocialController::class, 'redirectToProvider'])->name('social.login');
Route::get('login/{provider}/callback', [SocialController::class, 'handleProviderCallback']);

Route::fallback(function () {
    return Inertia::render('404');
});

require __DIR__ . '/auth.php';
