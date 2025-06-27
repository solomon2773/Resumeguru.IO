import MockInterviewAutoGenV3 from '../../../../../components/mockinterview/mockInterviews/MockInterviewAutoGenV3';
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {getJobDetailsByJobId} from '../../../../../helpers/mongodb/pages/mockInterview/withCompany';
import {setMockInterviewFromJobSearch} from '../../../../../store/mockInterview/chatSlice';
import {useDispatch, useSelector} from "react-redux";
import CommonLayout from "../../../../../components/Layout/MainLayout";



export default function InterviewWitCompany({withCompany}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [searchedJob, setSearchedJob] = useState("Looking for your job, please wait.");
    const mockInterviewFromJobSearch = useSelector(state => state.chat.mockInterviewFromJobSearch)


    useEffect(() => {

        if (withCompany && withCompany[1]){
            getJobDetailsByJobId(withCompany[1]).then((data) => {
                if (data && data.jobs && data.jobs[0] && data.jobs[0].id){
                    dispatch(setMockInterviewFromJobSearch(data));
                    setSearchedJob(data.jobs[0].company + " - " + data.jobs[0].title);
                } else {
                    setSearchedJob("Job not found, please go back to previous page");
                    window.location.href = process.env.SITE_URL+"/jobs/search";
                }

            })
        }

    },[withCompany])
    return (


        <div className=" mx-auto">
            {mockInterviewFromJobSearch && mockInterviewFromJobSearch.jobs && mockInterviewFromJobSearch.jobs[0] && mockInterviewFromJobSearch.jobs[0].id ? (
                <MockInterviewAutoGenV3 />
            ):(
                <CommonLayout parent="home"
                              title={"Mock Interview "+withCompany[0]+"- ResumeGuru.IO"}
                              meta_title={"Mock Interview "+withCompany[0]+"- ResumeGuru.IO"}
                              meta_desc=""
                              meta_keywords={process.env.SEO_DEFAULT_KEYWORDS}
                              ogUrl={"https://resumeguru.io/user/dashboard/mockInterview/with/"+withCompany[0]}
                              ogImageAlt={"ResumeGuru.IO - Mock Interview with "+withCompany[0]}
                              ogType={"website"}
                >
                <div className="text-center">

                    {searchedJob === "Job not found, please go back to previous page" ? (
                        <div className="text-center">

                            <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Job not found</h1>
                            <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">Sorry, we couldn’t
                                find the job you’re looking for.</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <a href={process.env.SITE_URL+"/jobs/search"} className="text-blue-500 hover:underline cursor-pointer"> Search for new jobs </a>

                            </div>
                        </div>
                    ):(
                        <div className="text-center">

                            <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-3xl">{searchedJob}</h1>

                        </div>
                    )}


                </div>
                </CommonLayout>
            )}

        </div>
    );
}


export async function getServerSideProps(context) {
    // Access the query parameter from the context
    const { withCompany } = context.query;

    return {
        props: {
            withCompany: withCompany || null, // Pass the query parameter as a prop to the component
        },
    };
}
