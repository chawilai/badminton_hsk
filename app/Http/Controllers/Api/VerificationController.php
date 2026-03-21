<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    /**
     * Delegate to web VerificationController — it already returns JSON.
     */
    public function sendPhoneOtp(Request $request)
    {
        return app(\App\Http\Controllers\VerificationController::class)->sendPhoneOtp($request);
    }

    public function verifyPhone(Request $request)
    {
        return app(\App\Http\Controllers\VerificationController::class)->verifyPhone($request);
    }

    public function sendEmailCode(Request $request)
    {
        return app(\App\Http\Controllers\VerificationController::class)->sendEmailCode($request);
    }

    public function verifyEmail(Request $request)
    {
        return app(\App\Http\Controllers\VerificationController::class)->verifyEmail($request);
    }
}
