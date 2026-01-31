FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml ./pom.xml

COPY common-web ./common-web

COPY chat-service/pom.xml ./chat-service/pom.xml
COPY chat-service/src ./chat-service/src

COPY api-specs ./api-specs

WORKDIR /app/common-web
RUN mvn clean install -DskipTests

WORKDIR /app/chat-service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk AS runner

WORKDIR /app

COPY --from=builder /app/chat-service/target/*.jar /app/app.jar

EXPOSE 4000

ENTRYPOINT ["java", "-jar", "app.jar"]