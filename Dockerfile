FROM httpd:latest

# Копируем собранные файлы React из папки dist
COPY dist/ /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd-foreground"]