import type React from "react";
import type { PollInfo } from "../../../types/forum";

const PollResults: React.FC<{
  poll: PollInfo;
  updateResults: (poll: PollInfo) => void;
}> = ({ poll }) => {
  const pollAnswers = useMemo(() => {
    return poll.answers.filter((answer) => !!answer?.percentage);
  }, [poll]);

  const pollData = pollAnswers.map((answer) => {
    const totalVotes = poll.votes;
    const dec = answer.votes / totalVotes;
    const percent = dec * 100.0;
    return {
      seqno: answer.seqno,
      choiceText: answer.choiceText,
      votes: answer.votes,
      percentage: percent,
    };
  });

  return (
    <BBWidget className="p-5">
      <div className="mb-2">
        <b>Poll: {poll.pollQuestion}</b>
      </div>
      <div className="ms-2 mb-1">
        {pollData.map((answer) => (
          <BBFlex direction="col" className="md:flex-row">
            <div className="md:w-sm lg:w-lg">
              {answer.seqno + 1}. {answer.choiceText}: {answer.votes}
            </div>
            <div>
              <div
                className={`mx-3 rounded-xs bg-(--text-color-dimmed) h-4 inline-block w-[${~~(
                  answer.percentage * 2
                )}px]`}
                // style={{ width: `${(answer.percentage * 2).toFixed(0)}px` }}
              ></div>
              &nbsp;{Math.round(answer.percentage).toFixed(0)}%
            </div>
          </BBFlex>
        ))}
      </div>
    </BBWidget>
  );
};

export default PollResults;
