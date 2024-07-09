export function textPreview(text: string): string {
  return text.length > 16 ? text.slice(0, 16) + "..." : text;
}
