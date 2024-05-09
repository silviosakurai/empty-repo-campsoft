const fs = require("fs");

function checkForDuplicateKeys(jsonObject, filePath) {
  function checkDuplicates(obj, path = []) {
    const keys = new Set();

    Object.keys(obj).forEach((key) => {
      const fullPath = path.concat(key).join(".");
      if (keys.has(key)) {
        throw new Error(
          `Duplicate key "${key}" found at path "${fullPath}" in file ${filePath}`
        );
      }
      keys.add(key);
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        checkDuplicates(obj[key], path.concat(key));
      }
    });
  }
  checkDuplicates(jsonObject);
}

process.argv.slice(2).forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  try {
    const json = JSON.parse(content);
    checkForDuplicateKeys(json, filePath);
    console.log(`No duplicate keys found in ${filePath}`);
  } catch (e) {
    console.error(`Error in ${filePath}: ${e.message}`);
    process.exit(1);
  }
});
