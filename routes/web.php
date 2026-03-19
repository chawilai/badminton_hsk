<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\SocialController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CourtController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LineMessagingController;
use App\Http\Controllers\PartyController;
use App\Http\Controllers\PartyMemberController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MmrController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==================== Public ====================

Route::get('/', fn() => Inertia::render('Home'))->name('home');
Route::get('/home', fn() => Inertia::render('Home'));

// LINE webhook (exclude CSRF — external POST from LINE Platform)
Route::post('/webhook', [LineMessagingController::class, 'webhook'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// LINE LIFF
Route::post('/register-line', [RegisteredUserController::class, 'storeLine']);

// OAuth
Route::get('login/{provider}', [SocialController::class, 'redirectToProvider'])->name('social.login');
Route::get('login/{provider}/callback', [SocialController::class, 'handleProviderCallback']);
Route::post('login/lineliff', [SocialController::class, 'handleLineLiffLogin']);

// User setup
Route::get('/setup', [UserController::class, 'showSetupForm'])->name('user.setup');
Route::post('/setup', [UserController::class, 'updateSetup'])->name('user.setup.update');

// ==================== Auth Required ====================

Route::middleware('auth')->group(function () {

    // Dashboard redirect
    Route::get('/dashboard', fn() => redirect('/party-lists'))->name('dashboard');

    // Party
    Route::get('/party-lists', [PartyController::class, 'partyLists'])->name('parties.lists');
    Route::get('/my-parties', [PartyController::class, 'myParties'])->name('parties.my-parties');
    Route::get('/party/{id}', [PartyController::class, 'showParty'])->name('parties.show-party');
    Route::get('/party/{id}/tv', [PartyController::class, 'tvDashboard'])->name('parties.tv');
    Route::post('/party-create', [PartyController::class, 'store'])->name('parties.create');
    Route::post('/party/{party}/update', [PartyController::class, 'update'])->name('parties.update');
    Route::post('/party/{party}/end', [PartyController::class, 'endParty'])->name('parties.end');
    Route::post('/party/{party}/duplicate', [PartyController::class, 'duplicate'])->name('parties.duplicate');
    Route::post('/party-join', [PartyController::class, 'joinParty'])->name('parties.join');

    // Party Invite System
    Route::post('/party/{party}/generate-invite', [PartyController::class, 'generateInviteLink'])->name('parties.generate-invite');
    Route::post('/party/{party}/set-passcode', [PartyController::class, 'setPasscode'])->name('parties.set-passcode');
    Route::post('/party/{party}/verify-passcode', [PartyController::class, 'verifyPasscode'])->name('parties.verify-passcode');
    Route::get('/party/{id}/invite/{token}', [PartyController::class, 'showInvitePreview'])->name('parties.invite-token');
    Route::get('/party/{id}/invite-preview', [PartyController::class, 'showInvitePreview'])->name('parties.invite-preview');
    Route::post('/party/{party}/confirm-join', [PartyController::class, 'confirmJoinFromInvite'])->name('parties.confirm-join');
    Route::post('/parties/{party}/set-party-initial-shuttlecocks', [PartyController::class, 'setInitialShuttlecocks'])->name('parties.set-party-initial-shuttlecocks');
    Route::post('/fetch-party-data', [PartyController::class, 'fetchPartyData'])->name('fetch-party-data');

    // Party Members
    Route::post('/party-members/{id}/update-name', [PartyMemberController::class, 'updateName'])->name('party-members.update-name');
    Route::post('/party-members/{id}/update-game-status', [PartyMemberController::class, 'updateGameStatus'])->name('party-members.update-game-status');

    // Games
    Route::post('/games', [GameController::class, 'store'])->name('games.store');
    Route::post('/games/create-game', [GameController::class, 'createGame'])->name('createGame');
    Route::post('/games/{game}/add-player', [GameController::class, 'addPlayer'])->name('games.add-player');
    Route::post('/games/{game}/remove-player', [GameController::class, 'removePlayer'])->name('games.remove-player');
    Route::post('/games/{game}/list', [GameController::class, 'listGame'])->name('games.list');
    Route::post('/games/{game}/start', [GameController::class, 'startGame'])->name('games.start');
    Route::post('/games/{game}/finish', [GameController::class, 'finishGame'])->name('games.finish');
    Route::post('/games/{game}/delete', [GameController::class, 'deleteGame'])->name('game.delete');
    Route::post('/games/{game}/auto-add-players', [GameController::class, 'autoAddPlayers'])->name('games.auto-add-players');
    Route::post('/games/{game}/set-game-initial-shuttlecocks', [GameController::class, 'setInitialShuttlecocks'])->name('games.set-game-initial-shuttlecocks');
    Route::post('/games/{game}/add-shuttlecock', [GameController::class, 'addAdditionalShuttlecocks'])->name('games.add-shuttlecock');
    Route::post('/games/{game}/return-shuttlecocks', [GameController::class, 'returnShuttlecocks'])->name('games.returnShuttlecocks');
    Route::post('/games/{game}/update-game-sets', [GameController::class, 'updateGameSets'])->name('game-sets.update');
    Route::post('/games/{game}/update-court-number', [GameController::class, 'updateCourtNumber']);
    Route::post('/party_player', [GameController::class, 'fetchReadyPlayers'])->name('games.fetch-ready-player');

    // Chat
    Route::get('/chat', [ChatController::class, 'showChat']);
    Route::post('/chat/create', [ChatController::class, 'createChat']);
    Route::post('/chat/messages', [ChatController::class, 'getMessages']);
    Route::post('/chat/{chat_id}/send-message', [ChatController::class, 'sendMessage']);
    Route::post('/chat/{chat_id}/read', [ChatController::class, 'markAsRead']);

    // Friends
    Route::get('/friends', [FriendController::class, 'index']);
    Route::post('/friends/send', [FriendController::class, 'sendRequest']);
    Route::post('/friends/{friendship}/accept', [FriendController::class, 'acceptRequest']);
    Route::delete('/friends/{friendship}', [FriendController::class, 'cancelRequest']);

    // Courts (admin)
    Route::get('/courts', [CourtController::class, 'index']);
    Route::get('/court', fn() => redirect('/courts'));
    Route::post('/courts', [CourtController::class, 'store']);
    Route::post('/courts/{court}/update', [CourtController::class, 'update']);
    Route::delete('/courts/{court}', [CourtController::class, 'destroy']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Feedback
    Route::get('/feedback', [FeedbackController::class, 'index'])->name('feedback.index');
    Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');

    // Notifications
    Route::get('/notifications/settings', [NotificationController::class, 'settings'])->name('notifications.settings');
    Route::patch('/notifications/settings', [NotificationController::class, 'updateSettings'])->name('notifications.settings.update');
    Route::post('/notifications/test', [NotificationController::class, 'sendTest'])->name('notifications.test');

    // Admin
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/admin/feedbacks', [AdminController::class, 'feedbacks'])->name('admin.feedbacks');
    Route::patch('/admin/feedbacks/{feedback}/status', [AdminController::class, 'updateFeedbackStatus'])->name('admin.feedbacks.status');
    Route::post('/admin/feedbacks/{feedback}/reply', [AdminController::class, 'replyFeedback'])->name('admin.feedbacks.reply');

    // MMR Assessment
    Route::get('/mmr-assessment', [MmrController::class, 'showAssessment']);
    Route::post('/mmr-assessment', [MmrController::class, 'submitAssessment']);
    Route::get('/mmr-result', [MmrController::class, 'showResult']);
});

// 404 fallback
Route::fallback(fn() => Inertia::render('404'));

require __DIR__ . '/auth.php';
