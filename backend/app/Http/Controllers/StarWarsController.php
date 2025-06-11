<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\SearchStatistic;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Carbon;


class StarWarsController extends Controller
{
    public function searchPeople(Request $request)
    {
        Log::info('StarWarsController@searchPeople called', [
            'ip' => $request->ip(),
            'timestamp' => now()->toDateTimeString(),
        ]);
        $query = $request->query('q');
        $cacheKey = 'swapi_people_all_pages';
        $start = microtime(true);
        $allPeople = cache()->remember($cacheKey, 300, function () {
            $all = [];
            $url = 'https://swapi.dev/api/people';
            do {
                $response = Http::withOptions(['verify' => false])->get($url);
                $data = $response->json();
                if (isset($data['results'])) {
                    $all = array_merge($all, $data['results']);
                }
                $url = $data['next'] ?? null;
            } while ($url);
            return $all;
        });
        $filtered = $allPeople;
        if ($query) {
            $filtered = array_filter($allPeople, function ($person) use ($query) {
                return stripos($person['name'], $query) !== false;
            });
        }
        $result = [
            'count' => count($filtered),
            'results' => array_values($filtered),
        ];
        $duration = microtime(true) - $start;
        SearchStatistic::create([
            'query' => $query ?? '',
            'type' => 'people',
            'response_time' => $duration,
            'created_at' => Carbon::now(),
        ]);
        return response()->json($result);
    }

    public function searchMovies(Request $request)
    {
        Log::info('StarWarsController@searchMovies called', [
            'ip' => $request->ip(),
            'timestamp' => now()->toDateTimeString(),
        ]);
        $query = $request->query('q');
        $cacheKey = 'swapi_movies_all_pages';
        $start = microtime(true);
        $allMovies = cache()->remember($cacheKey, 300, function () {
            $all = [];
            $url = 'https://swapi.dev/api/films';
            do {
                $response = Http::withOptions(['verify' => false])->get($url);
                $data = $response->json();
                if (isset($data['results'])) {
                    $all = array_merge($all, $data['results']);
                }
                $url = $data['next'] ?? null;
            } while ($url);
            return $all;
        });
        $filtered = $allMovies;
        if ($query) {
            $filtered = array_filter($allMovies, function ($movie) use ($query) {
                return stripos($movie['title'], $query) !== false;
            });
        }
        $result = [
            'count' => count($filtered),
            'results' => array_values($filtered),
        ];
        $duration = microtime(true) - $start;
        SearchStatistic::create([
            'query' => $query ?? '',
            'type' => 'movies',
            'response_time' => $duration,
            'created_at' => Carbon::now(),
        ]);
        return response()->json($result);
    }

    public function getPersonById($id)
    {
        $cacheKey = 'swapi_person_' . $id;
        $responseData = cache()->remember($cacheKey, 300, function () use ($id) {
            $response = Http::withOptions(['verify' => false])->get("https://swapi.dev/api/people/{$id}/");
            return [
                'body' => $response->json(),
                'status' => $response->status(),
            ];
        });
        return response()->json($responseData['body'], $responseData['status']);
    }

    public function getMovieById($id)
    {
        $cacheKey = 'swapi_movie_' . $id;
        $responseData = cache()->remember($cacheKey, 300, function () use ($id) {
            $response = Http::withOptions(['verify' => false])->get("https://swapi.dev/api/films/{$id}/");
            return [
                'body' => $response->json(),
                'status' => $response->status(),
            ];
        });
        return response()->json($responseData['body'], $responseData['status']);
    }

    public function statistics()
    {
        $stats = Cache::get('search_stats', []);
        return response()->json($stats);
    }
} 