import React, {useState, useEffect} from 'react';
import {sendChatMessageAsync, setOpenPricingModal, setSystemReplyMessage} from "../../../store/mockInterview/chatSlice";
import {useDispatch, useSelector} from "react-redux";
import {ChatPromptTemplate} from "langchain/prompts";
import {recommendAnswerPrompt} from "../../../helpers/langChain/prompts/mockInterview/recommendAnswer";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {recommendAnswerModel} from "../../../helpers/langChain/functions/mockInterview/recommendAnswer";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {mongodbUpdateRecommendedAnswerToSttTts} from "../../../helpers/mongodb/pages/mockInterview/sttTTS";
import {toast} from "react-toastify";


const RecommendAnswer = () => {
    const dispatch = useDispatch();
    const systemReplyMessage = useSelector((state) => state.chat.systemReplyMessage);
    const lastSttTtsObjectId = useSelector((state) => state.chat.lastSttTtsObjectId);
    const messages = useSelector((state) => state.chat.chatMessages);
    const mockInterviewFromJobSearch = useSelector((state) => state.chat.mockInterviewFromJobSearch);
    const user  = useSelector((state) => state.user.profile);

    const [aiTemputate, setAiTemputate] = useState(0.8);
    const [recommendedAnswer , setRecommendedAnswer] = useState("");


    useEffect(() =>{
        async function recommendAnswerStreaming(){
            const startTime = Date.now();

            try{

                const modelParams = {
                    temperature: aiTemputate,
                    // top_p: 1.0,
                    // frequency_penalty: 0.1,
                    // presence_penalty: 0.0,
                    user: user.userId,
                    stream: true,
                    modelName: 'gpt-4o-mini',
                    //openAIApiKey: process.env.OPENAI_API_KEY,
                    azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
                };

                let chatPrompt;
                chatPrompt = new ChatPromptTemplate(recommendAnswerPrompt);

                const streamInputData = {
                    "jobDescription":mockInterviewFromJobSearch ? mockInterviewFromJobSearch : "",
                    "groupChatReplyQuestion":messages[messages.length - 1].message,
                };


                const modelOpenAI = new ChatOpenAI(modelParams).bind(recommendAnswerModel);
                const chat = chatPrompt
                    .pipe(modelOpenAI)
                    .pipe(new JsonOutputFunctionsParser());

                const stream = await chat.stream({inputData: JSON.stringify(streamInputData)});
                let recommendedAnswerBuf = "";
                for await (const chunk of stream) {
                    recommendedAnswerBuf = chunk.recommendAnswer.replace(/<|>/g, "");
                    setRecommendedAnswer(
                        chunk.recommendAnswer.replace(/<|>/g, "")
                    );
                }
                const endTime = Date.now();
                const fetchTime = endTime - startTime;
                ///console.log("overviewRewriteStreaming fetchTime", overviewRewriteBuf);
                await mongodbUpdateRecommendedAnswerToSttTts({
                    objectId: lastSttTtsObjectId,
                    recommendedAnswer: recommendedAnswerBuf,
                    recommendedAnswerProcessingTime: fetchTime,

                }).then((result)=>{
                    // dispatch(setLastSttTtsObjectId(""));
                });
            } catch (e) {
                dispatch(setSystemReplyMessage(false));
                console.log(e)
                return toast.error("Recommend Answer Streaming Error", e.message ? e.message : "Error ")

            }


        }

        if ( messages && messages.length > 0 && messages[messages.length - 1].msg_from === "ResumeGuru.IO" && lastSttTtsObjectId){

            recommendAnswerStreaming().then((result)=> {
                dispatch(setSystemReplyMessage(false));
            }).catch((e)=>{
                dispatch(setSystemReplyMessage(false));
                console.log("recommendAnswerStreamingError", e);
            })
        }
    },[systemReplyMessage, messages, lastSttTtsObjectId])

    return (
        <div className="w-full px-6 py-5 bg-white shadow-[0px_4px_4px_rgba(3,42,245,0.40)] rounded-[34px] border border-white overflow-hidden flex flex-col justify-start items-start gap-2">
            <div className="w-full flex justify-start items-start gap-6">
                <div className="w-full h-auto text-[#1E00B1] text-xl font-bold ">
                    Recommended Answer
                </div>
            </div>
            <div className="w-full flex justify-center gap-2 overflow-auto">
                <div className="w-full h-[288px] text-[rgba(0,0,0,0.60)] text-sm font-normal leading-6 tracking-[0.07em]">
                    {recommendedAnswer}
                </div>
            </div>
        </div>

    );
}
export default RecommendAnswer;
