import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function exactNames(dir, needle) {
    const files = fs.readdirSync(dir);
    return files.filter((f) => f.toLowerCase().includes(needle.toLowerCase()));
}

const modelsDir = path.join(__dirname, "src", "models");
const zodDir = path.join(__dirname, "src", "zodSchemas");
const modelHits = exactNames(modelsDir, "check");
const zodHits = exactNames(zodDir, "check");
const wantsModel = "Checkup.model.js";
const wantsZod = "checkup.schema.js";
let gitModelNames = [];
let gitZodNames = [];
try {
    const { execSync } = await import("child_process");
    gitModelNames = execSync("git ls-files src/models/", { cwd: __dirname, encoding: "utf8" })
        .trim()
        .split(/\r?\n/)
        .filter((f) => f.toLowerCase().includes("check"));
    gitZodNames = execSync("git ls-files src/zodSchemas/", { cwd: __dirname, encoding: "utf8" })
        .trim()
        .split(/\r?\n/)
        .filter((f) => f.toLowerCase().includes("check"));
} catch (_) {}

// #region agent log
try {
    const logPath = path.join(__dirname, "..", "debug-b00b3f.log");
    const lineA = JSON.stringify({
        sessionId: "b00b3f",
        runId: "post-fix",
        hypothesisId: "A",
        location: "debug-casecheck.js:models",
        message: "Exact model filenames vs import",
        data: {
            modelHits,
            importPath: wantsModel,
            exactMatch: modelHits.includes(wantsModel),
            caseOnlyMismatch: modelHits.some((f) => f.toLowerCase() === wantsModel.toLowerCase()) && !modelHits.includes(wantsModel),
            gitModelNames,
            gitIndexMatchesImport: gitModelNames.some((f) => f.endsWith(wantsModel)),
        },
        timestamp: Date.now(),
    });
    const lineC = JSON.stringify({
        sessionId: "b00b3f",
        runId: "post-fix",
        hypothesisId: "C",
        location: "debug-casecheck.js:zod",
        message: "Exact zod filenames vs import",
        data: {
            zodHits,
            importPath: wantsZod,
            exactMatch: zodHits.includes(wantsZod),
            caseOnlyMismatch: zodHits.some((f) => f.toLowerCase() === wantsZod.toLowerCase()) && !zodHits.includes(wantsZod),
            gitZodNames,
            gitIndexMatchesImport: gitZodNames.some((f) => f.endsWith(wantsZod)),
        },
        timestamp: Date.now(),
    });
    fs.appendFileSync(logPath, lineA + "\n" + lineC + "\n");
} catch (_) {}
fetch("http://127.0.0.1:7438/ingest/23698b4b-6232-4ee7-8433-eca42b4ecabc", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "b00b3f" },
    body: JSON.stringify({
        sessionId: "b00b3f",
        runId: "post-fix",
        hypothesisId: "A",
        location: "debug-casecheck.js:models",
        message: "Exact model filenames vs import",
        data: {
            modelHits,
            importPath: wantsModel,
            exactMatch: modelHits.includes(wantsModel),
            caseOnlyMismatch: modelHits.some((f) => f.toLowerCase() === wantsModel.toLowerCase()) && !modelHits.includes(wantsModel),
            gitModelNames,
            gitIndexMatchesImport: gitModelNames.some((f) => f.endsWith(wantsModel)),
        },
        timestamp: Date.now(),
    }),
}).catch(() => {});
fetch("http://127.0.0.1:7438/ingest/23698b4b-6232-4ee7-8433-eca42b4ecabc", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "b00b3f" },
    body: JSON.stringify({
        sessionId: "b00b3f",
        runId: "post-fix",
        hypothesisId: "C",
        location: "debug-casecheck.js:zod",
        message: "Exact zod filenames vs import",
        data: {
            zodHits,
            importPath: wantsZod,
            exactMatch: zodHits.includes(wantsZod),
            caseOnlyMismatch: zodHits.some((f) => f.toLowerCase() === wantsZod.toLowerCase()) && !zodHits.includes(wantsZod),
            gitZodNames,
            gitIndexMatchesImport: gitZodNames.some((f) => f.endsWith(wantsZod)),
        },
        timestamp: Date.now(),
    }),
}).catch(() => {});
// #endregion
