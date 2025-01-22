<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LineMessagingController extends Controller
{
    public function webhook(Request $request)
    {
        dd($request);
    }
}
