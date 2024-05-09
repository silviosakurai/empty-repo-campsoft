const fs = require("fs");
const dupKeyValidator = require("json-dup-key-validator");

const jsonContentPt = fs.readFileSync(
  "../../packages/core/plugins/i18next/locales/pt/translation.json",
  "utf8"
);
const jsonContentEn = fs.readFileSync(
  "../../packages/core/plugins/i18next/locales/en/translation.json",
  "utf8"
);

try {
  dupKeyValidator.parse(jsonContentPt, true);
  dupKeyValidator.parse(jsonContentEn, true);

  console.log("No duplicate keys found.");
} catch (e) {
  console.error("Duplicate keys detected:", e.message);
}
