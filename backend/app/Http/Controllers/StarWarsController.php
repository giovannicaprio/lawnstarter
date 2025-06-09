<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class StarWarsController extends Controller
{
    public function searchPeople(Request $request)
    {
        Log::info('StarWarsController@searchPeople called', [
            'ip' => $request->ip(),
            'timestamp' => now()->toDateTimeString(),
        ]);
        // Ignora o parâmetro recebido e busca todos os personagens
        $response = Http::withOptions(['verify' => false])->get('https://swapi.dev/api/people');
        return response()->json($response->json(), $response->status());
        
    }

    public function searchMovies(Request $request)
    {
        Log::info('StarWarsController@searchMovies called', [
            'ip' => $request->ip(),
            'timestamp' => now()->toDateTimeString(),
        ]);
        // Ignora o parâmetro recebido e busca todos os filmes
        $response = Http::withOptions(['verify' => false])->get('https://swapi.dev/api/films');
        return response()->json($response->json(), $response->status());
    }
} 