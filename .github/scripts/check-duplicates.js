const fs = require("fs");

function checkDuplicatesInFile(filePath) {
  const fileName = filePath.split("/").pop();
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split(/\r?\n/);
  const keysSeen = new Map();

  let duplicatesFound = false;

  lines.forEach((line) => {
    const match = line.match(/"([^"]+)":/);

    if (match) {
      const key = match[1];

      if (keysSeen.has(key)) {
        console.error(`Duplicate key "${key}" found in ${fileName}`);
        duplicatesFound = true;
      }

      keysSeen.set(key, (keysSeen.get(key) || 0) + 1);
    }
  });

  if (duplicatesFound) {
    process.exit(1);
  } else {
    console.log(`No duplicate keys found in ${fileName}.`);
  }
}

const paths = [
  "packages/core/plugins/i18next/locales/en/translation.json",
  "packages/core/plugins/i18next/locales/pt/translation.json",
];

paths.forEach((path) => checkDuplicatesInFile(path));
