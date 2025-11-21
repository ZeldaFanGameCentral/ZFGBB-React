import type { Span } from "@oxc-project/types";

export interface SourceEdit extends Span {
  text: string;
}

export function applySourceEdits(sourceCode: string, edits: SourceEdit[]) {
  if (edits.length === 0) return sourceCode;
  const sortedEdits = edits.sort((a, b) => a.start - b.start);
  let output = "";
  let cursor = 0;
  let lastEditEnd = -1;

  for (const edit of sortedEdits) {
    if (edit.start < lastEditEnd)
      throw new Error(`Overlapping edits near ${edit.start}-${edit.end}`);
    output += sourceCode.slice(cursor, edit.start) + edit.text;
    cursor = edit.end;
    lastEditEnd = edit.end;
  }

  return output + sourceCode.slice(cursor);
}
