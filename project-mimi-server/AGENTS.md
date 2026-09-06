# project-mimi-server

Java 21, Spring Boot 3.5, Maven aggregator. Stay in the module that owns the domain. Public errors are `ErrorResponse` via `common-web` (`ApiException`), not ProblemDetail.

## Modules

| Module | Owns |
|---|---|
| `api-gateway` | JWT → `X-User-Id` / `X-User-Role`; routes `/auth/**`, `/chat/**`, `/chat/ws/**`, `/files/**` |
| `auth-service` | users, JWT, cookies; package `com.pm.*` |
| `chat-service` | dialogs, messages, reactions, STOMP; package `com.pm.chatservice.*` |
| `media-service` | MinIO files; package `com.pm.mediaservice.*` |
| `common-web` | `ApiException`, `ErrorResponse`, `GlobalExceptionHandler` |
| `api-specs/` | hand-written OpenAPI YAML for shared contracts |

Chat/media trust gateway headers. Principal is `Long userId` (`@AuthenticationPrincipal Long userId` or `RequestUserContext.getCurrentUserId()`). Auth-service validates JWT itself. Inter-service HTTP: `RestClient` wrappers on servlet apps (`AuthServiceClient`, `MediaServiceClient`); gateway uses `WebClient`. Forward `Authorization` or `X-User-Id` as those clients already do.

Realtime chat is STOMP (`SimpMessagingTemplate`, app prefix `/app`, broker `/topic/dialogs/{id}/…`). Handshake principal from gateway headers; token also as `?token=` on `/ws`.

## Services and HTTP

Controllers bind `@Valid` records and call a service. `@Transactional` on service methods (`readOnly = true` for reads), not on controllers. API I/O: Java records named `*DTO`. MapStruct `@Mapper(componentModel = "spring")` for entity→DTO; a `@Component` mapper only when mapping is aggregation (reactions). Controllers return DTOs, not entities.

Throw `new ApiException(HttpStatus, "UPPER_SNAKE_CODE", "message")`. Reuse codes: `DIALOG_ACCESS_DENIED`, `MESSAGE_EMPTY`, `MESSAGE_NOT_FOUND`, `VALIDATION_ERROR`, `UNAUTHORIZED`. Beans: `@RequiredArgsConstructor`. Entities: `@Data @Builder @NoArgsConstructor @AllArgsConstructor`. Log with `@Slf4j`.

Auth schema: Hibernate `ddl-auto=update`. Chat schema: Liquibase under `chat-service/src/main/resources/db/changelog/` (include from `main-changelog.xml`), `ddl-auto=validate`.

After `api-specs` changes, regenerate chat OpenAPI **models** (`authclient.model`, `mediaclient.model`); those packages are generated.

## Chat invariants

Before read or mutate of a dialog (REST and STOMP): verify the user is a participant. A missing check on an existing path is a bug to fix when you touch it.

- Message belongs to dialog (`findByIdAndDialog_Id`) → `MESSAGE_NOT_FOUND`
- Edit/delete: author only (`USER_NOT_AUTHOR`)
- Text or attachment required → `MESSAGE_EMPTY`
- Soft-delete (`isDeleted`); do not edit deleted → `MESSAGE_DELETED`
- Reply must be in the same dialog
- Read cursor only moves forward; fan-out `/topic/dialogs/{id}/read`
