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
];

for (const spec of specs) {
  try {
    let inputSource = "";

    if (useLocalFiles && spec.localFile) {
      try {
        readFileSync(spec.localFile, "utf-8");
        inputSource = spec.localFile;
        console.log(`Type generation for ${spec.name} from local file...`);
      } catch (error) {
        console.warn(`Local file ${spec.localFile} was not found, try to use URL...`);
        inputSource = spec.url;
        console.log(`Type generation for ${spec.name} from ${spec.url}...`);
      }
    } else {
      inputSource = spec.url;
      console.log(`Type generation for ${spec.name} from ${spec.url}...`);
    }

    const command = `npx openapi-typescript "${inputSource}" -o "${spec.output}"`;
    execSync(command, {
      cwd: projectRoot,
      stdio: "inherit",
      encoding: "utf-8",
    });

    console.log(`Types for ${spec.name} were successfully generated in ${spec.output}\n`);
  } catch (error) {
    console.error(`Error when generating types for ${spec.name}:`, error.message);
    if (!useLocalFiles) {
      console.warn(`Make sure that the server is running and accessible at ${spec.url}`);
      console.warn(`Try using local file: USE_LOCAL_SPECS=true npm run generate:api-types`);
    }
  }
}

console.log("Generation is complete!");
