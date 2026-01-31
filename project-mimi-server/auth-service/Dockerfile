FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml ./pom.xml

COPY common-web ./common-web

COPY auth-service/pom.xml ./auth-service/pom.xml
COPY auth-service/src ./auth-service/src

WORKDIR /app/common-web
RUN mvn clean install -DskipTests

WORKDIR /app/auth-service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk AS runner

WORKDIR /app

COPY --from=builder /app/auth-service/target/*.jar /app/app.jar

EXPOSE 4005

ENTRYPOINT ["java", "-jar", "app.jar"]