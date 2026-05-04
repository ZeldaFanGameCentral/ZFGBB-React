import * as v from "valibot";

export const MessageEditorSchema = v.object({
  body: v.pipe(
    v.string(),
    v.nonEmpty("Message cannot be empty."),
    v.maxLength(20000, "Message is too long."),
  ),
});

export type MessageEditor = v.InferOutput<typeof MessageEditorSchema>;
