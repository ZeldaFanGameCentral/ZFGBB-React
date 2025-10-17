import { useBBQuery } from "../../hooks/useBBQuery";
import type { Message } from "../../types/forum";
import { useBBMutation } from "../../hooks/useBBMutation";
import type { BaseBB } from "../../types/api";

interface MessageEditorProps {
  threadId: number;
}

const MessageEditor: React.FC<MessageEditorProps> = ({ threadId }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { data: currentMsg } = useBBQuery<Message>(
    `/message/template?threadId=${threadId}`,
  );

  const cursorPosition = useRef<number | undefined>(0);
  const buildMessagePost = () => {
    return [`message/${threadId}`, currentMsg] as [string, BaseBB];
  };

  const newPostMutator = useBBMutation(buildMessagePost);

  return (
    <div className="mt-3">
      <div className="p-4 mb-4 border-2 border-red-500 text-red-600 bg-red-50">
        Warning: this topic has not been posted in for at least 14 days. Unless
        you're sure you want to reply, please consider starting a new topic.
      </div>

      <form className="space-y-4">
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
        <div>
          <textarea
            ref={textAreaRef}
            rows={15}
            className="w-full p-3 bg-default border border-default  resize-y focus:outline-none focus:ring-2 focus:ring-accented"
            onBlur={() =>
              (cursorPosition.current = textAreaRef?.current?.selectionStart)
            }
            onChange={(e) => {
              if (currentMsg) {
                currentMsg.currentMessage.unparsedText = e.target.value;
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => newPostMutator.mutate()}
          className="px-4 py-2 bg-accented border border-default  hover:bg-elevated"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default MessageEditor;
