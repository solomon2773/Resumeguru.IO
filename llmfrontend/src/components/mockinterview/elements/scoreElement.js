import { Progress } from "flowbite-react";
import { Tooltip } from "flowbite-react";
import { QuestionMarkCircleIcon} from "@heroicons/react/24/outline";

const progressBarColor = (score) => {
    if (score >= 80){
        return "lime";
    } else if (score >= 60){
        return "yellow";
    } else {
        return "red";
    }
}

const ScoreElement = ({topicName, topicScore, topicToolTipContent}) => {
  return (
    <div className="w-full flex justify-center items-end bg-gray-50 ">
        <div className="table-cell  w-full">
            <div className="items-center justify-between text-xs">
                <div className="text-base text-xs flex">{topicName} {topicScore.toFixed(1) || 0} / 100
                    <Tooltip
                        content={topicToolTipContent}
                        animation="duration-1000"
                        className=" max-w-2xl bg-white text-black"
                        style="light"
                    >
                        <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 inline-block ml-1"  />
                    </Tooltip>
                </div>
                <Progress progress={topicScore || 1} color={progressBarColor(topicScore || 1)} />
            </div>
        </div>
    </div>
  )
}

export default ScoreElement;
