<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class ComputeSearchStatisticsTest extends TestCase
{
    public function test_statistics_compute_command_runs()
    {
        $this->artisan('statistics:compute')
            ->expectsOutput('Search statistics computed and cached.')
            ->assertExitCode(0);

        $this->assertNotNull(Cache::get('search_stats'));
    }
} 