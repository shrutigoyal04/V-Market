export const normalizeString = (str: string | null | undefined): string => {
  if (str === null || str === undefined) {
    return '';
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ''); // Remove anything that's not a letter (a-z), number (0-9), or whitespace (\s)
};
