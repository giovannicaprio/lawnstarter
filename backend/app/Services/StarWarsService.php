<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class StarWarsService
{
    private const BASE_URL = 'https://swapi.dev/api';
    private const CACHE_TTL = 3600; // 1 hour

    public function getCharacters(int $page = 1)
    {
        $cacheKey = "swapi_characters_page_{$page}";
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($page) {
            try {
                $response = Http::get(self::BASE_URL . '/people', [
                    'page' => $page
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                Log::error('Star Wars API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return null;
            } catch (\Exception $e) {
                Log::error('Star Wars API exception', [
                    'message' => $e->getMessage()
                ]);

                return null;
            }
        });
    }

    public function getCharacter(int $id)
    {
        $cacheKey = "swapi_character_{$id}";
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($id) {
            try {
                $response = Http::get(self::BASE_URL . "/people/{$id}");

                if ($response->successful()) {
                    return $response->json();
                }

                Log::error('Star Wars API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return null;
            } catch (\Exception $e) {
                Log::error('Star Wars API exception', [
                    'message' => $e->getMessage()
                ]);

                return null;
            }
        });
    }

    public function searchCharacters(string $query)
    {
        $cacheKey = "swapi_search_{$query}";
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($query) {
            try {
                $response = Http::get(self::BASE_URL . '/people', [
                    'search' => $query
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                Log::error('Star Wars API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return null;
            } catch (\Exception $e) {
                Log::error('Star Wars API exception', [
                    'message' => $e->getMessage()
                ]);

                return null;
            }
        });
    }

    public function searchMovies(string $query)
    {
        $cacheKey = "swapi_movies_search_{$query}";
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($query) {
            try {
                $response = Http::get(self::BASE_URL . '/films', [
                    'search' => $query
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                Log::error('Star Wars API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return null;
            } catch (\Exception $e) {
                Log::error('Star Wars API exception', [
                    'message' => $e->getMessage()
                ]);

                return null;
            }
        });
    }
} 