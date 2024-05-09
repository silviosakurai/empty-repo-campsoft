const fs = require("fs");

const jsonData = JSON.parse(
  fs.readFileSync(
    "packages/core/plugins/i18next/locales/en/translation.json",
    "utf8"
  )
);
const keysSeen = new Set();

let hasDuplicates = false;

function checkKeys(object) {
  for (const key of Object.keys(object)) {
    if (keysSeen.has(key)) {
      console.error(`Duplicate key found: ${key}`);
      hasDuplicates = true;
    }
    keysSeen.add(key);
    if (typeof object[key] === "object" && object[key] !== null) {
      checkKeys(object[key]);
    }
  }
}

checkKeys(jsonData);

if (!hasDuplicates) {
  console.log("No duplicate keys found.");
}
