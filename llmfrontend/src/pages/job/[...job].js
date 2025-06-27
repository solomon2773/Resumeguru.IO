import React, {useState, useEffect, Fragment, useContext} from "react";
import CommonLayout from "../../components/Layout/MainLayout";
import {toast} from "react-toastify";
import { EllipsisVerticalIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import {HeartIcon as HeartIconOutline} from  '@heroicons/react/24/outline'
import {
    mongodbJobsUpdateLikedJob,
    mongodbJobsRemoveLikedJob,
    mongodbJobFindFromUUID
} from "../../helpers/mongodb/pages/jobs/search";
import {useAuth} from "../../context/AuthContext";
import { Button, Spinner} from "flowbite-react";
import UserQuickCreateContext from "../../context/UserQuickCreateContext";
import {useSelector} from "react-redux";
const statuses = {
    Complete: 'text-green-700 bg-green-50 ring-green-600/20',
    'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const formatUrl =  (input) =>{
    return input
        .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphabetic characters except spaces
        .replace(/\s+/g, '-')        // Replace spaces with hyphens
        .toLowerCase();             // Convert to lowercase (optional)
}


const jobDetails = ({ jobData, companyName, jobUUID, userId }) => {
    const {  openOverlay } = useContext(UserQuickCreateContext);
    const user = useSelector((state) => state.user);

    const createTargetResume = async (jobDetail) => {
        await localStorage.setItem('rg_jd_sel', JSON.stringify({...jobDetail, ...{timeStamp: Date.now()}}))
        window.location.replace(process.env.SITE_URL+'/user/dashboard/myResume/createResume');
    }

    const [jobDetails, setJobDetails] = useState(jobData && jobData.jobs ? jobData.jobs : null)
    const saveJob = async (jobDetail) => {
       // console.log(jobDetail)
        if (user && user.profile && user.profile.userId){
            setJobDetails(jobDetails.map((job) => {
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
        setJobDetails(jobDetails.map((job) => {
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
                      title={companyName+" - Job Board"}
                      meta_title={companyName+" - Job Board"}
                      meta_desc={jobDetails ? jobDetails[0].description && jobDetails[0].description.length >100 ? jobDetails[0].description.substring(0,100) + "..." : jobDetails[0].description : process.env.SEO_DEFAULT_DESC}
                      meta_keywords={process.env.SEO_DEFAULT_KEYWORDS}
                      ogUrl={"https://resumeguru.io/job/"+companyName+"/"+jobUUID+"/"+userId}
                      ogImageAlt={"Job Board - " + companyName}
                      ogType={"website"}
                      ogImage={jobDetails && jobDetails[0].image ? jobDetails[0].image : process.env.SITE_URL + "/images/logos/rg/fullLogos/ResumeGuru_FullLogo_ResumeGuru_FullLogo-10.svg"}
        >

            {jobDetails && jobDetails.length > 0 ? (
                <div className="relative bg-white" aria-label={"ResumeGuru.IO - Job Board "+ jobDetails[0].title}>

                    <h1 className="sr-only">Job Title : {jobDetails[0].title}</h1>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {jobData && (
                            <ul role="list" className="divide-y divide-gray-100">
                                <li id={"searchResult-"+jobDetails[0].uuid} className="flex items-center justify-between gap-x-6 py-5">
                                    <div className="min-w-0">
                                        <div className="flex items-start gap-x-3">
                                            {jobDetails[0].company && jobDetails[0].image && (
                                                <img className="h-18 w-18 rounded-lg" src={jobDetails[0].image} alt={jobDetails[0].company} />
                                            )}


                                            <div className="font-bold font-semibold leading-6 text-gray-900">
                                                {jobDetails[0].company && (
                                                    <p className="truncate font-bold "> {jobDetails[0].company}</p>
                                                )}
                                                {jobDetails[0].title}
                                            </div>
                                            <div
                                                className={classNames(
                                                    statuses[jobDetails[0].status],
                                                    'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                                                )}
                                            >
                                                {jobDetails[0].employmentType}
                                            </div>
                                            {jobDetails[0].likedUser && jobDetails[0].likedUser.length > 0 && user.profile && user.profile.userId && jobDetails[0].likedUser.includes(user.profile.userId) ? (
                                                <HeartIconSolid
                                                    onClick={()=>{
                                                        removeSavedJob(jobDetails[0]);
                                                    }}
                                                    className="h-5 w-5 text-red-600 cursor-pointer"/>

                                            ):(
                                                <HeartIconOutline
                                                    onClick={() => {
                                                        saveJob(jobDetails[0]);
                                                    }}
                                                    className="h-5 w-5 cursor-pointer"/>
                                            )}

                                        </div>




                                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                            {jobDetails[0].datePosted && (
                                                <>
                                                    <p className="whitespace-nowrap">
                                                        Posted time : <time dateTime={jobDetails[0].datePosted}>{jobDetails[0].datePosted}</time>
                                                    </p>
                                                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                                                        <circle cx={1} cy={1} r={1} />
                                                    </svg>
                                                </>

                                            )}


                                            {jobDetails[0].location && (
                                                <p className="truncate"> { " | "+jobDetails[0].location}</p>
                                            )}
                                            {jobDetails[0].salaryRange && (
                                                <p className="truncate">{" | "+jobDetails[0].salaryRange}</p>
                                            )}
                                        </div>
                                        <div className=" items-start gap-x-3">
                                            {user.profile && user.profile.userId ?(
                                                <div>
                                                    <div className="p-2">
                                                        <a href={process.env.SITE_URL+'/user/dashboard/mockInterview/with/'+ formatUrl(jobDetails[0].company+"---"+jobDetails[0].title)+"/"+jobDetails[0].id}>
                                                            <Button
                                                                // onClick={() => {
                                                                //     createTargetMockInterview(job);
                                                                // }}
                                                                size="sm"
                                                                outline gradientDuoTone="purpleToBlue"
                                                                className="text-white font-semibold text-sm block sm:hidden"
                                                            >Start Mock Interview<span className="sr-only">Mock Interview for {jobDetails[0].title}</span>
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
                                                        > Create Targeted Resume<span className="sr-only">Create Targeted Application for {jobDetails[0].title}</span>
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
                                            {jobDetails[0].jobProviders && jobDetails[0].jobProviders.length > 0 && jobDetails[0].jobProviders.map((jobProvider, jobProviderIndex)=>(
                                                <div
                                                    key={"jobProvider-"+jobProviderIndex}
                                                    className={classNames(
                                                        statuses[jobDetails[0].status],
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
                                                    <a href={process.env.SITE_URL+'/user/dashboard/mockInterview/with/'+ formatUrl(jobDetails[0].company+"---"+jobDetails[0].title)+"/"+jobDetails[0].id}>

                                                        <Button
                                                            // onClick={() => {
                                                            //     createTargetMockInterview(job);
                                                            // }}
                                                            size="xs"
                                                            outline gradientDuoTone="purpleToBlue"
                                                            className="text-white font-semibold text-sm hidden sm:block"
                                                        > Start Mock Interview<span className="sr-only">Start Mock Interview for {jobDetails[0].title}</span>
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
                                                    > Create Targeted Resume<span className="sr-only">Create Targeted Application for {jobDetails[0].title}</span>
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

                            </ul>
                        )}

                        <div>
                            <h2 className="">Job Description</h2>
                            <textarea
                                rows={20}
                                name="jobDescirption"
                                id="jobDescirption"
                                defaultValue={jobDetails[0].description}
                                disabled={true}
                                className={` p-2 block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                placeholder="EX: In this role, you’ll be hands-on, writing code and contributing to the design and architecture of our systems, but will also help define and drive our teams toward the larger product vision. You’ll work across multiple teams, doing everything from delivering proof-of-concept projects to diving in when things go wrong and helping to resolve challenging production support concerns. As you get familiar with our products and vision, you’ll become a subject matter expert on our ecosystem and platform."
                            />

                        </div>
                    </div>


                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-96">
                    <h1 className="text-2xl font-semibold">Job Not Found</h1>
                    <p className="text-gray-500">The job you are looking for is not available</p>
                    <div className="m-3">

                            <a href={process.env.SITE_URL+"/jobs/search"} className="text-blue-500 hover:underline cursor-pointer"> Search for new jobs </a>

                    </div>
                </div>
            )}



        </CommonLayout>
    )
}

export default jobDetails
export async function getServerSideProps(context) {
    const { job } = context.query;
    const companyName = job ? job[0] : '';
    const jobUUID = job ? job[1] : '';
    const userId = job ? job[2] : '';

    const jobData = await mongodbJobFindFromUUID( jobUUID);


    return {
        props: {
            jobData: JSON.parse(JSON.stringify(jobData)),
            companyName,
            jobUUID,
            userId,
        },
    };
}
