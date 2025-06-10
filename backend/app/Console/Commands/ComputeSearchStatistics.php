<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SearchStatistic;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Carbon;

class ComputeSearchStatistics extends Command
{
    protected $signature = 'statistics:compute';
    protected $description = 'Compute and cache search statistics';

    public function handle()
    {
        $stats = [];
        $total = SearchStatistic::count();
        $topQueries = SearchStatistic::selectRaw('query, COUNT(*) as count')
            ->groupBy('query')
            ->orderByDesc('count')
            ->limit(5)
            ->get();
        $stats['top_queries'] = $topQueries->map(function($row) use ($total) {
            return [
                'query' => $row->query,
                'count' => $row->count,
                'percent' => $total ? round($row->count / $total * 100, 2) : 0
            ];
        });
        $stats['average_response_time'] = round(SearchStatistic::avg('response_time'), 3);
        $stats['most_popular_hour'] = SearchStatistic::selectRaw("strftime('%H', created_at) as hour, COUNT(*) as count")
            ->groupBy('hour')
            ->orderByDesc('count')
            ->first();
        Cache::put('search_stats', $stats, 300);
        $this->info('Search statistics computed and cached.');
    }
} 