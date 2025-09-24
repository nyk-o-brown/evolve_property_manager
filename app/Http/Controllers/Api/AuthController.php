<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $r)
    {
        $data = $r->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => ['required', Rule::in(['admin','landlord','tenant'])]
        ]);

        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>Hash::make($data['password']),
            'role'=>$data['role']
        ]);

        // If using token-based:
        // $token = $user->createToken('api_token')->plainTextToken;
        return response()->json(['user'=>$user],201);
    }

    public function login(Request $r)
    {
        $r->validate(['email'=>'required|email','password'=>'required|string']);

        $credentials = $r->only('email','password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message'=>'Invalid credentials'],401);
        }

        $user = Auth::user();
        // For SPA cookie-based (Sanctum), no token returned; frontend will have cookie
        // If token based:
        // $token = $user->createToken('api_token')->plainTextToken;
        return response()->json(['user'=>$user],200);
    }

    public function logout(Request $r)
    {
        $user = $r->user();
        if ($user) {
            // revoke current token if token-based
            $user->currentAccessToken()?->delete();
            Auth::logout();
        }
        return response()->json(['message'=>'Logged out']);
    }

    public function me(Request $r)
    {
        return response()->json(['user'=>$r->user()]);
    }

    public function passwordReset(Request $r)
    {
        // For brevity: stub that returns 200. In production integrate notifications.
        $r->validate(['email'=>'required|email']);
        return response()->json(['message'=>'Password reset email (stub) sent if user exists.']);
    }
}
