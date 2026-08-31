import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, "..");
const outputDir = resolve(projectRoot, "src", "shared", "api", "generated");

mkdirSync(outputDir, { recursive: true });

console.log("TypeScript generation from OpenAPI specs started...\n");

const useLocalFiles = process.env.USE_LOCAL_SPECS === "true";
const apiGatewayUrl = process.env.VITE_API_GATEWAY_URL || "http://localhost:4004";

const specs = [
  {
    name: "auth",
    url: `${apiGatewayUrl}/api-docs/auth`,
    localFile: resolve(projectRoot, "..", "project-mimi-server", "api-specs", "auth-service.yaml"),
    output: join(outputDir, "auth-api.ts"),
  },
  {
    name: "chat",
    url: `${apiGatewayUrl}/api-docs/chat`,
    localFile: null,
    output: join(outputDir, "chat-api.ts"),
  },
  {
    name: "chat-ws",
    url: null,
    localFile: resolve(projectRoot, "..", "project-mimi-server", "api-specs", "chat-service-ws.yaml"),
    output: join(outputDir, "chat-ws.ts"),
  },
  {
    name: "media",
    url: `${apiGatewayUrl}/api-docs/media`,
    localFile: resolve(projectRoot, "..", "project-mimi-server", "api-specs", "media-service.yaml"),
    output: join(outputDir, "media-api.ts"),
  },
];

let hasErrors = false;

for (const spec of specs) {
  try {
    let inputSource;

    if (spec.localFile && (!spec.url || useLocalFiles)) {
      try {
        readFileSync(spec.localFile, "utf-8");
        inputSource = spec.localFile;

        console.log(`Type generation for ${spec.name} from local file...`);
      } catch {
        if (spec.url) {
          inputSource = spec.url;

          console.log(`Local file ${spec.localFile} was not found, trying ${spec.url}...`);
        } else {
          console.error(`Local file ${spec.localFile} was not found and no URL is available for ${spec.name}.`);

          hasErrors = true;
          continue;
        }
      }
    } else if (spec.url) {
      inputSource = spec.url;

      console.log(`Type generation for ${spec.name} from ${spec.url}...`);
    } else {
      console.error(`No source available for ${spec.name}.`);

      hasErrors = true;
      continue;
    }

    execSync(`npx openapi-typescript "${inputSource}" -o "${spec.output}"`, {
      cwd: projectRoot,
      stdio: "inherit",
    });

    console.log(`Types for ${spec.name} were successfully generated in ${spec.output}\n`);
  } catch {
    hasErrors = true;

    console.error(`Type generation failed for ${spec.name}.\n`);
  }
}

if (hasErrors) {
  console.error("TypeScript generation finished with errors.");
  process.exit(1);
}

console.log("TypeScript generation completed successfully.");
