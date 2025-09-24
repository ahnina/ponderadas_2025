FROM php:8.1-apache

# Copia arquivos PHP
COPY ./www/ /var/www/html/

# Ativa mod_rewrite (opcional, mas útil)
RUN a2enmod rewrite

EXPOSE 80
