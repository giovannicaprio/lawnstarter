<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StarWarsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Star Wars API Routes
Route::prefix('star-wars')->group(function () {
    Route::get('/characters', [StarWarsController::class, 'getCharacters']);
    Route::get('/characters/search', [StarWarsController::class, 'searchCharacters']);
    Route::get('/characters/{id}', [StarWarsController::class, 'getCharacter'])->where('id', '[0-9]+');
    Route::get('/statistics', [StarWarsController::class, 'getStatistics']);
    Route::get('/movies/search', [StarWarsController::class, 'searchMovies']);
}); 