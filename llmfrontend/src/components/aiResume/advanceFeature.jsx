import React, {useContext, useEffect, useRef, useState, Fragment} from 'react'
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import UserQuickCreateContext from '../../context/UserQuickCreateContext'
import { estimateTokenCount } from "../../utils/openAi";
import aiModels from "../../utils/staticObjects/aiModels";
import {Menu, Transition, Switch, Combobox} from "@headlessui/react";
import {CheckIcon, ChevronDownIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
import createResumeSteps from "../../utils/staticObjects/dashboard/createResumeSteps";
import {Modal} from "flowbite-react";

import {useSelector} from "react-redux";

const AdvanceFeature = ({advanceFeature,resumeProgressSelect}) => {

  // const router = useRouter()
  const { } = useAuth()
  const user = useSelector(state => state.user.profile);
  const [selectedAIModel, setSelectedAIModel] = useState(aiModels[0])
  const [advanceSection, setAdvanceSection] = useState(false);
  const [writingTone, setWritingTone] = useState("professional");
    const [paragraphLength, setParagraphLength] = useState(150);
  const [workExperienceParagraphLayout, setWorkExperienceParagraphLayout] = useState("bullet");
  // console.log("jobDescriptionResult", jobDescriptionResult);
  // console.log("resumeObjectId", resumeObjectId);

  const overviewExtraPromptRef = useRef("");
  const professionalExperienceExtraPromptRef = useRef("");

  const { closeOverlay, openOverlay } = useContext(UserQuickCreateContext);

  //console.log("templateList", templateList);



  const overviewTones = [
    { id: 'professional', title: 'Professional' },
    { id: 'casual', title: 'Casual' },
    { id: 'enthusiastic', title: 'Enthusiastic' },
    { id: 'informational', title: 'Informational' },
  ]

  const writingParagraphLength = [
    { id: 'short', title: 'Short(around 100 words)', workingWords: 100 },
    { id: 'mid', title: 'Medium(around 150 words)' , workingWords: 150},
    { id: 'long', title: 'Long(around 200 words)' , workingWords: 250},
  ]
  const workExperienceLayouts = [
    { id: 'paragraph', title: 'Paragraph Style',  },
    { id: 'bullet', title: 'Bullet Point Style' },
    // { id: 'paragraphBullet', title: 'Both Paragraph & Bullet Point' },
  ];
  // console.log(templateList)
  // console.log(selectedTemplateOption)

  const handleResumeProcessing = async (e) => {
    e.preventDefault();

    if (!user){
      openOverlay();
      return;
    }

    if ( workExperienceParagraphLayout === "bullet" && bulletPointsCount < 1){
      toast.error("Please enter how many bullet points you wish to generate");
      return;
    }



    const advanceFeatureData = {
      selectedAiModel:selectedAIModel,
      overviewExtraPromptRef:advanceSection && overviewExtraPromptRef.current.value ,
      professionalExperienceAdvancedPrompt:advanceSection && professionalExperienceExtraPromptRef.current.value,
      advanceSection:advanceSection,
      paragraphLength:paragraphLength,
      workExperienceParagraphLayout:workExperienceParagraphLayout,
      bulletPointsCount:bulletPointsCount,
      writingTone:writingTone,
    }

    // All features are now free - no credit restrictions
    // console.log( "jdExtractorSubmitOriginalData", jdExtractorSubmitOriginalData);
    advanceFeature(advanceFeatureData);
    resumeProgressSelect(createResumeSteps[5]);

  }

  const [queryField, setQueryField] = useState('')

  const fieldorDomains = aiModels;
  const filteredAIModel =
      queryField === ''
          ? fieldorDomains
          : fieldorDomains.filter((field) => {
            return field.name.toLowerCase().includes(queryField.toLowerCase())
          })


  const [advancedPromptTokenCount, setAdvancedPromptTokenCount] = useState(0);
  const handleAdvancedPromptOverviewChange = (event) => {
    estimateTokenCount(event.target.value, 1.1).then((result) => {
      setAdvancedPromptTokenCount(result);
    });

  }
  const professionalExperienceExtraPrompt = (event) => {
    estimateTokenCount(event.target.value, 1.1).then((result) => {
      setAdvancedPromptTokenCount(result);
    });

  }

  const [bulletPointsCount , setBulletPointsCount] = useState(3);
  return (
      <div className="max-w-7xl px-2 py-4 sm:px-2 lg:px-2 lg:py-4 mx-auto">

      <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900 pt-4 pb-4">





        <div className="mx-auto mt-4 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 ">




          {!advanceSection && (

          <div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Overview Writing Tone : </label>
              {/*<p className="text-sm text-gray-500"></p>*/}
              <fieldset className="mt-4">
                <legend className="sr-only">Overview Writing Tone</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {overviewTones.map((overviewTone) => (
                      <div key={overviewTone.id} className="flex items-center">
                        <input
                            id={overviewTone.id}
                            name="overviewTone"
                            type="radio"
                            value={overviewTone.id}
                            onClick={(e) => {setWritingTone(e.target.value)} }
                            defaultChecked={overviewTone.id === writingTone}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor={overviewTone.id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                          {overviewTone.title}
                        </label>
                      </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>


              <label className="block text-sm font-medium leading-6 text-gray-900">Work Experience Section Style : </label>
              {/*<p className="text-sm text-gray-500"></p>*/}
              <fieldset className="mt-4">
                <legend className="sr-only">Work Experience Section Style</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {workExperienceLayouts.map((eachParagraphStyle) => (
                      <div key={eachParagraphStyle.id} className="flex items-center">
                        <input
                            id={eachParagraphStyle.id}
                            name="workExperienceParagraphLayout"
                            type="radio"
                            value={eachParagraphStyle.id}
                            onClick={(e) => {setWorkExperienceParagraphLayout(e.target.value)} }
                            defaultChecked={eachParagraphStyle.id === workExperienceParagraphLayout}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor={eachParagraphStyle.id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                          {eachParagraphStyle.title}
                        </label>
                      </div>
                  ))}
                </div>
              </fieldset>
              {workExperienceParagraphLayout === 'bullet' && (
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">How many bullet points : (minimum)</label>
                        <input
                            type="number"
                            name="bulletPoints"
                            id="bulletPoints"
                            value={bulletPointsCount}
                            onChange={(e) => {setBulletPointsCount(e.target.value)}}
                            className="text-center mt-1 block w-1/4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
              )}
              <label className="block text-sm font-medium leading-6 text-gray-900">Each Paragraph length : </label>
              {/*<p className="text-sm text-gray-500"></p>*/}
              <fieldset className="mt-4">
                <legend className="sr-only">Each Paragraph length</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {writingParagraphLength.map((eachParagraphLength) => (
                      <div key={eachParagraphLength.id} className="flex items-center">
                        <input
                            id={eachParagraphLength.id}
                            name="paragraphLength"
                            type="radio"
                            value={eachParagraphLength.workingWords}
                            onClick={(e) => {setParagraphLength(e.target.value)} }
                            defaultChecked={eachParagraphLength.workingWords === paragraphLength}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor={eachParagraphLength.id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                          {eachParagraphLength.title}
                        </label>
                      </div>
                  ))}
                </div>
              </fieldset>

            </div>



          </div>
            )}

          <div className="align-middle block text-sm font-medium leading-6 text-gray-900 cursor-pointer p-5"
          >
            Advanced Prompt :
            <Switch
                checked={advanceSection}
                onChange={()=>{setAdvanceSection(!advanceSection)}}
                className={classNames(
                    advanceSection ? 'bg-indigo-600' : 'bg-gray-200',
                    'align-middle m-5 flex relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                )}
            >
              <span className="sr-only">Use setting</span>
              <span
                  aria-hidden="true"
                  className={classNames(
                      advanceSection ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  )}
              />
            </Switch>


          </div>


          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">

            {advanceSection &&
            <div className="mt-4 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              {/*<label className="text-base font-semibold text-gray-900 ">*/}
              {/*  Advanced Prompt Section :*/}
              {/*</label>*/}
              <div className="col-start-1 col-end-5 mt-2 ">
                <Combobox as="div" value={selectedAIModel} onChange={setSelectedAIModel}>
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">AI Model Selection :</Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Button className="w-full inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <Combobox.Input
                          id="workFieldInput"
                          readOnly
                          className={` cursor-default w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                          // onChange={(event) => {
                          //   handleSelectAiModelChange(event);
                          // }}
                          displayValue={(field) => field?.modelDescription}
                      />
                    </Combobox.Button>
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>

                    {filteredAIModel.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredAIModel.map((level) => (
                              <Combobox.Option
                                  key={level.modelNameId}
                                  value={level}
                                  className={({ active }) =>
                                      classNames(
                                          'relative cursor-default select-none py-2 pl-3 pr-9',
                                          active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                      )
                                  }
                              >
                                {({ active, selected }) => (
                                    <>
                                      <span className={classNames('block truncate', selected && 'font-semibold')}>{level.modelDescription}</span>

                                      {selected && (
                                          <span
                                              className={classNames(
                                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                                  active ? 'text-white' : 'text-indigo-600'
                                              )}
                                          >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      )}
                                    </>
                                )}
                              </Combobox.Option>
                          ))}
                        </Combobox.Options>
                    )}
                  </div>
                </Combobox>
              </div>
              <div className="grid grid-cols-1  lg:gap-8">
                <div className="">
                  {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                  {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                  <fieldset className="">


                    <div className="space-y-2 sm:block  w-full h-auto">

                      <div className="mt-2">



                        <div className="p-2 mb-3  ">

                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Overview/Summary extra prompt :
                          </label>
                          <div>
                            <h2 className="sr-only">Overview/Summary extra prompt :</h2>
                            <label htmlFor="overviewExtraPrompt"
                                   className="block text-sm font-medium leading-6 text-gray-900">
                              Extra prompt for the AI model to tailed the Overview/Summary result to your needs. You can
                              ask for a specific tone that not available on a standard one, return paragraph length, or even adding new
                              requirements.(Optional)
                            </label>
                            <div className="mt-2">
                            <textarea
                                rows={3}
                                name="overviewExtraPrompt"
                                id="overviewExtraPrompt"
                                ref={overviewExtraPromptRef}
                                onChange={(e) => {
                                  handleAdvancedPromptOverviewChange(e)
                                }}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="EX: please make it 250 words with a formal tone. adding a bit of humor is a plus."
                            />

                            </div>


                          </div>
                        </div>


                      </div>
                      <div className="mt-2">

                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Professional experience extra prompt :
                        </label>

                        <div className="p-2 mb-3 border-b-2 ">
                          <div>
                            <h2 className="sr-only">Professional experience extra prompt :</h2>
                            <label htmlFor="professionalExperience"
                                   className="block text-sm font-medium leading-6 text-gray-900">
                              Extra prompt for the AI model to tailed the Professional experience result to your needs.
                              You can ask for a specific tone, return paragraph length, or even adding new
                              requirements.(Optional)
                            </label>
                            <div className="mt-2">
                            <textarea
                                rows={3}
                                name="professionalExperienceExtraPrompt"
                                id="professionalExperienceExtraPrompt"
                                ref={professionalExperienceExtraPromptRef}
                                onChange={(e) => {
                                  professionalExperienceExtraPrompt(e)
                                }}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="EX: please make it 250 words with a formal tone."
                            />

                            </div>


                          </div>
                        </div>


                      </div>
                    </div>


                  </fieldset>
                </div>
              </div>


            </div>
            }
            <div className="mt-8 lg:col-span-12">

                  <div
                      onClick={handleResumeProcessing}
                      className="cursor-pointer w-full group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                  >

                    Create AI Resume
                  </div>

            </div>
          </div>



        </div>

    </div>


      </div>
  )
}
export default AdvanceFeature;
