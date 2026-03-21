<?php

use App\Http\Controllers\Api;
use App\Http\Middleware\EnsureUserSetupApi;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — สำหรับ Flutter Mobile App
|--------------------------------------------------------------------------
| Prefix: /api (automatic by Laravel)
| Auth: Laravel Sanctum (token-based)
| Web routes (Inertia) ไม่กระทบ — อยู่ใน routes/web.php เหมือนเดิม
*/

// ==================== Public (No Auth) — Rate Limited ====================
Route::middleware('throttle:20,1')->prefix('auth')->group(function () {
    Route::post('register', [Api\AuthController::class, 'register']);
    Route::post('login', [Api\AuthController::class, 'login']);
    Route::post('social-login', [Api\AuthController::class, 'socialLogin']);
    Route::post('line-liff', [Api\AuthController::class, 'lineLiffLogin']);
    Route::post('forgot-password', [Api\AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [Api\AuthController::class, 'resetPassword']);
});

// ==================== Authenticated — Rate Limited ====================
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {

    // Auth & Device Management
    Route::post('auth/logout', [Api\AuthController::class, 'logout']);
    Route::post('auth/logout-all', [Api\AuthController::class, 'logoutAll']);
    Route::get('auth/user', [Api\AuthController::class, 'user']);
    Route::post('auth/refresh', [Api\AuthController::class, 'refreshToken']);
    Route::post('auth/register-device', [Api\AuthController::class, 'registerDevice']);
    Route::get('auth/devices', [Api\AuthController::class, 'devices']);
    Route::delete('auth/devices/{tokenId}', [Api\AuthController::class, 'revokeDevice']);

    // User Setup
    Route::get('user/setup-status', [Api\UserController::class, 'setupStatus']);
    Route::post('user/pdpa-consent', [Api\UserController::class, 'acceptPdpaConsent']);
    Route::post('user/setup', [Api\UserController::class, 'updateSetup']);

    // ==================== Requires Completed Setup ====================
    Route::middleware(EnsureUserSetupApi::class)->group(function () {

        // ----- Parties -----
        Route::get('parties', [Api\PartyController::class, 'index']);
        Route::get('parties/mine', [Api\PartyController::class, 'myParties']);
        Route::post('parties', [Api\PartyController::class, 'store']);
        Route::get('parties/{id}', [Api\PartyController::class, 'show']);
        Route::put('parties/{party}', [Api\PartyController::class, 'update']);
        Route::post('parties/{party}/end', [Api\PartyController::class, 'endParty']);
        Route::post('parties/{party}/duplicate', [Api\PartyController::class, 'duplicate']);
        Route::delete('parties/{party}', [Api\PartyController::class, 'destroy']);
        Route::post('parties/join', [Api\PartyController::class, 'joinParty']);
        Route::post('parties/{party}/confirm-join', [Api\PartyController::class, 'confirmJoinFromInvite']);
        Route::post('parties/{party}/generate-invite', [Api\PartyController::class, 'generateInviteLink']);
        Route::post('parties/{party}/set-passcode', [Api\PartyController::class, 'setPasscode']);
        Route::post('parties/{party}/verify-passcode', [Api\PartyController::class, 'verifyPasscode']);
        Route::get('parties/{id}/invite/{token}', [Api\PartyController::class, 'invitePreview']);
        Route::get('parties/{party}/invitable-users', [Api\PartyController::class, 'getInvitableUsers']);
        Route::post('parties/{party}/send-line-invitations', [Api\PartyController::class, 'sendLineInvitations']);
        Route::post('parties/{party}/shuttlecocks', [Api\PartyController::class, 'setInitialShuttlecocks']);
        Route::get('parties/{id}/tv', [Api\PartyController::class, 'tvDashboard']);

        // ----- Party Members -----
        Route::put('party-members/{id}/name', [Api\PartyMemberController::class, 'updateName']);
        Route::put('party-members/{id}/game-status', [Api\PartyMemberController::class, 'updateGameStatus']);
        Route::delete('party-members/{id}/kick', [Api\PartyMemberController::class, 'kickMember']);
        Route::post('party-members/{id}/leave', [Api\PartyMemberController::class, 'leaveParty']);

        // ----- Games -----
        Route::post('games', [Api\GameController::class, 'store']);
        Route::post('games/create', [Api\GameController::class, 'createGame']);
        Route::post('games/ready-players', [Api\GameController::class, 'fetchReadyPlayers']);
        Route::post('games/{game}/add-player', [Api\GameController::class, 'addPlayer']);
        Route::post('games/{game}/remove-player', [Api\GameController::class, 'removePlayer']);
        Route::post('games/{game}/auto-add-players', [Api\GameController::class, 'autoAddPlayers']);
        Route::post('games/{game}/list', [Api\GameController::class, 'listGame']);
        Route::post('games/{game}/start', [Api\GameController::class, 'startGame']);
        Route::post('games/{game}/finish', [Api\GameController::class, 'finishGame']);
        Route::delete('games/{game}', [Api\GameController::class, 'deleteGame']);
        Route::put('games/{game}/sets', [Api\GameController::class, 'updateGameSets']);
        Route::put('games/{game}/court-number', [Api\GameController::class, 'updateCourtNumber']);
        Route::post('games/{game}/shuttlecocks', [Api\GameController::class, 'addShuttlecocks']);
        Route::post('games/{game}/shuttlecocks/return', [Api\GameController::class, 'returnShuttlecocks']);
        Route::post('games/{game}/initial-shuttlecocks', [Api\GameController::class, 'setInitialShuttlecocks']);

        // ----- Chat -----
        Route::get('chats', [Api\ChatController::class, 'index']);
        Route::post('chats', [Api\ChatController::class, 'store']);
        Route::get('chats/{chatId}/messages', [Api\ChatController::class, 'getMessages']);
        Route::post('chats/{chatId}/messages', [Api\ChatController::class, 'sendMessage']);
        Route::post('chats/{chatId}/read', [Api\ChatController::class, 'markAsRead']);

        // ----- Friends -----
        Route::get('friends', [Api\FriendController::class, 'index']);
        Route::post('friends', [Api\FriendController::class, 'sendRequest']);
        Route::post('friends/{friendship}/accept', [Api\FriendController::class, 'acceptRequest']);
        Route::delete('friends/{friendship}', [Api\FriendController::class, 'cancelRequest']);

        // ----- Profile -----
        Route::get('profile', [Api\ProfileController::class, 'index']);
        Route::get('profile/edit', [Api\ProfileController::class, 'edit']);
        Route::put('profile', [Api\ProfileController::class, 'update']);
        Route::post('profile/avatar', [Api\ProfileController::class, 'uploadAvatar']);

        // ----- Courts -----
        Route::get('courts', [Api\CourtController::class, 'index']);
        Route::post('courts', [Api\CourtController::class, 'store']);
        Route::put('courts/{court}', [Api\CourtController::class, 'update']);
        Route::delete('courts/{court}', [Api\CourtController::class, 'destroy']);

        // ----- Verification -----
        Route::post('verify/phone/send', [Api\VerificationController::class, 'sendPhoneOtp']);
        Route::post('verify/phone/check', [Api\VerificationController::class, 'verifyPhone']);
        Route::post('verify/email/send', [Api\VerificationController::class, 'sendEmailCode']);
        Route::post('verify/email/check', [Api\VerificationController::class, 'verifyEmail']);

        // ----- Skill Assessment -----
        Route::get('skill-assessment', [Api\SkillAssessmentController::class, 'show']);
        Route::post('skill-assessment', [Api\SkillAssessmentController::class, 'store']);

        // ----- MMR -----
        Route::get('mmr/assessment', [Api\MmrController::class, 'showAssessment']);
        Route::post('mmr/assessment', [Api\MmrController::class, 'submitAssessment']);
        Route::get('mmr/result', [Api\MmrController::class, 'showResult']);

        // ----- Notifications -----
        Route::get('notifications/settings', [Api\NotificationController::class, 'settings']);
        Route::put('notifications/settings', [Api\NotificationController::class, 'updateSettings']);
        Route::post('notifications/test', [Api\NotificationController::class, 'sendTest']);
        Route::get('line-quota', [Api\NotificationController::class, 'lineQuota']);

        // ----- Feedback -----
        Route::get('feedback', [Api\FeedbackController::class, 'index']);
        Route::post('feedback', [Api\FeedbackController::class, 'store']);

        // ----- Level Up -----
        Route::post('level-up-seen/{id}', [Api\UserController::class, 'levelUpSeen']);

        // ----- Thai Address -----
        Route::get('thai-address', [Api\UserController::class, 'thaiAddressSearch']);
    });
});
