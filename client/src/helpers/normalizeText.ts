// for search and comparing: no letter case, no accents ("Łukasz" -> "lukasz")
const normalizeText = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    // "ł" has no accent to remove - it is its own letter
    .replace(/ł/g, "l");

export default normalizeText;
