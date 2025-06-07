<?php

namespace App\Http\Controllers;

use App\Services\StarWarsService;
use App\Models\SearchStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class StarWarsController extends Controller
{
    private StarWarsService $starWarsService;

    public function __construct(StarWarsService $starWarsService)
    {
        $this->starWarsService = $starWarsService;
    }

    public function getCharacters(Request $request): JsonResponse
    {
        $page = $request->input('page', 1);
        $data = $this->starWarsService->getCharacters($page);

        if (!$data) {
            return response()->json([
                'error' => 'Failed to fetch characters'
            ], 500);
        }

        return response()->json($data);
    }

    public function getCharacter(int $id): JsonResponse
    {
        $data = $this->starWarsService->getCharacter($id);

        if (!$data) {
            return response()->json([
                'error' => 'Character not found'
            ], 404);
        }

        return response()->json($data);
    }

    public function searchCharacters(Request $request): JsonResponse
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([
                'error' => 'Search query is required'
            ], 400);
        }

        $startTime = microtime(true);
        $data = $this->starWarsService->searchCharacters($query);
        $responseTime = microtime(true) - $startTime;

        if (!$data) {
            return response()->json([
                'error' => 'Failed to search characters'
            ], 500);
        }

        // Record the search statistic
        SearchStatistic::create([
            'query' => $query,
            'response_time' => $responseTime,
            'timestamp' => now()
        ]);

        return response()->json($data);
    }

    public function getStatistics(): JsonResponse
    {
        $statistics = Cache::get('search_statistics');

        if (!$statistics) {
            return response()->json([
                'error' => 'Statistics not available'
            ], 404);
        }

        return response()->json($statistics);
    }
} 