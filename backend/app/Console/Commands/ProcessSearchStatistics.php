<?php

namespace App\Console\Commands;

use App\Models\SearchStatistic;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ProcessSearchStatistics extends Command
{
    protected $signature = 'statistics:process';
    protected $description = 'Process search statistics and cache the results';

    public function handle()
    {
        $this->info('Processing search statistics...');

        // Get top 5 queries with percentages
        $topQueries = SearchStatistic::selectRaw('query, COUNT(*) as count')
            ->where('timestamp', '>=', now()->subMinutes(5))
            ->groupBy('query')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        $totalQueries = $topQueries->sum('count');
        
        $topQueriesWithPercentages = $topQueries->map(function ($query) use ($totalQueries) {
            return [
                'query' => $query->query,
                'count' => $query->count,
                'percentage' => ($query->count / $totalQueries) * 100
            ];
        });

        // Get average response time
        $averageResponseTime = SearchStatistic::where('timestamp', '>=', now()->subMinutes(5))
            ->avg('response_time');

        // Get most popular hour
        $mostPopularHour = SearchStatistic::selectRaw('strftime("%H", timestamp) as hour, COUNT(*) as count')
            ->where('timestamp', '>=', now()->subMinutes(5))
            ->groupBy('hour')
            ->orderByDesc('count')
            ->first();

        // Cache the results
        Cache::put('search_statistics', [
            'top_queries' => $topQueriesWithPercentages,
            'average_response_time' => $averageResponseTime,
            'most_popular_hour' => $mostPopularHour ? $mostPopularHour->hour : null
        ], 300); // Cache for 5 minutes

        $this->info('Statistics processed and cached successfully.');
    }
} 