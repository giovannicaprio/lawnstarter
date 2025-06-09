<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\SearchStatistic;

class StarWarsApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutExceptionHandling();
    }

    public function test_get_characters_endpoint()
    {
        $response = $this->getJson('/api/star-wars/characters');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'count',
                'next',
                'previous',
                'results'
            ]);
    }

    public function test_get_character_by_id_endpoint()
    {
        $response = $this->getJson('/api/star-wars/characters/1');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'name',
                'height',
                'mass',
                'hair_color',
                'skin_color',
                'eye_color',
                'birth_year',
                'gender',
                'homeworld',
                'films',
                'species',
                'vehicles',
                'starships',
                'created',
                'edited',
                'url'
            ]);
    }

    public function test_search_characters_endpoint()
    {
        $response = $this->getJson('/api/star-wars/characters/search?q=Luke');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'count',
                'next',
                'previous',
                'results'
            ]);
    }

    public function test_search_characters_without_query()
    {
        $response = $this->getJson('/api/star-wars/characters/search');

        $response->assertStatus(400)
            ->assertJson([
                'error' => 'Search query is required'
            ]);
    }

    public function test_get_statistics_endpoint()
    {
        // Create some test statistics
        SearchStatistic::create([
            'query' => 'Luke',
            'response_time' => 0.5,
            'timestamp' => now()
        ]);

        // Run the statistics processing command
        $this->artisan('statistics:process');

        $response = $this->getJson('/api/star-wars/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'top_queries',
                'average_response_time',
                'most_popular_hour'
            ]);
    }

    public function test_get_nonexistent_character()
    {
        $response = $this->getJson('/api/star-wars/characters/999999');

        $response->assertStatus(404)
            ->assertJson([
                'error' => 'Character not found'
            ]);
    }
} 