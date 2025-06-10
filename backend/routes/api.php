<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StarWarsController;

Route::prefix('star-wars')->group(function () {
    Route::get('/characters/search', [StarWarsController::class, 'searchPeople']);
    Route::get('/movies/search', [StarWarsController::class, 'searchMovies']);
    Route::get('/characters/{id}', [StarWarsController::class, 'getPersonById']);
    Route::get('/movies/{id}', [StarWarsController::class, 'getMovieById']);
});

Route::get('/test', function () {
    return response()->json(['ok' => true]);
});

 