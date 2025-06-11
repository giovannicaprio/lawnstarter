<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StarWarsControllerTest extends TestCase
{
    public function test_search_people_endpoint_returns_success()
    {
        $response = $this->get('/api/star-wars/characters/search?q=luke');
        $response->assertStatus(200);
        $response->assertJsonStructure(['results']);
    }
} 