import type React from "react";
import type { PollInfo } from "../../../types/forum";
import { useEffect } from "react";
import Widget from "../../common/widgets/widget.component";
import { useBreakpoints } from "../../common/layout/useBreakpoints";

const calculatePercent = (poll: PollInfo) => {
  const totalVotes = poll.votes;

  poll.answers.forEach((ans) => {
    const dec = ans.votes / totalVotes;
    const percent = dec * 100.0;
    ans.percentage = percent;
  });
};

const Poll: React.FC<{
  poll: PollInfo;
  updateResults: (poll: PollInfo) => void;
}> = ({ poll, updateResults }) => {
  useEffect(() => {
    calculatePercent(poll);
  }, [poll]);

  const [isXs, isSm] = useBreakpoints();

  return (
    <Widget className="p-5">
      <div className="mb-2">
        <b>Poll: {poll.pollQuestion}</b>
      </div>
      <div className="ms-2 mb-1">
        {poll.answers
          .filter(
            (ans) => ans.percentage !== undefined && ans.percentage !== null,
          )
          .map((ans) => (
            <BBFlex direction={isXs || isSm ? "col" : "row"}>
              <div className="md:w-sm lg:w-lg">
                {ans.seqno + 1}. {ans.choiceText}: {ans.votes}
              </div>
              <div>
                <div
                  className="mx-3 rounded-xs bg-[var(--text-color-dimmed)] h-[1rem] inline-block"
                  style={{ width: `${(ans.percentage * 2).toFixed(0)}px` }}
                ></div>
                &nbsp;{Math.round(ans.percentage).toFixed(0)}%
              </div>
            </BBFlex>
          ))}
      </div>
    </Widget>
  );
};

export default Poll;
