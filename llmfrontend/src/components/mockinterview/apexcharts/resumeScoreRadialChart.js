import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Tabs, Button, Tooltip, Label} from "flowbite-react";

import { FaRegCheckCircle, FaPlusCircle } from "react-icons/fa";
import { GrDocumentText, GrCircleInformation } from "react-icons/gr";
import {setResumeEditRightDrawer} from "../../../store/resumeEditReducer";

// Dynamically import ApexCharts to prevent server-side rendering issues


const ResumeScoreRadialChart = () => {
    const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
    const [chartOptions, setChartOptions] = useState(null);
    const resumeScore = useSelector(state => state.resumeScore)
    const dispatch = useDispatch();
    // console.log(resumeScore)

    useEffect(() => {

        const sectionCompletionScore = Number(resumeScore.sectionCompletion.totalScore);
        const contentQualityScore = Number(resumeScore.contentQuality.overviewTotalScore) + Number(resumeScore.contentQuality.workExperienceTotalScore);
        const totalScore = ((sectionCompletionScore + contentQualityScore)/2).toFixed(2);

        setChartOptions({
            series: [sectionCompletionScore, contentQualityScore], // The data series for the chart
            options: {
                colors: ["#1C64F2", "#16BDCA"], //, "#FDBA8C"
                chart: {
                    height: "380px",
                    width: "100%",
                    type: "radialBar",
                    events: {
                        dataPointSelection: function(event, chartContext, { dataPointIndex, w }) {
                            // Action triggered when a chart segment is clicked
                            // const value = w.config.series[dataPointIndex];  // Use dataPointIndex, not seriesIndex
                            // const label = w.config.labels[dataPointIndex];  // Use dataPointIndex to get correct label
                            // console.log(`Clicked on: ${label}, Score: ${value}`);

                        },

                    },
                },
                plotOptions: {
                    radialBar: {
                        track: {
                            background: '#E5E7EB',
                        },
                        dataLabels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '14px',
                                fontFamily: 'Helvetica, Arial, sans-serif',
                                color: '#333',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '14px',
                                fontFamily: 'Helvetica, Arial, sans-serif',
                                color: '#333',
                                offsetY: 16,
                                formatter: function (val) {
                                    return (val !== undefined && val !== null) ? val + "%" : ''; // Ensure val is defined
                                },
                            },
                            total: {
                                show: true,
                                label: 'Overall Score',
                                color: '#373d3f',
                                fontSize: '16px',
                                formatter: function (w) {
                                    return totalScore+'%'; // Customize this value
                                },
                            },
                        },
                        hollow: {
                            margin: 0,
                            size: "50%",
                        },
                    },
                },
                grid: {
                    show: false,
                    strokeDashArray: 4,
                    padding: {
                        left: 2,
                        right: 2,
                        top: -23,
                        bottom: -20,
                    },
                },
                labels: ["Basic Completion", "Content Quality"], // Labels corresponding to the data series
                tooltip: {
                    enabled: true,
                    x: {
                        show: false,
                    },
                },
                yaxis: {
                    show: false,
                    labels: {
                        formatter: function (value) {
                            return (value !== undefined && value !== null) ? value + '%' : ''; // Ensure value is defined
                        },
                    },
                },
            },
        });


    }, [resumeScore]);

    if (!chartOptions) {
        return <div>Loading chart...</div>;
    }


    return (
        <div id="radial-chart">
            <ApexCharts options={chartOptions.options} series={chartOptions.series} type="radialBar" height="380" />
            <Tabs aria-label="Tabs with underline" variant="underline" >
                <Tabs.Item active title="Completion" icon={GrCircleInformation} >
                    <div className="grid">
                        <div>
                            <Label className="text-xl text-[#1C64F2]"  value={"Completion : " + resumeScore.sectionCompletion.totalScore}/>

                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <p className="text-gray-500" title="Personal Info Section">Personal Info Section</p>
                                <Tooltip content="Personal information that you want to share with the agency/future company." style="light">
                                    <p className="text-gray-700 text-sm cursor-pointer">?</p>
                                </Tooltip>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex">
                                    <p className="text-gray-800 flex-grow" title="First Name">First Name</p>
                                    <div>
                                        {resumeScore.sectionCompletion.personalInfo.firstName > 0 ? (
                                            <Button  outline gradientDuoTone="greenToBlue" size="sm">
                                                <FaRegCheckCircle  className="mr-2 h-4 w-4 " color="green"/>Done
                                            </Button>
                                        ) : (
                                            <Button  outline gradientDuoTone="pinkToOrange" size="sm"
                                            onClick={() => {
                                                dispatch(setResumeEditRightDrawer(false));
                                            }}
                                            >
                                                <FaPlusCircle  className="mr-2 h-4 w-4 " color="red"/>Add
                                            </Button>
                                        )}

                                    </div>
                                </div>

                                <div className="flex">
                                    <p className="text-gray-800 flex-grow" title="Last Name">Last Name</p>
                                    <div>
                                        {resumeScore.sectionCompletion.personalInfo.lastName > 0 ? (
                                            <Button  outline gradientDuoTone="greenToBlue" size="sm">
                                                <FaRegCheckCircle  className="mr-2 h-4 w-4 " color="green"/>Done
                                            </Button>
                                        ) : (
                                            <Button  outline gradientDuoTone="pinkToOrange" size="sm"
                                                     onClick={() => {
                                                         dispatch(setResumeEditRightDrawer(false));
                                                     }}
                                            >
                                                <FaPlusCircle  className="mr-2 h-4 w-4 " color="red"/>Add
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex">
                                    <p className="text-gray-800 flex-grow" title="Email">Email</p>
                                    <div>
                                        {resumeScore.sectionCompletion.personalInfo.email > 0 ? (
                                            <Button  outline gradientDuoTone="greenToBlue" size="sm">
                                                <FaRegCheckCircle  className="mr-2 h-4 w-4 " color="green"/>Done
                                            </Button>
                                        ) : (
                                            <Button  outline gradientDuoTone="pinkToOrange" size="sm"
                                                     onClick={() => {
                                                         dispatch(setResumeEditRightDrawer(false));
                                                     }}
                                            >
                                                <FaPlusCircle  className="mr-2 h-4 w-4 " color="red"/>Add
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex">
                                    <p className="text-gray-800 flex-grow" title="Phone Number">Phone Number</p>
                                    <div>
                                        {resumeScore.sectionCompletion.personalInfo.phone > 0 ? (
                                            <Button  outline gradientDuoTone="greenToBlue" size="sm">
                                                <FaRegCheckCircle  className="mr-2 h-4 w-4 " color="green"/>Done
                                            </Button>
                                        ) : (
                                            <Button  outline gradientDuoTone="pinkToOrange" size="sm"
                                                     onClick={() => {
                                                         dispatch(setResumeEditRightDrawer(false));
                                                     }}
                                            >
                                                <FaPlusCircle  className="mr-2 h-4 w-4 " color="red"/>Add
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex">
                                    <p className="text-gray-800 flex-grow" title="Location">Location</p>
                                    <div>
                                        {resumeScore.sectionCompletion.personalInfo.location > 0 ? (
                                            <Button  outline gradientDuoTone="greenToBlue" size="sm">
                                                <FaRegCheckCircle  className="mr-2 h-4 w-4 " color="green"/>Done
                                            </Button>
                                        ) : (
                                            <Button  outline gradientDuoTone="pinkToOrange" size="sm"
                                                     onClick={() => {
                                                         dispatch(setResumeEditRightDrawer(false));
                                                     }}
                                            >
                                                <FaPlusCircle  className="mr-2 h-4 w-4 " color="red"/>Add
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div>
                            <div className="flex items-center">
                                <p className="text-gray-600" title="Summary Section">Summary Section</p>
                                <div className="relative">
                                    <div>
                                        <Tooltip placement="top" content="Including a summary or overview at the top of your resume can help job seekers make a strong first impression. It provides a concise snapshot of your skills, experience, and career goals, helping employers quickly understand what you bring to the table and why you’re a great fit for the role." style="light">
                                            <p className="text-gray-700 text-sm cursor-pointer">?</p>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex">
                                    <p className="text-gray-800 flex-grow" title="Work Experiences">Summary</p>
                                    <div>
                                        {resumeScore.sectionCompletion.summary > 0 ? (
                                            <Button  outline gradientDuoTone="greenToBlue" size="sm">
                                                <FaRegCheckCircle  className="mr-2 h-4 w-4 " color="green"/>Done
                                            </Button>
                                        ) : (
                                            <Button  outline gradientDuoTone="pinkToOrange" size="sm"
                                                     onClick={() => {
                                                         dispatch(setResumeEditRightDrawer(false));
                                                     }}
                                            >
                                                <FaPlusCircle  className="mr-2 h-4 w-4 " color="red"/>Add
                                            </Button>
                                        )}
                                    </div>
                                </div>



                            </div>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <p className="text-gray-600" title="Skills">Skills Section</p>
                                <div className="relative">
                                    <div>
                                        <Tooltip placement="top" content="Skills section on your resume is essential for showcasing your abilities that match the job requirements. It allows employers to quickly identify the key strengths you bring to the role, demonstrating your qualifications and making you stand out as a candidate. Be sure to include both technical and soft skills relevant to the position." style="light">
                                            <p className="text-gray-700 text-sm cursor-pointer">?</p>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex">
                                    <p className="text-gray-800 flex-grow" title="Skills">Skills</p>
                                    <div>
                                        {resumeScore.sectionCompletion.skills > 0 ? (
                                            <Button  outline gradientDuoTone="greenToBlue" size="sm">
                                                <FaRegCheckCircle  className="mr-2 h-4 w-4 " color="green"/>Done
                                            </Button>
                                        ) : (
                                            <Button  outline gradientDuoTone="pinkToOrange" size="sm"
                                                     onClick={() => {
                                                         dispatch(setResumeEditRightDrawer(false));
                                                     }}
                                            >
                                                <FaPlusCircle  className="mr-2 h-4 w-4 " color="red"/>Add
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <p className="text-gray-600" title="Work Experiences Section">Work Experiences Section</p>
                                <div className="relative">
                                    <div>
                                        <Tooltip placement="top" content="Include one or more work experience/project in this section of your resume" style="light">
                                            <p className="text-gray-700 text-sm cursor-pointer">?</p>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex">
                                    <p className="text-gray-800 flex-grow" title="Work Experiences">Work Experiences</p>
                                    <div>
                                        {resumeScore.sectionCompletion.workExperience > 0 ? (
                                            <Button  outline gradientDuoTone="greenToBlue" size="sm">
                                                <FaRegCheckCircle  className="mr-2 h-4 w-4 " color="green"/>Done
                                            </Button>
                                        ) : (
                                            <Button  outline gradientDuoTone="pinkToOrange" size="sm"
                                                     onClick={() => {
                                                         dispatch(setResumeEditRightDrawer(false));
                                                     }}
                                            >
                                                <FaPlusCircle  className="mr-2 h-4 w-4 " color="red"/>Add
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>


                </Tabs.Item>
                <Tabs.Item title="ContentQuality" icon={GrDocumentText}>
                    <div className="grid">
                        <div>
                            <Label className="text-xl text-[#16BDCA]"  value={"Content Quality : " + resumeScore.contentQuality.workExperienceTotalScore}/>
                        </div>

                        <div>
                            <div className="flex items-center">
                                <p className="text-gray-600" title="Work Experiences Section">Work Experiences Section</p>
                                <div className="relative text-center">
                                    <div>
                                        <Tooltip placement="top" content="Include one or more work experience/project in this section of your resume" style="light">
                                            <p className="text-gray-700 text-sm cursor-pointer">?</p>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            {resumeScore.contentQuality && resumeScore.contentQuality.workExperience.length > 0 && resumeScore.contentQuality.workExperience.map((experience, experienceIndex)=>(
                                <div className="flex flex-col gap-2" key={"experience_score_"+experienceIndex}>

                                    <div className="flex">
                                        <p className="text-gray-800 flex-grow" title="Work Experiences">Work Experiences {experienceIndex+1}</p>
                                        <div>
                                            {experience.score}
                                        </div>
                                    </div>
                                    {resumeScore.contentQuality.workExperience[experienceIndex].results && resumeScore.contentQuality.workExperience[experienceIndex].results.map((exp, expIndex)=>(
                                        <div className="flex" key={"experience_score_bulletpoint_"+experienceIndex+"_"+expIndex}>
                                            {/*Verbs : {exp.verbs}*/}
                                            {/*Bad Buzzwords : {exp.badBuzzwords}*/}
                                            {/*Content Length : {exp.contentLength.characterCount}*/}
                                            {/*Good Buzzwords : {exp.goodBuzzwords}*/}
                                            {/*Metrics : {exp.metrics}*/}
                                            Overall Score : {exp.score}
                                        </div>
                                    ))}

                                </div>
                            ))}

                        </div>



                    </div>
                </Tabs.Item>



            </Tabs>
        </div>
    );
};

export default ResumeScoreRadialChart;
