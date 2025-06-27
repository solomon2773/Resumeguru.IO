import React, { useEffect, useState} from 'react'
// import { Tooltip } from "flowbite-react";
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
// import ScoreElement from "../../../../components/chats/scoreElement";
import {convertToLocalTime} from "../../../../utils/timeConvert";
import {useSelector} from "react-redux";
// import Image from "next/image";
import dynamic from 'next/dynamic';
import MessageModal from './messageModal'
// import { ChevronDoubleDownIcon, ChevronDoubleRightIcon, PlusIcon } from '@heroicons/react/24/solid'
// import {QuestionMarkCircleIcon} from '@heroicons/react/24/outline'


import {
    getInterviewSessionConversations, mongodbUpdateSessionName
} from "../../../../helpers/mongodb/pages/mockInterview/sttTTS";

const mockInterviewDetails = ({ sessionId })=> {
    const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
    const user = useSelector(state => state.user.profile)
    const [interviewConversations, setInterviewConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSessionNameEditing, setIsSessionNameEditing] = useState(false);
    const [sessionName, setSessionName] = useState("");
    const [conversationPairs, setConversationPairs] = useState(null);
    const [questionDetailScoreExpand, setQuestionDetailScoreExpand] = useState([]);
    const [questionAnswerStatus, setQuestionAnswerStatus] = useState([]);
    const [chartOptions, setChartOptions] = useState(null);
    // const [contentChartOptions, setContentChartOptions] = useState(null);
    // const [pronChartOptions, setPronChartOptions] = useState(null);


    const [openMessageModal, setOpenMessageModal] = useState(false);
    const [messageType, setMessageType] = useState("Question");
    const [message, setMessage] = useState("")


    const [overAllScores, setOverAllScores] = useState({
        GrammarScore:0,
        TopicScore:0,
        VocabularyScore:0,
        AccuracyScore:0,
        CompletenessScore:0,
        FluencyScore:0,
        PronScore:0,
        ProsodyScore:0,
        OverAllPronScore:0,
        OverAllContentScore:0
    })


    useEffect(() => {
        async function getConversations() {
            setLoading(true);
            if (user && user.userId) {
                try {
                    const response = await fetch('/api/mongodb/pages/mockInterview/sttTTS', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+process.env.API_AUTH_BEARER_TOKEN,
                        },
                        body: JSON.stringify({
                            action: "getConversations",
                            userId: user.userId,
                            sessionId: sessionId[0]
                        }),
                    });
                    const data = await response.json();
                    if (!data.success) {

                        throw new Error(`HTTP error! status: ${data.status}`);
                    }

                    if (data && data.result.length > 0) {
                         setInterviewConversations(data.result);
                    }
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }

            }
        }
        if (user && user.userId && sessionId) {
            getConversations();
        }
    },[user, sessionId]);


    useEffect(() => {
        if (interviewConversations.length > 0 && !sessionName) {
            const tSessionName =  interviewConversations[0].sessionName ? interviewConversations[0].sessionName : convertToLocalTime(interviewConversations[0].createdAt);
            setSessionName(tSessionName);
        }

        if (interviewConversations.length > 0 ) {
            const feedbackPairs = [];
            if (interviewConversations.length > 0) {
                for (let i = 0; i < (interviewConversations.length - 1); i++) {
                    if (interviewConversations[i+1].type == "tts") {
                        continue;
                    }

                    if (interviewConversations[i].type == "tts") {
                        feedbackPairs.push([interviewConversations[i], interviewConversations[i+1]]);
                        i++;
                    }
                }

                if (feedbackPairs.length > 0 ) {

                    setConversationPairs(feedbackPairs);
                    setQuestionAnswerStatus(feedbackPairs.map((_, index) => ({
                        questionAndAnswerExpanded: index === 0,
                        questionDetail: false,
                        yourReplyDetail: false,
                        recommendedAnswerDetail: false,
                        assessmentTab: "content",
                    })))
                    // setQuestionDetailScoreExpand(feedbackPairs.map(() => ({
                    //     contentAssessmentExpanded: false,
                    //     pronunciationAssessmentExpanded: false,
                    // })));
                    let lGrammarScore = 0;
                    let lTopicScore = 0;
                    let lVocabularyScore = 0;
                    let lAccuracyScore = 0;
                    let lCompletenessScore = 0;
                    let lFluencyScore = 0;
                    let lPronScore = 0;
                    let lProsodyScore = 0;
                    let contIterationCount = 0;
                    let pronIterationCount = 0;
                    feedbackPairs.forEach (function(conRow, key) {
                        const userReplyContentArray = conRow[1].sttResult.contentAssessmentResult
                                                && Array.isArray(conRow[1].sttResult.contentAssessmentResult)
                                                && conRow[1].sttResult.contentAssessmentResult.length > 0
                                                ? conRow[1].sttResult.contentAssessmentResult
                                                : [];

                        const userReplyPronArray = conRow[1].sttResult.pronunciationAssessmentObjectResult
                                                && Array.isArray(conRow[1].sttResult.pronunciationAssessmentObjectResult)
                                                && conRow[1].sttResult.pronunciationAssessmentObjectResult.length > 0
                                                ? conRow[1].sttResult.pronunciationAssessmentObjectResult
                                                : [];

                        if ( userReplyContentArray && userReplyContentArray.length > 0) {
                            userReplyContentArray.forEach (function (inConRow, key) {
                                contIterationCount++;
                                const userReplyContent = inConRow.privPronJson && inConRow.privPronJson.ContentAssessment ? inConRow.privPronJson.ContentAssessment : {};
                                lGrammarScore += userReplyContent.GrammarScore ? userReplyContent.GrammarScore : 0;
                                lTopicScore += userReplyContent.TopicScore ? userReplyContent.TopicScore:0;
                                lVocabularyScore += userReplyContent.VocabularyScore ? userReplyContent.VocabularyScore : 0;
                            })
                        }

                        if ( userReplyPronArray && userReplyPronArray.length > 0 ) {
                            userReplyPronArray.forEach (function (inPronRow, key) {
                                pronIterationCount++;
                                const userReplyPron = inPronRow.privPronJson && inPronRow.privPronJson.PronunciationAssessment ? inPronRow.privPronJson.PronunciationAssessment : {};
                                lAccuracyScore += userReplyPron.AccuracyScore ? userReplyPron.AccuracyScore: 0;
                                lCompletenessScore += userReplyPron.CompletenessScore ? userReplyPron.CompletenessScore: 0;
                                lFluencyScore += userReplyPron.FluencyScore ? userReplyPron.FluencyScore: 0;
                                lPronScore += userReplyPron.PronScore ? userReplyPron.PronScore: 0;
                                lProsodyScore += userReplyPron.ProsodyScore ? userReplyPron.ProsodyScore:0;
                            })
                        }
                    })

                    setOverAllScores((prev) => ({
                        ...prev,
                        GrammarScore:lGrammarScore > 0 ? Number(lGrammarScore/contIterationCount).toFixed(2) : 0,
                        TopicScore: lTopicScore > 0 ? Number(lTopicScore/contIterationCount).toFixed(2) : 0,
                        VocabularyScore: lVocabularyScore > 0 ?Number(lVocabularyScore/contIterationCount).toFixed(2) : 0,
                        AccuracyScore: lAccuracyScore > 0 ? Number(lAccuracyScore/pronIterationCount).toFixed(2) : 0,
                        CompletenessScore: lCompletenessScore > 0 ? Number(lCompletenessScore/pronIterationCount).toFixed(2) : 0,
                        FluencyScore: lFluencyScore > 0 ? Number(lFluencyScore/pronIterationCount).toFixed(2) : 0,
                        PronScore: lPronScore > 0 ? Number(lPronScore/pronIterationCount).toFixed(2) : 0,
                        ProsodyScore: lProsodyScore > 0 ?Number(lProsodyScore/pronIterationCount).toFixed(2) : 0,
                        OverAllContentScore: lGrammarScore > 0 ?Number((lGrammarScore + lTopicScore + lVocabularyScore)/(3*contIterationCount)).toFixed(2) : 0,
                        OverAllPronScore: lAccuracyScore > 0 ? Number((lAccuracyScore + lCompletenessScore + lFluencyScore + lPronScore + lProsodyScore)/(5*pronIterationCount)).toFixed(2) : 0,
                    }));
                }
            }
        }

    }, [interviewConversations]);

    const gOverAllPronScore = overAllScores.OverAllPronScore ? Number(overAllScores.OverAllPronScore) : 0;
    const gOverAllContentScore = overAllScores.OverAllContentScore ? Number(overAllScores.OverAllContentScore) : 0;
    const gTotalScore = ((gOverAllPronScore + gOverAllContentScore)/2).toFixed(2);

    const avScoreBarCutoffPoint = 60;
    const [totalScoreDetailSel, setTotalScoreDetailSel] = useState('content');
    const avGrammarScore =  Number(overAllScores.GrammarScore);
    const avTopicScore =  Number(overAllScores.TopicScore);
    const avVocabularyScore =  Number(overAllScores.VocabularyScore);
    const gContTotalScore = ((avGrammarScore + avTopicScore + avVocabularyScore)/3).toFixed(2);

    const avAccuracyScore =  Number(overAllScores.AccuracyScore);
    const avCompletenessScore =  Number(overAllScores.CompletenessScore);
    const avFluencyScore =  Number(overAllScores.FluencyScore);
    const avPronScore =  Number(overAllScores.PronScore);
    const avProsodyScore =  Number(overAllScores.ProsodyScore);
    const gPronTotalScore = Number(overAllScores.PronScore);


    useEffect(() => {



        setChartOptions({
            series: [gTotalScore], // The data series for the chart
            options: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'horizontal',
                        shadeIntensity: 0.5,
                        gradientToColors: ['rgba(0, 150, 149, 0.6)','rgba(30, 0, 177,1)'],
                        // inverseColors: true,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0,  100]
                    }
                },
                chart: {

                    offsetX: 0,
                    type: "radialBar",
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -90,
                        endAngle: 90,
                        track: {
                            background: "rgba(3, 42, 245, 0.11)",
                            strokeWidth: '97%',
                            margin: 5, // margin is in pixels

                        },
                        dataLabels: {
                            name: {
                                show: false,
                            },
                            value: {
                                fontSize: '42px',
                                color: "rgba(0, 150, 149, 0.6)",
                                fontWeight: 700,
                                offsetY: 0,
                                formatter: (val) => `${val}%`,
                            },
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shade: 'light',
                                    type: 'horizontal',
                                    shadeIntensity: 0,
                                    gradientToColors: ['rgba(30, 0, 177,1)','rgba(0, 150, 149, 0.6)'],
                                    inverseColors: true,
                                    opacityFrom: 1,
                                    opacityTo: 1,
                                    stops: [0,  100]
                                }
                            },

                        },


                    },

                },



            },
        });






    }, [overAllScores]);

    // const [contentDetails, setContentDetails] = useState(false);
    // const [pronunciationDetails, setPronunciationDetails] = useState(false);
    const userImage = {
        imageUrl:
            user && user.profileImage && user.profileImage.bucket ? process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/" + user.profileImage.bucket+"/"+user.profileImage.key : "/images/author-placeholder.jpg",
        imageAlt: user && user.firstName && user.lastName ?  user.firstName+" "+user.lastName+" thumbnails" : "",
    }

    const handleSessionNameEdit = () => {
        setIsSessionNameEditing(true);
    };

    const updateSessionName = async () => {
        if (user && user.userId) {
            await mongodbUpdateSessionName(user.userId, sessionId[0], sessionName).then((res) => {
                if (process.env.DEV) {
                    console.log("Update response ===> ", res);
                }
            }).catch((err) => {
                setError(true)
                if (process.env.DEV) {
                    console.log(err);
                }
                setLoading(false);
            });
        }
    }

    const handleSessionNameBlur = async () => {
        await updateSessionName();
        setIsSessionNameEditing(false);
    };

    const handleSessionNameChange = (e) => {
        setSessionName(e.target.value);
    };



    return (
        <UserDashboardCommonLayout
            parent="home"
            title="Mock Interview Report - Resume Guru"
            meta_title="Mock Interview Report - Resume Guru"
            meta_desc="Mock Interview Report - Resume Guru"
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/dashboard/mockInterview/"+sessionId[0]}
        >

            {

                loading ? (
                    <div className="flex justify-center items-center h-96">
                        <svg aria-hidden="true"
                             className="w-20 h-20 mx-auto animate-spin text-gray-200 dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                    </div>
                ):(
                    interviewConversations.length <= 0 ? (
                        <div className="flex gap-4">
                            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden p-4 h-20"> No conversations found </div>
                        </div>
                    ) : (

                    <div className="h-auto flex flex-col gap-8 lg:px-6 lg:py-8 px-2">

                <div className="w-full lg:gap-8 gap-0 flex flex-col justify-start items-start inline-flex">
                    <div className=" flex-col justify-start items-center gap-8 flex">
                        <div className="self-stretch  flex-col justify-start items-center gap-10 flex">
                            {/*<div className="self-stretch h-14 text-indigo-800 text-6xl font-normal font-['Gotham Pro']">Dashboard</div>*/}
                            <div className="self-stretch justify-center items-center gap-2 gap-5 inline-flex">
                                <div className="lg:w-36 lg:h-10 w-auto h-auto text-slate-950/80 lg:text-4xl text-xl font-bold font-['Gotham Pro']">Session</div>
                                <div className="justify-center items-center flex">
                                    {isSessionNameEditing ? (
                                        <div className="w-auto items-center text-center text-black lg:text-2xl text-sm font-normal font-['Gotham Pro']">
                                        <input
                                            type="text"
                                            value={sessionName}
                                            onChange={handleSessionNameChange}
                                            onBlur={handleSessionNameBlur}
                                            autoFocus
                                            className="border-b border-blue-500 focus:outline-none"
                                        />
                                        </div>
                                    ) : (
                                        <div className="w-auto items-center text-center text-black lg:text-2xl text-sm font-normal font-['Gotham Pro']">{sessionName}</div>

                                    )}
                                    <div className="w-10 p-2 items-center relative" >
                                        <svg
                                            onClick={handleSessionNameEdit}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="self-stretch justify-center items-center lg:inline-flex">
                        <div className="w-auto lg:px-2.5 px-1 justify-start items-end gap-4 lg:flex">
                            <div className="lg:grow shrink basis-0 flex-col justify-start items-center gap-2 lg:inline-flex">
                                <div className=" self-stretch bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.6)] rounded-3xl shadow border border-white flex-col justify-between items-center flex">
                                    <div className="self-stretch   rounded-full flex-col justify-end items-center flex">

                                          <ApexCharts
                                                                    width={500}
                                                                    options={chartOptions.options} series={chartOptions.series} type="radialBar"
                                                        className="cursor-pointer "
                                                      />

                                    </div>
                                    <div className=" text-center text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,150,149,0.6)] to-[rgba(30,0,177,0.6)] text-3xl font-bold font-['Gotham Pro'] leading-none">
                                        Overall Score
                                    </div>
                                </div>
                                <div className="w-full p-2 self-stretch justify-center items-center inline-flex gap-10">
                                    <div className="lg:w-1/2 w-auto min-w-[150px] h-full lg:pt-5 lg:pb-2 lg:px-2 p-1 bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.6)] lg:rounded-[50px] rounded-[10px] overflow-hidden border border-white flex flex-col justify-start items-center lg:gap-[25px] gap-1">
                                        <div className="text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,150,149,0.64)] to-[rgba(30,0,177,0.8)] lg:text-3xl text-sm font-['Gotham Pro'] lg:leading-10 leading-0">
                                            {gContTotalScore}%
                                        </div>
                                        <div className="text-center text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,150,149,0.6)] to-[rgba(30,0,177,0.6)] lg:text-xl text-sm font-bold font-['Gotham Pro'] leading-tight">
                                            Content <br /> Score
                                        </div>

                                    </div>
                                    <div className="lg:w-1/2 w-auto min-w-[150px] h-full lg:pt-5 lg:pb-2 lg:px-2 p-1 bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.6)] lg:rounded-[50px] rounded-[10px] overflow-hidden border border-white flex flex-col justify-start items-center lg:gap-[25px] gap-1">
                                        <div className="text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,150,149,0.64)] to-[rgba(30,0,177,0.8)] lg:text-3xl text-sm font-['Gotham Pro'] lg:leading-10 leading-0">
                                            {gPronTotalScore}%
                                        </div>
                                        <div className="text-center text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,150,149,0.6)] to-[rgba(30,0,177,0.6)] lg:text-xl text-sm font-bold font-['Gotham Pro'] leading-tight">
                                            Pronunciation <br /> Score
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-auto lg:w-1/2 lg:px-2.5 lg:pt-3.5 bg-white rounded-3xl shadow flex-col justify-start items-center gap-4 inline-flex">
                            <div className="self-stretch justify-start items-center ">
                                <div className="w-full text-center text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,150,149,0.6)] to-[rgba(30,0,177,0.6)] text-2xl p-3 font-['Gotham Pro'] font-bold break-words">
                                    Score Details
                                </div>

                                <div className="w-full h-full shadow-[0px_4px_4px_rgba(3,42,245,0.6)] bg-[rgba(3,42,245,0.11)] rounded-[60px] overflow-hidden flex justify-center items-center">
                                    {/* Content Button */}
                                    <div className={
                                        totalScoreDetailSel === "content" ?
                                            "w-1/2 py-[8px] bg-gradient-to-b from-[rgba(0,150,149,0.8)] to-[rgba(3,42,245,0.48)] flex justify-center items-center" :
                                            "w-1/2 py-[8px] flex justify-center items-center"
                                    }>
                                        <div
                                            className={
                                                totalScoreDetailSel === "content" ?
                                                    "cursor-pointer text-center text-white text-l font-['Gotham Pro'] font-normal leading-[30px] break-words"
                                                    : "cursor-pointer text-center text-[rgba(0,150,149,0.6)] text-l font-['Gotham Pro'] font-normal leading-[30px] break-words"
                                                    }
                                            onClick={() => setTotalScoreDetailSel("content")}
                                        >
                                            Content
                                        </div>
                                    </div>

                                    {/* Pronunciation Button */}
                                    <div className={
                                        totalScoreDetailSel !== "pronunciation" ?
                                        "w-1/2 py-[8px] flex justify-center items-center"
                                    : "w-1/2 py-[8px] bg-gradient-to-b from-[rgba(0,150,149,0.8)] to-[rgba(3,42,245,0.48)] flex justify-center items-center"}>
                                        <div
                                            className={
                                                totalScoreDetailSel !== "pronunciation" ?
                                                "cursor-pointer text-center text-[rgba(0,150,149,0.6)] text-l font-['Gotham Pro'] font-normal leading-[30px] break-words"
                                                    :"cursor-pointer text-center text-white text-l font-['Gotham Pro'] font-normal leading-[30px] break-words"
                                            }
                                            onClick={() => setTotalScoreDetailSel("pronunciation")}
                                        >
                                            Pronunciation
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {totalScoreDetailSel === "content" ? (
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
                                                    {avGrammarScore}%
                                                </div>
                                            </div>

                                            {/* Grammar Score Progress Bar */}

                                            <div className="w-full flex justify-start items-center gap-[10px]">
                                                <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                    <div
                                                        className={`h-[10px] rounded-full ${
                                                            avGrammarScore <= avScoreBarCutoffPoint
                                                                ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                        }`}
                                                        style={{
                                                            width: `${avGrammarScore}%`,
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
                                                    {avTopicScore}%
                                                </div>
                                            </div>
                                            {/* Topic Score Progress Bar */}
                                            <div className="w-full flex justify-start items-center gap-[10px]">
                                                <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                    <div
                                                        className={`h-[10px] rounded-full ${
                                                            avTopicScore <= avScoreBarCutoffPoint
                                                                ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                        }`}
                                                        style={{
                                                            width: `${avTopicScore}%`,
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
                                                    {avVocabularyScore}%
                                                </div>
                                            </div>
                                            {/* Vocabulary Score Progress Bar */}
                                            <div className="w-full flex justify-start items-center gap-[10px]">
                                                <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                    <div
                                                        className={`h-[10px] rounded-full ${
                                                            avVocabularyScore <= avScoreBarCutoffPoint
                                                                ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                        }`}
                                                        style={{
                                                            width: `${avVocabularyScore}%`,
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
                                                    {avAccuracyScore}%
                                                </div>
                                            </div>

                                            {/* Accuracy Score Progress Bar */}

                                            <div className="w-full flex justify-start items-center gap-[10px]">
                                                <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                    <div
                                                        className={`h-[10px] rounded-full ${
                                                            avAccuracyScore <= avScoreBarCutoffPoint
                                                                ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                        }`}
                                                        style={{
                                                            width: `${avAccuracyScore}%`,
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
                                                    {avCompletenessScore}%
                                                </div>
                                            </div>
                                            {/* Completeness Score Progress Bar */}
                                            <div className="w-full flex justify-start items-center gap-[10px]">
                                                <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                    <div
                                                        className={`h-[10px] rounded-full ${
                                                            avCompletenessScore <= avScoreBarCutoffPoint
                                                                ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                        }`}
                                                        style={{
                                                            width: `${avCompletenessScore}%`,
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
                                                    {avFluencyScore}%
                                                </div>
                                            </div>
                                            {/* Fluency Score Progress Bar */}
                                            <div className="w-full flex justify-start items-center gap-[10px]">
                                                <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                    <div
                                                        className={`h-[10px] rounded-full ${
                                                            avFluencyScore <= avScoreBarCutoffPoint
                                                                ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                        }`}
                                                        style={{
                                                            width: `${avFluencyScore}%`,
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
                                                    {avProsodyScore}%
                                                </div>
                                            </div>

                                            {/* Prosody Score Progress Bar */}

                                            <div className="w-full flex justify-start items-center gap-[10px]">
                                                <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                    <div
                                                        className={`h-[10px] rounded-full ${
                                                            avProsodyScore <= avScoreBarCutoffPoint
                                                                ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                        }`}
                                                        style={{
                                                            width: `${avProsodyScore}%`,
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
                    </div>
                </div>

                {/*<!-- Question List Section -->*/}

                <div className="flex flex-col gap-6">
                    {
                        conversationPairs && conversationPairs.length > 0 ? (
                            conversationPairs.map ( (conRow, index) => {
                                const userReplyContentArray = conRow[1].sttResult.contentAssessmentResult
                                && Array.isArray(conRow[1].sttResult.contentAssessmentResult)
                                && conRow[1].sttResult.contentAssessmentResult.length > 0
                                    ? conRow[1].sttResult.contentAssessmentResult
                                    : [];

                                const userReplyPronArray = conRow[1].sttResult.pronunciationAssessmentObjectResult
                                && Array.isArray(conRow[1].sttResult.pronunciationAssessmentObjectResult)
                                && conRow[1].sttResult.pronunciationAssessmentObjectResult.length > 0
                                    ? conRow[1].sttResult.pronunciationAssessmentObjectResult
                                    : [];

                                let lGrammarScore = 0;
                                let lTopicScore = 0;
                                let lVocabularyScore = 0;
                                let lAccuracyScore = 0;
                                let lCompletenessScore = 0;
                                let lFluencyScore = 0;
                                let lPronScore = 0;
                                let lProsodyScore = 0;

                                if ( userReplyContentArray && userReplyContentArray.length > 0) {
                                    userReplyContentArray.forEach (function (inConRow, key) {
                                        const userReplyContent = inConRow.privPronJson && inConRow.privPronJson.ContentAssessment ? inConRow.privPronJson.ContentAssessment : {};
                                        lGrammarScore += userReplyContent.GrammarScore ? userReplyContent.GrammarScore : 0;
                                        lTopicScore += userReplyContent.TopicScore ? userReplyContent.TopicScore:0;
                                        lVocabularyScore += userReplyContent.VocabularyScore ? userReplyContent.VocabularyScore : 0;
                                    })
                                }

                                lGrammarScore = lGrammarScore > 0 ? lGrammarScore/userReplyContentArray.length: 0;
                                lTopicScore = lTopicScore > 0 ? lTopicScore/userReplyContentArray.length: 0;
                                lVocabularyScore = lVocabularyScore > 0 ? lVocabularyScore/userReplyContentArray.length: 0;

                                if ( userReplyPronArray && userReplyPronArray.length > 0 ) {
                                    userReplyPronArray.forEach (function (inPronRow, key) {
                                        const userReplyPron = inPronRow.privPronJson && inPronRow.privPronJson.PronunciationAssessment ? inPronRow.privPronJson.PronunciationAssessment : {};
                                        lAccuracyScore += userReplyPron.AccuracyScore ? userReplyPron.AccuracyScore: 0;
                                        lCompletenessScore += userReplyPron.CompletenessScore ? userReplyPron.CompletenessScore: 0;
                                        lFluencyScore += userReplyPron.FluencyScore ? userReplyPron.FluencyScore: 0;
                                        lPronScore += userReplyPron.PronScore ? userReplyPron.PronScore: 0;
                                        lProsodyScore += userReplyPron.ProsodyScore ? userReplyPron.ProsodyScore:0;
                                    })
                                }

                                lAccuracyScore = lAccuracyScore > 0 ? lAccuracyScore/userReplyPronArray.length: 0;
                                lCompletenessScore = lCompletenessScore > 0 ? lCompletenessScore/userReplyPronArray.length: 0;
                                lFluencyScore = lFluencyScore > 0 ? lFluencyScore/userReplyPronArray.length: 0;
                                lProsodyScore = lProsodyScore > 0 ? lProsodyScore/userReplyPronArray.length: 0;
                                lPronScore = lPronScore > 0 ? lPronScore/userReplyPronArray.length: 0;

                                return (
                                    <>
                                        {!questionAnswerStatus[index].questionAndAnswerExpanded ? (
                                            <div
                                                key={"questions-list-"+index}
                                                className="w-full  bg-white rounded-[45px] shadow-[0px_4px_4px_rgba(3,42,245,0.6)] flex justify-between items-center pr-[50px] items-center"

                                            >
                                                <div
                                                    className="w-80 text-center text-4xl font-bold font-['Gotham Pro'] break-words bg-clip-text text-transparent bg-gradient-to-r from-[#009695] to-[#1E00B199]"
                                                >
                                                    Question {index + 1}
                                                </div>

                                                <div
                                                    className="w-14 h-14 flex justify-center items-center rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        setQuestionAnswerStatus((prevState) =>
                                                            prevState.map((item, preIndex) =>
                                                                preIndex === index
                                                                    ? { ...item, questionAndAnswerExpanded: true }
                                                                    : item
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-14 h-14"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <defs>
                                                            <linearGradient id="plus-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#8A9BFF" />
                                                                <stop offset="50%" stopColor="#4693F2" />
                                                                <stop offset="100%" stopColor="#009695" />
                                                            </linearGradient>
                                                        </defs>
                                                        <path
                                                            d="M12 5v14M5 12h14"
                                                            stroke="url(#plus-gradient)"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        ):(
                                            <div className="w-full h-full p-[24px] bg-gradient-to-b from-[rgba(3,42,245,0.42)] to-[rgba(30,0,177,0.28)] shadow-[0px_4px_4px_rgba(3,42,245,0.6)] rounded-[45px] flex flex-col justify-start items-start">
                                                {/* Header */}
                                                <div className="w-full flex justify-between items-center">
                                                    <div className="w-[259px]  text-center text-white text-4xl font-['Gotham Pro'] font-bold leading-[16px] break-words">
                                                        Question {index + 1}
                                                    </div>
                                                    <div className="relative w-[85px]  rounded-full ">
                                                        {/* Minus Icon */}
                                                        <div
                                                            className="w-14 h-14 flex justify-center items-center rounded-full cursor-pointer"
                                                            onClick={() => {
                                                                setQuestionAnswerStatus((prevState) =>
                                                                    prevState.map((item, preIndex) =>
                                                                        preIndex === index
                                                                            ? { ...item, questionAndAnswerExpanded: false }
                                                                            : item
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-10 h-10"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    d="M5 12h14"
                                                                    stroke="white" // Sets the color to white
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>

                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content Section */}
                                                <div className="w-full lg:flex justify-start items-center lg:gap-[30px] gap-[6px]">
                                                    {/* Left Column */}
                                                    <div className="lg:w-1/2 w-full flex flex-col justify-start items-start lg:gap-[50px] gap-[12px]">
                                                        {/* Reusable Card Component */}
                                                        {questionAnswerStatus[index].questionDetail ? (
                                                            <div className="w-full h-full px-[25px] pt-[8px] pb-[20px] bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.4)] rounded-[34px] overflow-hidden border border-white flex flex-col justify-start items-start gap-[44px]">
                                                                <div className="flex flex-col justify-start items-start w-full">
                                                                    <div className="flex justify-start items-center  w-full">
                                                                        <div className="w-[325px]  text-[#1E00B1] text-[20px] font-['Gotham Pro'] font-bold leading-[16px] break-words">
                                                                            Question Detail
                                                                        </div>
                                                                        {/* Circular Icon */}
                                                                        <div className="ml-auto mr-0">
                                                                            <div className=" rounded-full">
                                                                                <div
                                                                                    className="w-12 h-12 flex justify-center items-center rounded-full cursor-pointer"
                                                                                    onClick={() => {
                                                                                        setQuestionAnswerStatus((prevState) =>
                                                                                            prevState.map((item, preIndex) =>
                                                                                                preIndex === index
                                                                                                    ? { ...item, questionDetail: false }
                                                                                                    : item
                                                                                            )
                                                                                        );
                                                                                    }}
                                                                                >

                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        className="w-10 h-10"
                                                                                        viewBox="0 0 24 24"
                                                                                    >

                                                                                        <path
                                                                                            d="M12 12h14"
                                                                                            stroke="#1E00B1"
                                                                                            strokeWidth="2"
                                                                                            strokeLinecap="round"
                                                                                        />
                                                                                    </svg>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Question Description */}
                                                                    <div className="flex justify-center items-center gap-[10px] w-full">
                                                                        <div className="flex-1 text-[rgba(0,0,0,0.6)] text-[14px] font-['Gotham Pro'] font-normal leading-[24px] tracking-[0.07px] break-words">
                                                                            {conRow[0] && conRow[0].message}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        ) : (
                                                            <div className="w-full h-full px-[25px] py-[8px] bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.4)] rounded-[34px] overflow-hidden border border-white flex justify-between items-center">
                                                                <div className="w-[325px]  text-[#1E00B1] text-[20px] font-['Gotham Pro'] font-bold leading-[16px] break-words">
                                                                    Question Detail
                                                                </div>

                                                                <div className="relative w-[40px]  rounded-full">
                                                                    <div
                                                                        className="w-12 h-12 flex justify-center items-center rounded-full cursor-pointer"
                                                                        onClick={() => {
                                                                            setQuestionAnswerStatus((prevState) =>
                                                                                prevState.map((item, preIndex) =>
                                                                                    preIndex === index
                                                                                        ? { ...item, questionDetail: true }
                                                                                        : item
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="w-10 h-10"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <defs>
                                                                                <linearGradient id="plus-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                                    <stop offset="50%" stopColor="#032AF5" />
                                                                                    <stop offset="100%" stopColor="#1E00B1" />
                                                                                </linearGradient>
                                                                            </defs>
                                                                            <path
                                                                                d="M12 5v14M5 12h14"
                                                                                stroke="url(#plus-gradient)"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>


                                                            </div>

                                                        )}
                                                        {questionAnswerStatus[index].yourReplyDetail ? (
                                                            <div className="w-full h-full px-[25px] pt-[8px] pb-[20px] bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.4)] rounded-[34px] overflow-hidden border border-white flex flex-col justify-start items-start gap-[44px]">
                                                                <div className="flex flex-col justify-start items-start w-full">
                                                                    <div className="flex justify-start items-center  w-full">
                                                                        <div className="w-[325px]  text-[#1E00B1] text-[20px] font-['Gotham Pro'] font-bold leading-[16px] break-words">
                                                                            Your Reply
                                                                        </div>
                                                                        {/* Circular Icon */}
                                                                        <div className="ml-auto mr-0">
                                                                            <div className=" rounded-full">
                                                                                <div
                                                                                    className="w-12 h-12 flex justify-center items-center rounded-full cursor-pointer"
                                                                                    onClick={() => {
                                                                                        setQuestionAnswerStatus((prevState) =>
                                                                                            prevState.map((item, preIndex) =>
                                                                                                preIndex === index
                                                                                                    ? { ...item, yourReplyDetail: false }
                                                                                                    : item
                                                                                            )
                                                                                        );
                                                                                    }}
                                                                                >

                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        className="w-10 h-10"
                                                                                        viewBox="0 0 24 24"
                                                                                    >

                                                                                        <path
                                                                                            d="M12 12h14"
                                                                                            stroke="#1E00B1"
                                                                                            strokeWidth="2"
                                                                                            strokeLinecap="round"
                                                                                        />
                                                                                    </svg>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Question Description */}
                                                                    <div className="flex justify-center items-center gap-[10px] w-full">
                                                                        <div className="flex-1 text-[rgba(0,0,0,0.6)] text-[14px] font-['Gotham Pro'] font-normal leading-[24px] tracking-[0.07px] break-words">
                                                                            {conRow[1] && conRow[1].message}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        ) : (
                                                            <div className="w-full h-full px-[25px] py-[8px] bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.4)] rounded-[34px] overflow-hidden border border-white flex justify-between items-center">
                                                                <div className="w-[325px]  text-[#1E00B1] text-[20px] font-['Gotham Pro'] font-bold leading-[16px] break-words">
                                                                    Your Reply
                                                                </div>

                                                                <div className="relative w-[40px]  rounded-full">
                                                                    <div
                                                                        className="w-12 h-12 flex justify-center items-center rounded-full cursor-pointer"
                                                                        onClick={() => {
                                                                            setQuestionAnswerStatus((prevState) =>
                                                                                prevState.map((item, preIndex) =>
                                                                                    preIndex === index
                                                                                        ? { ...item, yourReplyDetail: true }
                                                                                        : item
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="w-10 h-10"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <defs>
                                                                                <linearGradient id="plus-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                                    <stop offset="50%" stopColor="#032AF5" />
                                                                                    <stop offset="100%" stopColor="#1E00B1" />
                                                                                </linearGradient>
                                                                            </defs>
                                                                            <path
                                                                                d="M12 5v14M5 12h14"
                                                                                stroke="url(#plus-gradient)"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>


                                                            </div>

                                                        )}
                                                        {questionAnswerStatus[index].recommendedAnswerDetail ? (
                                                            <div className="w-full h-full px-[25px] pt-[8px] pb-[20px] bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.4)] rounded-[34px] overflow-hidden border border-white flex flex-col justify-start items-start gap-[44px]">
                                                                <div className="flex flex-col justify-start items-start w-full">
                                                                    <div className="flex justify-start items-center w-full">
                                                                        <div className="w-[325px]  text-[#1E00B1] text-[20px] font-['Gotham Pro'] font-bold leading-[16px] break-words">
                                                                            Recommended Answer
                                                                        </div>
                                                                        {/* Circular Icon */}
                                                                        <div className="ml-auto mr-0">
                                                                            <div className="  rounded-full">
                                                                                <div
                                                                                    className="w-12 h-12 flex justify-center items-center rounded-full cursor-pointer"
                                                                                    onClick={() => {
                                                                                        setQuestionAnswerStatus((prevState) =>
                                                                                            prevState.map((item, preIndex) =>
                                                                                                preIndex === index
                                                                                                    ? { ...item, recommendedAnswerDetail: false }
                                                                                                    : item
                                                                                            )
                                                                                        );
                                                                                    }}
                                                                                >

                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        className="w-10 h-10"
                                                                                        viewBox="0 0 24 24"
                                                                                    >

                                                                                        <path
                                                                                            d="M12 12h14"
                                                                                            stroke="#1E00B1"
                                                                                            strokeWidth="2"
                                                                                            strokeLinecap="round"
                                                                                        />
                                                                                    </svg>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Question Description */}
                                                                    <div className="flex justify-center items-center gap-[10px] w-full">
                                                                        <div className="flex-1 text-[rgba(0,0,0,0.6)] text-[14px] font-['Gotham Pro'] font-normal leading-[24px] tracking-[0.07px] break-words">
                                                                            {conRow[0] && conRow[0].recommendedAnswer}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        ) : (
                                                            <div className="w-full h-full px-[25px] py-[8px] bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.4)] rounded-[34px] overflow-hidden border border-white flex justify-between items-center">
                                                                <div className="w-[325px]  text-[#1E00B1] text-[20px] font-['Gotham Pro'] font-bold leading-[16px] break-words">
                                                                    Recommended Answer
                                                                </div>

                                                                <div className="relative w-[40px]  rounded-full">
                                                                    <div
                                                                        className="w-12 h-12 flex justify-center items-center rounded-full cursor-pointer"
                                                                        onClick={() => {
                                                                            setQuestionAnswerStatus((prevState) =>
                                                                                prevState.map((item, preIndex) =>
                                                                                    preIndex === index
                                                                                        ? { ...item, recommendedAnswerDetail: true }
                                                                                        : item
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="w-10 h-10"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <defs>
                                                                                <linearGradient id="plus-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                                    <stop offset="50%" stopColor="#032AF5" />
                                                                                    <stop offset="100%" stopColor="#1E00B1" />
                                                                                </linearGradient>
                                                                            </defs>
                                                                            <path
                                                                                d="M12 5v14M5 12h14"
                                                                                stroke="url(#plus-gradient)"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>


                                                            </div>

                                                        )}


                                                    </div>

                                                    {/* Right Column */}
                                                    <div className="lg:w-1/2 w-full mt-4 lg:mt:0 px-2.5 pt-3.5 bg-white rounded-3xl shadow flex-col justify-start items-center gap-4 inline-flex">
                                                        <div className="self-stretch justify-start items-center  ">
                                                            <div className="w-full text-center text-transparent bg-clip-text bg-gradient-to-r from-[rgba(0,150,149,0.6)] to-[rgba(30,0,177,0.6)] text-2xl p-3 font-['Gotham Pro'] font-bold break-words">
                                                                Assessment
                                                            </div>

                                                            <div className="w-full h-full shadow-[0px_4px_4px_rgba(3,42,245,0.6)] bg-[rgba(3,42,245,0.11)] rounded-[60px] overflow-hidden flex justify-center items-center">
                                                                {/* Content Button */}
                                                                <div className={
                                                                    questionAnswerStatus[index].assessmentTab === "content" ?
                                                                        "w-1/2 py-[8px] bg-gradient-to-b from-[rgba(0,150,149,0.8)] to-[rgba(3,42,245,0.48)] flex justify-center items-center" :
                                                                        "w-1/2 py-[8px] flex justify-center items-center"
                                                                }>
                                                                    <div
                                                                        className={
                                                                            questionAnswerStatus[index].assessmentTab === "content" ?
                                                                                "cursor-pointer text-center text-white text-sm font-['Gotham Pro'] font-normal leading-[30px] break-words"
                                                                                : "cursor-pointer text-center text-[rgba(0,150,149,0.6)] text-sm font-['Gotham Pro'] font-normal leading-[30px] break-words"
                                                                        }
                                                                        onClick={() => {
                                                                            setQuestionAnswerStatus((prevState) =>
                                                                                prevState.map((item, preIndex) =>
                                                                                    preIndex === index
                                                                                        ? { ...item, assessmentTab: "content" }
                                                                                        : item
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        Content
                                                                    </div>
                                                                </div>

                                                                {/* Pronunciation Button */}
                                                                <div className={
                                                                    questionAnswerStatus[index].assessmentTab !== "pronunciation" ?
                                                                        "w-1/2 py-[8px] flex justify-center items-center"
                                                                        : "w-1/2 py-[8px] bg-gradient-to-b from-[rgba(0,150,149,0.8)] to-[rgba(3,42,245,0.48)] flex justify-center items-center"}>
                                                                    <div
                                                                        className={
                                                                            questionAnswerStatus[index].assessmentTab !== "pronunciation" ?
                                                                                "cursor-pointer text-center text-[rgba(0,150,149,0.6)] text-sm font-['Gotham Pro'] font-normal leading-[30px] break-words"
                                                                                :"cursor-pointer text-center text-white text-sm font-['Gotham Pro'] font-normal leading-[30px] break-words"
                                                                        }
                                                                        onClick={() => {
                                                                            setQuestionAnswerStatus((prevState) =>
                                                                                prevState.map((item, preIndex) =>
                                                                                    preIndex === index
                                                                                        ? { ...item, assessmentTab: "pronunciation" }
                                                                                        : item
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        Pronunciation
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {questionAnswerStatus[index].assessmentTab === "content" ? (
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
                                                                                {lGrammarScore}%
                                                                            </div>
                                                                        </div>

                                                                        {/* Grammar Score Progress Bar */}

                                                                        <div className="w-full flex justify-start items-center gap-[10px]">
                                                                            <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                                                <div
                                                                                    className={`h-[10px] rounded-full ${
                                                                                        lGrammarScore <= avScoreBarCutoffPoint
                                                                                            ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                                            : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${lGrammarScore}%`,
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
                                                                                {lTopicScore}%
                                                                            </div>
                                                                        </div>
                                                                        {/* Topic Score Progress Bar */}
                                                                        <div className="w-full flex justify-start items-center gap-[10px]">
                                                                            <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                                                <div
                                                                                    className={`h-[10px] rounded-full ${
                                                                                        lTopicScore <= avScoreBarCutoffPoint
                                                                                            ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                                            : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${lTopicScore}%`,
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
                                                                                {lVocabularyScore}%
                                                                            </div>
                                                                        </div>
                                                                        {/* Vocabulary Score Progress Bar */}
                                                                        <div className="w-full flex justify-start items-center gap-[10px]">
                                                                            <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                                                <div
                                                                                    className={`h-[10px] rounded-full ${
                                                                                        lVocabularyScore <= avScoreBarCutoffPoint
                                                                                            ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                                            : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${lVocabularyScore}%`,
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
                                                                                {lAccuracyScore}%
                                                                            </div>
                                                                        </div>

                                                                        {/* Accuracy Score Progress Bar */}

                                                                        <div className="w-full flex justify-start items-center gap-[10px]">
                                                                            <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                                                <div
                                                                                    className={`h-[10px] rounded-full ${
                                                                                        lAccuracyScore <= avScoreBarCutoffPoint
                                                                                            ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                                            : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${lAccuracyScore}%`,
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
                                                                                {lCompletenessScore}%
                                                                            </div>
                                                                        </div>
                                                                        {/* Completeness Score Progress Bar */}
                                                                        <div className="w-full flex justify-start items-center gap-[10px]">
                                                                            <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                                                <div
                                                                                    className={`h-[10px] rounded-full ${
                                                                                        lCompletenessScore <= avScoreBarCutoffPoint
                                                                                            ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                                            : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${lCompletenessScore}%`,
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
                                                                                {lFluencyScore}%
                                                                            </div>
                                                                        </div>
                                                                        {/* Fluency Score Progress Bar */}
                                                                        <div className="w-full flex justify-start items-center gap-[10px]">
                                                                            <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                                                <div
                                                                                    className={`h-[10px] rounded-full ${
                                                                                        lFluencyScore <= avScoreBarCutoffPoint
                                                                                            ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                                            : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${lFluencyScore}%`,
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
                                                                                {lProsodyScore}%
                                                                            </div>
                                                                        </div>

                                                                        {/* Prosody Score Progress Bar */}

                                                                        <div className="w-full flex justify-start items-center gap-[10px]">
                                                                            <div className="flex-1 h-[10px] bg-[rgba(212,212,216,0.6)] rounded-full flex items-center">
                                                                                <div
                                                                                    className={`h-[10px] rounded-full ${
                                                                                        lProsodyScore <= avScoreBarCutoffPoint
                                                                                            ? "bg-gradient-to-r from-[#B10003] to-[#1E00B1]"
                                                                                            : "bg-gradient-to-r from-[#1E00B1] to-[#009695]"
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${lProsodyScore}%`,
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
                                                </div>
                                            </div>

                                        )}



                                    </>

                                )
                            })


                        ): (
                            <></>
                        )
                    }



                </div>
            </div>
                    )

                )}





            <MessageModal
                openMessageModal={openMessageModal}
                setOpenMessageModal={setOpenMessageModal}
                messageType={messageType}
                message={message}
            />
        </UserDashboardCommonLayout>
    )
}

export default mockInterviewDetails;
export async function getServerSideProps(context) {
    const { sessionId } = context.query;


    return {
        props: {
            sessionId: sessionId || null,
        },
    };
}
