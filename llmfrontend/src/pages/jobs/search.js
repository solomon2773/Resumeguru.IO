import React, {useState, useEffect, Fragment, useContext} from "react";
import CommonLayout from "../../components/Layout/MainLayout";
import {toast} from "react-toastify";
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import {HeartIcon as HeartIconOutline} from  '@heroicons/react/24/outline'
import {ChatPromptTemplate} from "langchain/prompts";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {mongodbJobsSearchResultInsert ,mongodbJobsSearchLastResultFind, mongodbJobsUpdateLikedJob, mongodbJobsRemoveLikedJob, mongodbJobsFindUserLikedJobs} from "../../helpers/mongodb/pages/jobs/search";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import {jobSearchQueryPrompt} from "../../helpers/langChain/prompts/jobSearch/search";
import {jobSearchModel} from "../../helpers/langChain/functions/jobSearch/search";
import {useAuth} from "../../context/AuthContext";
import {Modal, Button, Spinner} from "flowbite-react";
import UserQuickCreateContext from "../../context/UserQuickCreateContext";
import {getCookie, setCookie} from "../../utils/cookies";
import { v4 as uuidv4 } from 'uuid';
import {useSelector} from "react-redux";

const statuses = {
    Complete: 'text-green-700 bg-green-50 ring-green-600/20',
    'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const Search = () => {
    const [jobs, setJobs] = useState([])
    const [jobSearchPrompt, setJobSearchPrompt] = useState('')
    const [searchQueryParams, setSearchQueryParams] = useState({})
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [searching, setSearching] = useState(false)
    const [isProcessingLoadMore, setIsProcessingLoadMore] = useState(false)
    const user = useSelector(state => state.user)

    const {  openOverlay } = useContext(UserQuickCreateContext);

    const getJobs = async (inputData) => {
        const response = await fetch('/api/pages/jobs/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                data: inputData
            }),
        });
        return response.json();
    }
    useEffect(()=>{

        if (jobs.length === 0){
            mongodbJobsSearchLastResultFind().then((result)=>{
                if (result){
                    setJobSearchPrompt(result.jobSearchPrompt)
                    setSearchQueryParams(result.searchQueryParams)
                    setCurrentPageIndex(result.index)
                    setJobs(result.jobs)
                }
            })


        }
    },[jobs])

    // Function to add UUID to each job
    const addUUIDToJobs = async (jobsArray) => {
        return jobsArray.map(job => ({
            ...job,
            uuid: uuidv4(),
        }));
    };

    const [openModalJobDescription, setOpenModalJobDescription] = useState(false);
    const [jobDescription, setJobDescription] = useState({});
    const handelJobDescriptionClick = (job) => {
        setOpenModalJobDescription(true)
        setJobDescription(job)

    }

    const searchJobs = async () => {

        if (jobSearchPrompt === ''){
            toast.error('Please enter a job search prompt')
            return;
        }

        const guestSearchCount = await getCookie('rg_gsc') ? await parseInt(await getCookie('rg_gsc')) : 0;

        if (guestSearchCount >= 2 && !user.profile && !user.profile.userId){
            toast.error('You have reached the maximum number of searches as a guest. Please sign up to continue searching.')
            return;
        }
        setSearching(true);
        try {
            const startTime = Date.now();
            const chatPrompt = new ChatPromptTemplate( jobSearchQueryPrompt);
            const modelOpenAI = new ChatOpenAI({
                openAIApiKey: process.env.OPENAI_API_KEY,
                // azureOpenAIApiKey: process.env.MICROSOFT_OPENAI_API_KEY_GPT4_32K,
                // azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
                // azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
                // azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
            }).bind(jobSearchModel);

            // console.log(resumeData.professionalExperienceRewrite)
            const chat = chatPrompt
                .pipe(modelOpenAI)
                .pipe(new JsonOutputFunctionsParser());

            const stream = await chat.stream( {jobSearchQuery:jobSearchPrompt});
            // Assume this variable is defined in the scope of your stream processing

            let output = "";
            for await (const chunk of stream) {
                output = chunk;

            }
            const postQueryParams = {
                query: output.query,
                location: output.location,
                distance: output.distance,
                language: output.language,
                remoteOnly: output.remoteOnly,
                datePosted: output.datePosted,
                employment: output.employment,
                index: 0,};

            const jobSearch = await getJobs(postQueryParams);

            const endTime = Date.now();
            const fetchTime = endTime - startTime;

            if (!jobSearch.status){
                toast.error("Search Error ... ")
                return;
            }
            await setCookie('rg_gsc', guestSearchCount + 1, 1)
            const parsedJobsData = await JSON.parse(jobSearch.jobsSearch);
            parsedJobsData.jobs = await addUUIDToJobs(parsedJobsData.jobs);
            setSearchQueryParams(postQueryParams)
            setCurrentPageIndex(parsedJobsData.index)
            setJobs(parsedJobsData.jobs)

            mongodbJobsSearchResultInsert({
                fetchTime: fetchTime,
                userId: user.profile && user.profile.userId ? user.profile.userId : null,
                jobSearchPrompt: jobSearchPrompt,
                searchQueryParams:postQueryParams,
                errors: parsedJobsData.errors,
                loadMore: false,
                jobs: parsedJobsData.jobs,
                jobCount: parsedJobsData.jobCount,
                index: parsedJobsData.index,
                hasError: parsedJobsData.hasError,

            }).then((result) => {
                setSearching(false);
            }).catch((err) => {

              //  toast.error("Regenerate Linkedin Connectionn Message Error 1001...")  ;
            })

        } catch (error) {
            setSearching(false);
           //   console.log(error)
            toast.error("Search Error ... ")
        }

    }

    const loadMoreJobs = async () => {
        setIsProcessingLoadMore(true)
        try {
            const startTime = Date.now();
            const postQueryParams = {
                query: searchQueryParams.query,
                location: searchQueryParams.location,
                distance: searchQueryParams.distance,
                language: searchQueryParams.language,
                remoteOnly: searchQueryParams.remoteOnly,
                datePosted: searchQueryParams.datePosted,
                employment: searchQueryParams.employment,
                index: currentPageIndex+1,
            };

            const jobSearch = await getJobs(postQueryParams);

            if (!jobSearch.status){
                toast.error("Search Error ... ")
                return;
            }
            const parsedJobsData = await JSON.parse(jobSearch.jobsSearch);
            // Add UUID to each job in the parsedJobsData.jobs array
            parsedJobsData.jobs = await addUUIDToJobs(parsedJobsData.jobs);
            setCurrentPageIndex(parsedJobsData.index)
            setJobs([...jobs, ...parsedJobsData.jobs])
            setIsProcessingLoadMore(false)
            const endTime = Date.now();
            const fetchTime = endTime - startTime;




            mongodbJobsSearchResultInsert({
                fetchTime: fetchTime,
                userId: user.profile.userId,
                jobSearchPrompt: jobSearchPrompt,
                loadMore: true,
                searchQueryParams:postQueryParams,
                errors: parsedJobsData.errors,
                jobs: parsedJobsData.jobs,
                jobCount: parsedJobsData.jobCount,
                index: parsedJobsData.index,
                hasError: parsedJobsData.hasError,

            }).then((result) => {
                setSearching(false);
            }).catch((err) => {

                //  toast.error("Regenerate Linkedin Connectionn Message Error 1001...")  ;
            })
        } catch (error) {
            setIsProcessingLoadMore(false)
            toast.error("Search Error ... ")
        }
    }
    const formatUrl =  (input) =>{
        return input
            .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphabetic characters except spaces
            .replace(/\s+/g, '-')        // Replace spaces with hyphens
            .toLowerCase();             // Convert to lowercase (optional)
    }
    const createTargetResume = async (jobDetail) => {
        await localStorage.setItem('rg_jd_sel', JSON.stringify({...jobDetail, ...{timeStamp: Date.now()}}))
        window.location.replace(process.env.SITE_URL+'/user/dashboard/myResume/createResume');
    }
    // const createTargetMockInterview = async (jobDetail) => {
    //     await localStorage.setItem('rg_jd_sel_mock_interview', JSON.stringify({...jobDetail, ...{timeStamp: Date.now()}}))
    //     window.location.replace(process.env.SITE_URL+'/user/dashboard/mockInterview/with/'+await formatUrl(jobDetail.company+jobDetail.title)+"/"+jobDetail.id);
    // }

    const saveJob = async (jobDetail) => {
       // console.log(jobDetail)
        if (user.profile && user.profile.userId){
            setJobs(jobs.map((job) => {
                if (job.uuid === jobDetail.uuid) {
                    if (user.profile && user.profile.userId) {
                        if (job.likedUser && job.likedUser.length > 0){
                            job.likedUser.push(user.profile.userId)
                        } else {
                            job.likedUser = [user.profile.userId]
                        }
                        mongodbJobsUpdateLikedJob(jobDetail.uuid, user.profile.userId);
                    }

                }
                return job;
            }))
        } else {
            toast.error("Please login to save a job")
        }


    }

    const removeSavedJob = async (jobDetail) => {
        setJobs(jobs.map((job) => {
            if (job.uuid === jobDetail.uuid) {

                if (job.likedUser && job.likedUser.length > 0 && user.profile && user.profile.userId) {
                    mongodbJobsRemoveLikedJob(jobDetail.uuid, user.profile.userId);
                    job.likedUser = job.likedUser.filter((userId) => userId !== user.profile.userId)
                }
            }
            return job;
        }))
    }

   // console.log(jobs)
    return (
        <CommonLayout parent="home"
                      title="ResumeGuru - Job Board"
                      meta_title="ResumeGuru - Job Board"
                      meta_desc="Avoid the old-fashioned method of using keywords to search for a job. Instead, use natural language, like the way you speak, to find job opportunities."
                      meta_keywords={process.env.SEO_DEFAULT_KEYWORDS}
                      ogUrl="https://resumeguru.io/jobs/search"
                      ogImageAlt="ResumeGuru.IO - Job Board"
                      ogType={"website"}
        >

            <div className="relative bg-white" aria-label="ResumeGuru.IO - Job Board">

                <h1 className="sr-only">Future Job Search</h1>
                <div className="m-2">
                    <form className="max-w-md mx-auto">
                        <label htmlFor="default-job-search"
                               className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search"
                                   id="default-job-search"
                                      name="default-job-search"
                                      onChange={(e) => setJobSearchPrompt(e.target.value)}
                                   className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="looking for a remote content creator job..." required/>
                                <button type="submit"
                                        onClick={(e) => {   e.preventDefault();
                                            searchJobs();
                                        }}
                                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                                </button>


                        </div>
                    </form>
                    <h2
                        id="job-search-instruction"
                        name="job-search-instruction"
                        className="p-2 ml-auto mr-auto text-center max-w-3xl"> Avoid the old-fashioned method of using keywords to search for a job. Instead, use natural language, like the way you speak, to find job opportunities.</h2>

                </div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    <ul role="list" className="divide-y divide-gray-100">
                        {!searching && jobs && jobs.length > 0 ? jobs.map((job, jobIndex) => (
                            <li key={"searchResult-"+currentPageIndex+"-"+job.uuid} className="flex items-center justify-between gap-x-6 py-5">
                                <div className="min-w-0">
                                    <div className="flex items-start gap-x-3">
                                        {job.company && job.image && (
                                            <img className="h-18 w-18 rounded-lg" src={job.image} alt={job.company} />
                                        )}
                                        <div className="text-sm font-semibold leading-6 text-gray-900">
                                                {job.title}
                                        </div>
                                            <div
                                            className={classNames(
                                                statuses[job.status],
                                                'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                                            )}
                                        >
                                            {job.employmentType}
                                        </div>
                                        {job.likedUser && job.likedUser.length > 0 && user.profile && user.profile.userId && job.likedUser.includes(user.profile.userId) ? (
                                            <HeartIconSolid
                                                onClick={()=>{
                                                    removeSavedJob(job);
                                                }}
                                                className="h-5 w-5 text-red-600 cursor-pointer"/>

                                        ):(
                                            <HeartIconOutline
                                                onClick={() => {
                                                saveJob(job);
                                            }}
                                                className="h-5 w-5 cursor-pointer"/>
                                        )}
                                    </div>


                                    <div>
                                        <p className="mt-1 text-sm text-gray-500 cursor-pointer "
                                        // onClick={()=>{
                                        //     handelJobDescriptionClick(job);
                                        // }}
                                        ><a href={user.profile && user.profile.userId ? process.env.SITE_URL+"/job/"+job.company+"/"+job.uuid+"/"+user.profile.userId : process.env.SITE_URL+"/job/"+job.company+"/"+job.uuid+"/0"}>{job.description && job.description.length >200 ? job.description.substring(0,200) + "..." : job.description}</a></p>
                                    </div>
                                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                        {job.datePosted && (
                                            <>
                                                <p className="whitespace-nowrap">
                                                    Posted time : <time dateTime={job.datePosted}>{job.datePosted}</time>
                                                </p>
                                                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                                                    <circle cx={1} cy={1} r={1} />
                                                </svg>
                                            </>

                                        )}

                                        {job.company && (
                                        <p className="truncate">Created by {job.company}</p>
                                        )}
                                        {job.location && (
                                            <p className="truncate"> { " | "+job.location}</p>
                                        )}
                                        {job.salaryRange && (
                                        <p className="truncate">{" | "+job.salaryRange}</p>
                                        )}
                                    </div>
                                    <div className=" items-start gap-x-3">
                                        {user.profile && user.profile.userId ?(
                                            <div>
                                                <div className="p-2">
                                                    <a href={process.env.SITE_URL+'/user/dashboard/mockInterview/with/'+ formatUrl(job.company+"---"+job.title)+"/"+job.id}>
                                                        <Button
                                                            // onClick={() => {
                                                            //     createTargetMockInterview(job);
                                                            // }}
                                                            size="sm"
                                                            outline gradientDuoTone="purpleToBlue"
                                                            className="text-white font-semibold text-sm block sm:hidden"
                                                        >Start Mock Interview<span className="sr-only">Mock Interview for {job.title}</span>
                                                        </Button>
                                                    </a>

                                                </div>
                                                <div className="p-2">
                                                    <Button
                                                        onClick={() => {
                                                            createTargetResume(job);
                                                        }}
                                                        size="sm"
                                                        outline gradientDuoTone="purpleToBlue"
                                                        className="text-white font-semibold text-sm block sm:hidden"
                                                    > Create Targeted Resume<span className="sr-only">Create Targeted Application for {job.title}</span>
                                                    </Button>
                                                </div>


                                            </div>


                                        ) : (
                                            <div>
                                                <div className="p-2">
                                                    <Button
                                                        onClick={()=>{
                                                            openOverlay();
                                                            return;

                                                        }}
                                                        outline gradientDuoTone="purpleToBlue"
                                                        className="text-white font-semibold text-sm block sm:hidden"
                                                    >Start Mock Interview
                                                    </Button>
                                                </div>
                                                <div className="p-2">
                                                    <Button
                                                        onClick={()=>{
                                                            openOverlay();
                                                            return;

                                                        }}
                                                        outline gradientDuoTone="purpleToBlue"
                                                        className="text-white font-semibold text-sm block sm:hidden"
                                                    >Create Targeted Resume
                                                    </Button>
                                                </div>

                                            </div>

                                        )}
                                        <div>
                                            Also posted on :
                                        </div>
                                        {job.jobProviders && job.jobProviders.length > 0 && job.jobProviders.map((jobProvider, jobProviderIndex)=>(
                                        <div
                                            key={"jobProvider-"+jobProviderIndex}
                                            className={classNames(
                                                statuses[job.status],
                                                'inline-block m-1 rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                                            )}
                                        >
                                          <a href={jobProvider.url} target="_blank" className="text-blue-500 hover:text-blue-700">
                                              {jobProvider.jobProvider}
                                          </a>


                                        </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                    {user.profile && user.profile.userId ?(
                                        <div>
                                            <div className="p-2">
                                                <a href={process.env.SITE_URL+'/user/dashboard/mockInterview/with/'+ formatUrl(job.company+"---"+job.title)+"/"+job.id}>

                                                <Button
                                                    // onClick={() => {
                                                    //     createTargetMockInterview(job);
                                                    // }}
                                                    size="xs"
                                                    outline gradientDuoTone="purpleToBlue"
                                                    className="text-white font-semibold text-sm hidden sm:block"
                                                > Start Mock Interview<span className="sr-only">Start Mock Interview for {job.title}</span>
                                                </Button>
                                                </a>
                                            </div>
                                            <div className="p-2">
                                                <Button
                                                    onClick={() => {
                                                        createTargetResume(job);
                                                    }}
                                                    size="xs"
                                                    outline gradientDuoTone="purpleToBlue"
                                                    className="text-white font-semibold text-sm hidden sm:block"
                                                > Create Targeted Resume<span className="sr-only">Create Targeted Application for {job.title}</span>
                                                </Button>
                                            </div>

                                        </div>

                                    ) : (
                                        <div>
                                            <div className="p-2">
                                                <Button
                                                    onClick={()=>{
                                                        openOverlay();
                                                        return;

                                                    }}
                                                    size="xs"
                                                    outline gradientDuoTone="purpleToBlue"
                                                    className="text-white font-semibold text-sm hidden sm:block"
                                                >Start Mock Interview
                                                </Button>
                                            </div>
                                            <div className="p-2">
                                                <Button
                                                    onClick={()=>{
                                                        openOverlay();
                                                        return;

                                                    }}
                                                    size="xs"
                                                    outline gradientDuoTone="purpleToBlue"
                                                    className="text-white font-semibold text-sm hidden sm:block"
                                                >Create Targeted Resume
                                                </Button>
                                            </div>

                                        </div>

                                    )}





                                    {/*<Menu as="div" className="relative flex-none">*/}
                                    {/*    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">*/}
                                    {/*        <span className="sr-only">Open options</span>*/}
                                    {/*        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />*/}
                                    {/*    </Menu.Button>*/}
                                    {/*    <Transition*/}
                                    {/*        as={Fragment}*/}
                                    {/*        enter="transition ease-out duration-100"*/}
                                    {/*        enterFrom="transform opacity-0 scale-95"*/}
                                    {/*        enterTo="transform opacity-100 scale-100"*/}
                                    {/*        leave="transition ease-in duration-75"*/}
                                    {/*        leaveFrom="transform opacity-100 scale-100"*/}
                                    {/*        leaveTo="transform opacity-0 scale-95"*/}
                                    {/*    >*/}
                                    {/*        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">*/}
                                    {/*            /!*<Menu.Item>*!/*/}
                                    {/*            /!*    {({ active }) => (*!/*/}
                                    {/*            /!*        <div*!/*/}
                                    {/*            /!*            onClick={() => {*!/*/}
                                    {/*            /!*                saveJob(job);*!/*/}
                                    {/*            /!*            }}*!/*/}
                                    {/*            /!*            data-job-id={job.id}*!/*/}
                                    {/*            /!*            className={classNames(*!/*/}
                                    {/*            /!*                active ? 'bg-gray-50' : '',*!/*/}
                                    {/*            /!*                'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'*!/*/}
                                    {/*            /!*            )}*!/*/}
                                    {/*            /!*        >*!/*/}
                                    {/*            /!*            Save Job<span className="sr-only">, add to favorite - {job.title}</span>*!/*/}
                                    {/*            /!*        </div>*!/*/}
                                    {/*            /!*    )}*!/*/}
                                    {/*            /!*</Menu.Item>*!/*/}
                                    {/*            /!*<Menu.Item>*!/*/}
                                    {/*            /!*    {({ active }) => (*!/*/}
                                    {/*            /!*        <div*!/*/}
                                    {/*            /!*            onClick={() => {*!/*/}

                                    {/*            /!*            }}*!/*/}
                                    {/*            /!*            data-job-id={job.id}*!/*/}
                                    {/*            /!*            className={classNames(*!/*/}
                                    {/*            /!*                active ? 'bg-gray-50' : '',*!/*/}
                                    {/*            /!*                'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'*!/*/}
                                    {/*            /!*            )}*!/*/}
                                    {/*            /!*        >*!/*/}
                                    {/*            /!*            Create Cover Letter<span className="sr-only">, {job.title}</span>*!/*/}
                                    {/*            /!*        </div>*!/*/}
                                    {/*            /!*    )}*!/*/}
                                    {/*            /!*</Menu.Item>*!/*/}
                                    {/*            /!*<Menu.Item>*!/*/}
                                    {/*            /!*    {({ active }) => (*!/*/}
                                    {/*            /!*        <div*!/*/}
                                    {/*            /!*            className={classNames(*!/*/}
                                    {/*            /!*                active ? 'bg-gray-50' : '',*!/*/}
                                    {/*            /!*                'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'*!/*/}
                                    {/*            /!*            )}*!/*/}
                                    {/*            /!*        >*!/*/}
                                    {/*            /!*            Delete<span className="sr-only">, {job.title}</span>*!/*/}
                                    {/*            /!*        </div>*!/*/}
                                    {/*            /!*    )}*!/*/}
                                    {/*            /!*</Menu.Item>*!/*/}
                                    {/*        </Menu.Items>*/}
                                    {/*    </Transition>*/}
                                    {/*</Menu>*/}
                                </div>
                            </li>
                        )) : (
                            <div className="text-center">
                                <Spinner aria-label="Job Search in Process..." size="xl" />
                            </div>
                        )}
                    </ul>

                </div>
                {jobs && jobs.length > 0 && (
                <div className="text-center">
                    {user.profile && user.profile.userId ?(
                    <Button
                            onClick={(e) => {   e.preventDefault();
                                loadMoreJobs();
                            }}
                            size="xs"
                            color="blue"
                            isProcessing={isProcessingLoadMore}
                            className="ml-auto mr-auto text-white bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Load More
                    </Button>
                    ) : (
                        <Button
                            onClick={()=>{
                                openOverlay();
                                return;

                            }}
                            size="xs"
                            color="blue"
                            isProcessing={isProcessingLoadMore}
                            className="ml-auto mr-auto text-white bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Load More
                        </Button>
                        )}
                </div>
                )}
            </div>

            <Modal dismissible show={openModalJobDescription} onClose={() => setOpenModalJobDescription(false)}>
                <Modal.Header>Job Description</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">

                            {jobDescription.description}


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="gray" onClick={() => setOpenModalJobDescription(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </CommonLayout>
    )
}

export default Search
