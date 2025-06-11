<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StarWarsController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;

Route::prefix('star-wars')->group(function () {
    Route::get('/characters/search', [StarWarsController::class, 'searchPeople']);
    Route::get('/movies/search', [StarWarsController::class, 'searchMovies']);
    Route::get('/characters/{id}', [StarWarsController::class, 'getPersonById']);
    Route::get('/movies/{id}', [StarWarsController::class, 'getMovieById']);
    Route::get('/statistics', function () {
        Artisan::call('statistics:compute');
        return response()->json(Cache::get('search_stats'));
    });
});

Route::get('/test', function () {
    return response()->json(['ok' => true]);
});

 