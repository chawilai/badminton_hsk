<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Inertia\Inertia;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        // Existing validation errors
        $errors = $this->resolveValidationErrors($request);

        // Convert errors to an array if it's an object
        if (is_object($errors)) {
            $errors = json_decode(json_encode($errors), true);
        }

        $flash = [];
        $response = [];

        // Retrieve flash error messages from the session

        if ($request->session()->has('success')) $flash['success'][] = $request->session()->get('success');
        if ($request->session()->has('info')) $flash['info'][] = $request->session()->get('info');

        if ($request->session()->has('response')) {
            $response = $request->session()->get('response');
        }

        if ($request->session()->has('error')) {

            $sessionError = is_array($request->session()->get('error')) ? $request->session()->get('error') : ['error' => $request->session()->get('error')];

            $errors = array_merge($errors, $sessionError);
        }

        return array_merge(parent::share($request), [
            'errors' => Inertia::always($errors),
            'flash' => $flash,
            'ably_key' => env('ABLY_KEY'),
            'response' => $response,
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ]
        ]);

        // return [
        //     ...parent::share($request),
        //     'auth' => [
        //         'user' => $request->user(),
        //     ],
        //     'ziggy' => fn () => [
        //         ...(new Ziggy)->toArray(),
        //         'location' => $request->url(),
        //     ]
        // ];
    }
}
