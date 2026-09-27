import { MAX_ITEM_NAME_LENGTH, validateItemName } from "#util/validation.ts";

describe(validateItemName, () => {
  it.each([
    ["a simple file name", "budget.xlsx"],
    ["a simple directory name", "reports"],
    ["a name with spaces inside", "Q3 budget.xlsx"],
    ["a name with dots inside", "archive.tar.gz"],
    ["a dotfile name", ".gitignore"],
    ["a name at the maximum length", "a".repeat(MAX_ITEM_NAME_LENGTH)],
    ["a name with unicode characters", "résumé 📄.pdf"],
  ])("accepts %s", (_description, name) => {
    expect(validateItemName(name)).toBeUndefined();
  });

  it.each([
    ["an empty name", ""],
    ["a whitespace-only name", "   "],
    ["a name with leading whitespace", " report.pdf"],
    ["a name with trailing whitespace", "report.pdf "],
    ["a name containing a slash", "dir/file.txt"],
    ["a name that is only a slash", "/"],
    ["the current-directory name", "."],
    ["the parent-directory name", ".."],
    ["a name over the maximum length", "a".repeat(MAX_ITEM_NAME_LENGTH + 1)],
  ])("rejects %s with an error message", (_description, name) => {
    expect(validateItemName(name)).toEqual(expect.any(String));
  });
});
