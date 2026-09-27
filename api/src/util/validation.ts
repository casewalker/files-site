export const MAX_ITEM_NAME_LENGTH = 255;

/**
 * Validates a file or directory name. Returns an error message, or undefined if the name is valid.
 * Names are case-sensitive (`Report.pdf` and `report.pdf` are distinct items).
 */
export const validateItemName = (name: string): string | undefined => {
  if (name.trim() === "") {
    return "Name must not be empty";
  }
  if (name !== name.trim()) {
    return "Name must not start or end with whitespace";
  }
  if (name.includes("/")) {
    return "Name must not contain '/'";
  }
  if (name === "." || name === "..") {
    return "Name must not be '.' or '..'";
  }
  if (name.length > MAX_ITEM_NAME_LENGTH) {
    return `Name must be at most ${MAX_ITEM_NAME_LENGTH} characters`;
  }
  return undefined;
};
