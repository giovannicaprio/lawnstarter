FROM php:8.2-cli

# Instala dependências do sistema
RUN apt-get update \
    && apt-get install -y libzip-dev unzip git curl \
    && docker-php-ext-install zip pdo pdo_mysql

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

# Expõe a porta 8000
EXPOSE 8000

# Comando para rodar o servidor
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"] 