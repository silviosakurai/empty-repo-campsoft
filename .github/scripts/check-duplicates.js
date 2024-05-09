const fs = require("fs");

function checkForDuplicateKeys(jsonObject, filePath) {
  const keys = new Set();
  function checkDuplicates(obj, path = []) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        return checkDuplicates(obj[key], path.concat(key));
      }
      const fullPath = path.concat(key).join(".");
      if (keys.has(fullPath)) {
        throw new Error(
          `Duplicate key "${fullPath}" found in file ${filePath}`
        );
      }
      keys.add(fullPath);
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
    console.error(`JSON parsing error in ${filePath}: ${e.message}`);
    process.exit(1);
  }
});
