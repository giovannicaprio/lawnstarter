FROM php:8.2-cli

# Instala dependências do sistema
RUN apt-get update \
    && apt-get install -y libzip-dev unzip git curl ca-certificates \
    && docker-php-ext-install zip

# Instala Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Define diretório de trabalho
WORKDIR /var/www/html

# Copia arquivos do projeto
COPY . .

# Instala dependências do Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Permissões para o storage
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 8000
EXPOSE 8000

# Start the Laravel scheduler and server
CMD ["sh", "-c", "php artisan schedule:work & php artisan serve --host=0.0.0.0 --port=8000"] 