FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml ./pom.xml

COPY api-gateway/pom.xml ./api-gateway/pom.xml
COPY api-gateway/src ./api-gateway/src

WORKDIR /app/api-gateway
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk AS runner

WORKDIR /app

COPY --from=builder /app/api-gateway/target/*.jar /app/app.jar

EXPOSE 4004

ENTRYPOINT ["java", "-jar", "app.jar"]