<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LineMessagingController extends Controller
{
    public function webhook(Request $request)
    {
        // LINE Platform expects 200 OK response
        return response('OK', 200);
    }
}
