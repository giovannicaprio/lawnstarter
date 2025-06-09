<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StarWarsController;

Route::prefix('star-wars')->group(function () {
    Route::get('/characters/search', [StarWarsController::class, 'searchPeople']);
    Route::get('/movies/search', [StarWarsController::class, 'searchMovies']);
});

Route::get('/test', function () {
    return response()->json(['ok' => true]);
});

