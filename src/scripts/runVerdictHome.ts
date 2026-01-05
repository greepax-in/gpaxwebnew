// FILE: src/scripts/runVerdictHome.ts

import fs from "fs";
import path from "path";
import { runVerdictEngine } from "../verdict/executeVerdictEngine";
import { generateVerdictExplain } from "../verdict/verdictExplain";

const ROOT = process.cwd();

const evidenceContractPath = path.join(
  ROOT,
  "contracts/evidence/evidence.contract.json"
);

const evidenceReportPath = path.join(
  ROOT,
  "reports/homepage.contract.evidence.json"
);

const verdictContractPath = path.join(
  ROOT,
  "contracts/verdict/verdict.contract.json"
);

const outputPath = path.join(
  ROOT,
  "reports/homepage.contract.verdict.json"
);

const explainPath = path.join(
  ROOT,
  "reports/homepage.contract.verdict.explain.json"
);

async function main() {
  const verdict = await runVerdictEngine({
    evidenceContractPath,
    evidenceReportPath,
    verdictContractPath
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(verdict, null, 2), "utf8");

  const explain = generateVerdictExplain(verdict);
  fs.writeFileSync(explainPath, JSON.stringify(explain, null, 2), "utf8");

  console.log("✅ Homepage verdict generated");
  console.log("EVIDENCE =", verdict);
  console.log("VERDICT =", verdict.status);
  console.log("EXPLAIN =", explainPath);
  console.log("OUTPUT =", outputPath);
}

main().catch(err => {
  console.error("❌ Verdict generation failed");
  console.error(err);
  process.exit(1);
});
