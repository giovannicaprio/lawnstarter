<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('search_statistics', function (Blueprint $table) {
            $table->id();
            $table->string('query');
            $table->string('type');
            $table->float('response_time');
            $table->timestamp('created_at')->useCurrent();
        });
    }
    public function down()
    {
        Schema::dropIfExists('search_statistics');
    }
}; 