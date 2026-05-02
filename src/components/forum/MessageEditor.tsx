import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { MessageEditorSchema, type MessageEditor } from "@/schemas/forum";
import type { Message } from "../../types/forum";

interface MessageEditorProps {
  threadId: number;
}

const MessageEditor: React.FC<MessageEditorProps> = ({ threadId }) => {
  const { data: currentMsg, isLoading } = useBBQuery<Message>(
    `/message/template?threadId=${threadId}`,
  );

  if (isLoading || !currentMsg) {
    return null;
  }

  return <MessageEditorForm threadId={threadId} template={currentMsg} />;
};

function MessageEditorForm({
  threadId,
  template,
}: {
  threadId: number;
  template: Message;
}) {
  const newPostMutator = useMutation<unknown, Error, MessageEditor>({
    mutationFn: async (values) => {
      const body: Message = {
        ...template,
        currentMessage: {
          ...template.currentMessage,
          unparsedText: values.body,
        },
      };
      const response = await fetch(`${getApiBaseUrl()}/message/${threadId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return handleResponseWithJason<unknown>(response);
    },
  });

  const form = useForm({
    defaultValues: {
      body: template.currentMessage.unparsedText ?? "",
    } as MessageEditor,
    validators: {
      onBlur: MessageEditorSchema,
      onSubmit: MessageEditorSchema,
    },
    onSubmit: async ({ value }) => {
      await newPostMutator.mutateAsync(value);
    },
  });

  return (
    <div className="mt-3">
      <div className="p-4 mb-4 border-2 border-red-500 text-red-600 bg-red-50">
        Warning: this topic has not been posted in for at least 14 days. Unless
        you're sure you want to reply, please consider starting a new topic.
      </div>

      <BBForm
        form={form}
        className="space-y-4"
        errorMessage={newPostMutator.isError ? "Failed to post message." : null}
      >
        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-muted border border-default  hover:bg-elevated"
          >
            B
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-muted border border-default  hover:bg-elevated"
          >
            I
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-muted border border-default  hover:bg-elevated"
          >
            U
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-muted border border-default  hover:bg-elevated"
          >
            S
          </button>
          <span className="text-muted">|</span>
        </div>
        <BBTextareaField name="body" rows={15} />
        <BBSubmit
          pendingChildren="Posting..."
          className="px-4 py-2 bg-accented border border-default hover:bg-elevated disabled:opacity-50"
        >
          Submit Post
        </BBSubmit>
      </BBForm>
    </div>
  );
}

export default MessageEditor;
