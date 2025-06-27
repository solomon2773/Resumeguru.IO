import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";

const MockInterviewPageScoreDetailV1 = () => {
    // const userDetail  = useSelector((state) => state.user.profile);
    const [grammarScore, setGrammarScore] = useState(0);
    const [topicScore, setTopicScore] = useState(0);
    const [vocabularyScore, setVocabularyScore] = useState(0);

    const [accuracyScore, setAccuracyScore] = useState(0);
    const [completenessScore, setCompletenessScore] = useState(0);
    const [fluencyScore, setFluencyScore] = useState(0);
    const [prosodyScore, setProsodyScore] = useState(0);

    const avScoreBarCutoffPoint = 60;
    const pronunciationAssessment = useSelector((state) => state.chat.pronunciationAssessment);


    const [scoreDetailSel, setScoreDetailSel] = useState('content');
    const [contentScore , setContentScore] = useState(0.1);
    const [pronunciationScore, setPronunciationScore] = useState(0.1);
    useEffect(() =>{
        if (pronunciationAssessment.contentAssessmentResult.vocabularyScore && pronunciationAssessment.contentAssessmentResult.grammarScore && pronunciationAssessment.contentAssessmentResult.topicScore){
            setContentScore(((pronunciationAssessment.contentAssessmentResult.vocabularyScore + pronunciationAssessment.contentAssessmentResult.grammarScore + pronunciationAssessment.contentAssessmentResult.topicScore) / 3).toFixed(1));
            setGrammarScore(pronunciationAssessment.contentAssessmentResult.grammarScore);
            setTopicScore(pronunciationAssessment.contentAssessmentResult.topicScore);
            setVocabularyScore(pronunciationAssessment.contentAssessmentResult.vocabularyScore);


        }
        if (pronunciationAssessment.pronunciationAssessmentResult.AccuracyScore && pronunciationAssessment.pronunciationAssessmentResult.CompletenessScore && pronunciationAssessment.pronunciationAssessmentResult.FluencyScore && pronunciationAssessment.pronunciationAssessmentResult.ProsodyScore){
            setPronunciationScore(((pronunciationAssessment.pronunciationAssessmentResult.AccuracyScore + pronunciationAssessment.pronunciationAssessmentResult.CompletenessScore + pronunciationAssessment.pronunciationAssessmentResult.FluencyScore + pronunciationAssessment.pronunciationAssessmentResult.ProsodyScore) / 4).toFixed(1));
            setAccuracyScore(pronunciationAssessment.pronunciationAssessmentResult.AccuracyScore);
            setCompletenessScore(pronunciationAssessment.pronunciationAssessmentResult.CompletenessScore);
            setFluencyScore(pronunciationAssessment.pronunciationAssessmentResult.FluencyScore);
            setProsodyScore(pronunciationAssessment.pronunciationAssessmentResult.ProsodyScore);
        }
    },[pronunciationAssessment.contentAssessmentResult, pronunciationAssessment.pronunciationAssessmentResult]);

    const scoreDetailTab = (sel) => {
        if (sel === "content") {
            setScoreDetailSel("content");
        } else if (sel === "pronunciation") {
            setScoreDetailSel("pronunciation");
        }
    }

    return (
        <>
            {/*total score cards*/}
            <div className="flex justify-start items-center gap-6">
                {/*Content Score Card -->*/}
                <div className="p-1 bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.60)] rounded-[15px] flex flex-col justify-start items-center">
                    <div className="w-full  text-center bg-gradient-to-r from-[rgba(0,150,149,0.64)] to-[rgba(30,0,177,0.8)] bg-clip-text text-transparent text-sm sm:text-xl font-bold break-words">
                        {contentScore}%
                    </div>
                    <div className="w-full  text-center bg-gradient-to-r from-[rgba(0,150,149,0.64)] to-[rgba(30,0,177,0.8)] bg-clip-text text-transparent text-sm sm:text-l font-bold break-words">
                        Content Score
                    </div>
                </div>
                {/*<!-- Pronunciation Score Card -->*/}
                <div className="p-1 bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.60)] rounded-[15px] flex flex-col justify-start items-center">
                    <div className="w-full  text-center bg-gradient-to-r from-[rgba(0,150,149,0.64)] to-[rgba(30,0,177,0.8)] bg-clip-text text-transparent text-sm sm:text-l font-bold break-words">
                        {pronunciationScore}%
                    </div>
                    <div className="w-full  text-center bg-gradient-to-r from-[rgba(0,150,149,0.64)] to-[rgba(30,0,177,0.8)] bg-clip-text text-transparent text-sm sm:text-l font-bold break-words">
                        Pronunciation Score
                    </div>
                </div>
            </div>

            {/*detail scores*/}
            <div className="w-full h-full p-2 bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.60)] rounded-[30px] hidden sm:inline-flex flex-col justify-start items-center gap-2 ">
                <div className="self-stretch justify-start items-center ">
                    <div className="text-center bg-gradient-to-r from-[rgba(0,150,149,1)] to-[rgba(30,0,177,1)] bg-clip-text text-transparent text-lg font-bold">
                        Score Detail
                    </div>


                    <div className="w-full overflow-hidden flex justify-center items-center">
                        {/* Content Button */}
                        <div className={
                            scoreDetailSel === "content" ?
                                "w-1/2 flex justify-center items-center" :
                                "w-1/2 flex justify-center items-center"
                        }>
                            <div
                                className={
                                    scoreDetailSel === "content" ?
                                        "cursor-pointer text-l text-center text-[rgba(3,42,245,0.80)]  font-bold tracking-[0.64px] break-words"
                                        : "cursor-pointer text-l text-center text-[rgba(0,0,0,0.40)] font-normal tracking-[0.64px] break-words"
                                }
                                onClick={() => scoreDetailTab("content")}
                            >
                                Content
                            </div>
                        </div>

                        {/* Pronunciation Button */}
                        <div className={
                            scoreDetailSel !== "pronunciation" ?
                                "w-1/2 flex justify-center items-center"
                                : "w-1/2 flex justify-center items-center"}>
                            <div
                                className={
                                    scoreDetailSel === "pronunciation" ?
                                        "cursor-pointer text-l text-center text-[rgba(3,42,245,0.80)]  font-bold tracking-[0.64px] break-words"
                                        : "cursor-pointer text-l text-center text-[rgba(0,0,0,0.40)]  font-normal tracking-[0.64px] break-words"
                                }
                                onClick={() => scoreDetailTab("pronunciation")}
                            >
                                Pronunciation
                            </div>
                        </div>
                    </div>

                </div>
                {scoreDetailSel === "content" ? (
                    <>
                        <div className="h-auto flex-col justify-start items-center gap-2.5 flex">
                            <div className="w-full h-full flex flex-col justify-center items-start gap-[10px]">
                                {/* Grammar Score Row */}
                                <div className="w-full flex justify-start items-center">
                                    {/* Grammar Score Label */}
                                    <div className="flex-1 text-[#1F2937] text-[16px] font-['Gotham Pro'] font-bold leading-[24px] tracking-[0.08px] break-words">
                                        Grammar Score
                                    </div>
                                    {/* Score Percentage */}
                                    <div className="text-[#1F2937] text-[14px] font-['Inter'] font-medium leading-[20px] tracking-[0.07px] break-words">
                                        {grammarScore}%
                                    </div>
                                </div>

                                {/* Grammar Score Progress Bar */}

                                <div className="w-full flex justify-start items-center gap-[10px]">
                                    <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                        <div
                                            className={`h-[10px] rounded-full ${
                                                grammarScore <= avScoreBarCutoffPoint
                                                    ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                    : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                            }`}
                                            style={{
                                                width: `${grammarScore}%`,
                                                backgroundSize: "100% 100%",
                                                backgroundClip: "content-box",
                                            }}
                                        ></div>
                                    </div>
                                </div>


                            </div>

                            <div className="self-stretch text-black/60 text-xs font-normal font-['Gotham Pro'] leading-normal tracking-tight">Proficiency of the correctness in using grammar. Grammatical errors are jointly evaluated by incorporating the level of proper grammar usage with the lexical.</div>
                        </div>
                        <div className="h-auto flex-col justify-start items-center gap-2.5 flex">
                            <div className="self-stretch h-11 flex-col justify-center items-start gap-2.5 flex">
                                {/* Topic Score Row */}
                                <div className="w-full flex justify-start items-center">
                                    {/* Topic Score Label */}
                                    <div className="flex-1 text-[#1F2937] text-[16px] font-['Gotham Pro'] font-bold leading-[24px] tracking-[0.08px] break-words">
                                        Topic Score
                                    </div>
                                    {/* Score Percentage */}
                                    <div className="text-[#1F2937] text-[14px] font-['Inter'] font-medium leading-[20px] tracking-[0.07px] break-words">
                                        {topicScore}%
                                    </div>
                                </div>
                                {/* Topic Score Progress Bar */}
                                <div className="w-full flex justify-start items-center gap-[10px]">
                                    <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                        <div
                                            className={`h-[10px] rounded-full ${
                                                topicScore <= avScoreBarCutoffPoint
                                                    ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                    : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                            }`}
                                            style={{
                                                width: `${topicScore}%`,
                                                backgroundSize: "100% 100%",
                                                backgroundClip: "content-box",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch text-black/60 text-xs font-normal font-['Gotham Pro'] leading-normal tracking-tight">Proficiency in lexical usage, which is evaluated by speaker's effective usage of words, on how appropriate is the word used with its context to express an idea.</div>
                        </div>
                        <div className="h-auto flex-col justify-start items-center gap-2.5 flex">
                            <div className="self-stretch h-11 flex-col justify-center items-start gap-2.5 flex">
                                {/* Vocabulary Score Row */}
                                <div className="w-full flex justify-start items-center">
                                    {/* Grammar Score Label */}
                                    <div className="flex-1 text-[#1F2937] text-[16px] font-['Gotham Pro'] font-bold leading-[24px] tracking-[0.08px] break-words">
                                        Vocabulary Score
                                    </div>
                                    {/* Score Percentage */}
                                    <div className="text-[#1F2937] text-[14px] font-['Inter'] font-medium leading-[20px] tracking-[0.07px] break-words">
                                        {vocabularyScore}%
                                    </div>
                                </div>
                                {/* Vocabulary Score Progress Bar */}
                                <div className="w-full flex justify-start items-center gap-[10px]">
                                    <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                        <div
                                            className={`h-[10px] rounded-full ${
                                                vocabularyScore <= avScoreBarCutoffPoint
                                                    ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                    : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                            }`}
                                            style={{
                                                width: `${vocabularyScore}%`,
                                                backgroundSize: "100% 100%",
                                                backgroundClip: "content-box",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch text-black/60 text-xs font-normal font-['Gotham Pro'] leading-normal tracking-tight">Proficiency in lexical usage, which is evaluated by speaker's effective usage of words, on how appropriate is the word used with its context to express an idea.</div>
                        </div>
                    </>
                ):(
                    <>
                        <div className="h-auto flex-col justify-start items-center gap-2.5 flex">
                            <div className="w-full h-full flex flex-col justify-center items-start gap-[10px]">
                                {/* Accuracy Score Row */}
                                <div className="w-full flex justify-start items-center">
                                    {/* Accuracy Score Label */}
                                    <div className="flex-1 text-[#1F2937] text-[16px] font-['Gotham Pro'] font-bold leading-[24px] tracking-[0.08px] break-words">
                                        Accuracy Score
                                    </div>
                                    {/* Score Percentage */}
                                    <div className="text-[#1F2937] text-[14px] font-['Inter'] font-medium leading-[20px] tracking-[0.07px] break-words">
                                        {accuracyScore}%
                                    </div>
                                </div>

                                {/* Accuracy Score Progress Bar */}

                                <div className="w-full flex justify-start items-center gap-[10px]">
                                    <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                        <div
                                            className={`h-[10px] rounded-full ${
                                                accuracyScore <= avScoreBarCutoffPoint
                                                    ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                    : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                            }`}
                                            style={{
                                                width: `${accuracyScore}%`,
                                                backgroundSize: "100% 100%",
                                                backgroundClip: "content-box",
                                            }}
                                        ></div>
                                    </div>
                                </div>


                            </div>

                            <div className="self-stretch text-black/60 text-xs font-normal font-['Gotham Pro'] leading-normal tracking-tight">Proficiency of the correctness in using grammar. Grammatical errors are jointly evaluated by incorporating the level of proper grammar usage with the lexical.</div>
                        </div>
                        <div className="h-auto flex-col justify-start items-center gap-2.5 flex">
                            <div className="self-stretch h-11 flex-col justify-center items-start gap-2.5 flex">
                                {/* Completeness Score Row */}
                                <div className="w-full flex justify-start items-center">
                                    {/* Completeness Score Label */}
                                    <div className="flex-1 text-[#1F2937] text-[16px] font-['Gotham Pro'] font-bold leading-[24px] tracking-[0.08px] break-words">
                                        Completeness Score
                                    </div>
                                    {/* Completeness Percentage */}
                                    <div className="text-[#1F2937] text-[14px] font-['Inter'] font-medium leading-[20px] tracking-[0.07px] break-words">
                                        {completenessScore}%
                                    </div>
                                </div>
                                {/* Completeness Score Progress Bar */}
                                <div className="w-full flex justify-start items-center gap-[10px]">
                                    <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                        <div
                                            className={`h-[10px] rounded-full ${
                                                completenessScore <= avScoreBarCutoffPoint
                                                    ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                    : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                            }`}
                                            style={{
                                                width: `${completenessScore}%`,
                                                backgroundSize: "100% 100%",
                                                backgroundClip: "content-box",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch text-black/60 text-xs font-normal font-['Gotham Pro'] leading-normal tracking-tight">Proficiency in lexical usage, which is evaluated by speaker's effective usage of words, on how appropriate is the word used with its context to express an idea.</div>
                        </div>
                        <div className="h-auto flex-col justify-start items-center gap-2.5 flex">
                            <div className="self-stretch h-11 flex-col justify-center items-start gap-2.5 flex">
                                {/* Fluency Score Row */}
                                <div className="w-full flex justify-start items-center">
                                    {/* Fluency Score Label */}
                                    <div className="flex-1 text-[#1F2937] text-[16px] font-['Gotham Pro'] font-bold leading-[24px] tracking-[0.08px] break-words">
                                        Fluency Score
                                    </div>
                                    {/* Fluency Percentage */}
                                    <div className="text-[#1F2937] text-[14px] font-['Inter'] font-medium leading-[20px] tracking-[0.07px] break-words">
                                        {fluencyScore}%
                                    </div>
                                </div>
                                {/* Fluency Score Progress Bar */}
                                <div className="w-full flex justify-start items-center gap-[10px]">
                                    <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                        <div
                                            className={`h-[10px] rounded-full ${
                                                fluencyScore <= avScoreBarCutoffPoint
                                                    ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                    : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                            }`}
                                            style={{
                                                width: `${fluencyScore}%`,
                                                backgroundSize: "100% 100%",
                                                backgroundClip: "content-box",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch text-black/60 text-xs font-normal font-['Gotham Pro'] leading-normal tracking-tight">Proficiency in lexical usage, which is evaluated by speaker's effective usage of words, on how appropriate is the word used with its context to express an idea.</div>
                        </div>
                        <div className="h-auto flex-col justify-start items-center gap-2.5 flex">
                            <div className="w-full h-full flex flex-col justify-center items-start gap-[10px]">
                                {/* Prosody Score Row */}
                                <div className="w-full flex justify-start items-center">
                                    {/* Prosody Score Label */}
                                    <div className="flex-1 text-[#1F2937] text-[16px] font-['Gotham Pro'] font-bold leading-[24px] tracking-[0.08px] break-words">
                                        Prosody Score
                                    </div>
                                    {/* Score Percentage */}
                                    <div className="text-[#1F2937] text-[14px] font-['Inter'] font-medium leading-[20px] tracking-[0.07px] break-words">
                                        {prosodyScore}%
                                    </div>
                                </div>

                                {/* Prosody Score Progress Bar */}

                                <div className="w-full flex justify-start items-center gap-[10px]">
                                    <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                        <div
                                            className={`h-[10px] rounded-full ${
                                                prosodyScore <= avScoreBarCutoffPoint
                                                    ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                    : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                            }`}
                                            style={{
                                                width: `${prosodyScore}%`,
                                                backgroundSize: "100% 100%",
                                                backgroundClip: "content-box",
                                            }}
                                        ></div>
                                    </div>
                                </div>


                            </div>

                            <div className="self-stretch text-black/60 text-xs font-normal font-['Gotham Pro'] leading-normal tracking-tight">Proficiency of the correctness in using grammar. Grammatical errors are jointly evaluated by incorporating the level of proper grammar usage with the lexical.</div>
                        </div>
                    </>
                )}

            </div>

        </>

  )
}

export default MockInterviewPageScoreDetailV1;
