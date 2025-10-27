FROM openjdk:17-jdk-slim

WORKDIR /app

# Копируем собранный JAR файл
COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]