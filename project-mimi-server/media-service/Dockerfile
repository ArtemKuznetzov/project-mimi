FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml ./pom.xml

COPY common-web ./common-web

COPY media-service/pom.xml ./media-service/pom.xml
COPY media-service/src ./media-service/src

WORKDIR /app/common-web
RUN mvn clean install -DskipTests

WORKDIR /app/media-service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk AS runner

WORKDIR /app

COPY --from=builder /app/media-service/target/*.jar /app/app.jar

EXPOSE 4006

ENTRYPOINT ["java", "-jar", "app.jar"]