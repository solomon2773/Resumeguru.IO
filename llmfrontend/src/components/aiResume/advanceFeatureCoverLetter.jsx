import React, {useContext, useEffect, useRef, useState, Fragment} from 'react'
import { toast } from "react-toastify";

import aiModels from "../../utils/staticObjects/aiModels";
import contentTemplates from "../../utils/staticObjects/coverLetter/contentTemplates";
import {Menu, Transition, Switch, Dialog} from "@headlessui/react";
import {ChevronDownIcon, CheckIcon} from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const AdvanceFeatureCoverLetter = ({onSelectionChange, advanceFeatureInitial}) => {

  // const router = useRouter()


  const [selectedAiModel, setSelectedAiModel] = useState(advanceFeatureInitial.selectedAiModel);
  const [advanceSection, setAdvanceSection] = useState(advanceFeatureInitial.advanceSection);
  const [writingTone, setWritingTone] = useState(advanceFeatureInitial.writingTone || 'professional');
  const [paragraphLength, setParagraphLength] = useState(advanceFeatureInitial.paragraphLength || 250);
  const [selectedContentTemplate, setSelectedContentTemplate] = useState(advanceFeatureInitial.selectedContentTemplate || "");
  const [contentTemplateDetailsOpen, setContentTemplateDetailsOpen] = useState(false)
  const [coverletterExtraPrompt, setCoverletterExtraPrompt] = useState('');

  const coverletterExtraPromptRef = useRef("");
  const cancelButtonRef = useRef(null)


  const handleSelectAiModelChange = (event,aiModel) => {
    //event.preventDefault();
    setSelectedAiModel(aiModel);

  }
  const handleSelectContentTemplateChange = (event,contentTemplate) => {
    // console.log(contentTemplate)
    setSelectedContentTemplate(contentTemplate);
  }
  const handleSelectContentTemplateItems = (preNext,contentTemplate) => {
    const foundTemplate = contentTemplates.find(obj => obj.id === contentTemplate.id);
    if (preNext === "pre"){
        const index = contentTemplates.indexOf(foundTemplate);
        if (index > 0){
            setSelectedContentTemplate(contentTemplates[index-1]);
        } else {
            setSelectedContentTemplate(contentTemplates[contentTemplates.length-1]);
        }
    } else if (preNext === "next"){
        const index = contentTemplates.indexOf(foundTemplate);
        if (index < contentTemplates.length-1){
            setSelectedContentTemplate(contentTemplates[index+1]);
        } else {
            setSelectedContentTemplate(contentTemplates[0]);
        }

    }
  }

  const coverletterWritingTones = [
    { id: 'professional', title: 'Professional' },
    { id: 'casual', title: 'Casual' },
    { id: 'enthusiastic', title: 'Enthusiastic' },
    { id: 'informational', title: 'Informational' },
  ]

  const writingParagraphLength = [
    { id: 'short', title: 'Short', workingWords: 120 },
    { id: 'mid', title: 'Medium' , workingWords: 250},
    { id: 'long', title: 'Long' , workingWords: 350},
  ]
  const [selectedValue, setSelectedValue] = useState(advanceFeatureInitial);

  useEffect(() => {
    onSelectionChange(selectedValue);
  }, [selectedValue, onSelectionChange]);
  useEffect(() => {
    setSelectedValue( {
      selectedAiModel:selectedAiModel,
      coverletterExtraPromptRef:coverletterExtraPrompt ,
      advanceSection:advanceSection,
      paragraphLength:parseInt(paragraphLength),
      writingTone:writingTone,
        selectedContentTemplate:selectedContentTemplate
    });
  },[writingTone,advanceSection,paragraphLength,selectedAiModel,coverletterExtraPrompt, selectedContentTemplate])
  const handleAdvancedFeature =  (value) => {
    const splited_value = value.split('_');

    if(splited_value[0] === 'writingTone'){
      setWritingTone(splited_value[1]);
    } else if(splited_value[0] === 'paragraphLength'){
        setParagraphLength(splited_value[1]);
    } else if(splited_value[0] === 'coverletterExtraPrompt'){
      setCoverletterExtraPrompt(splited_value[1]);
    }



  }


  return (
      <div className="max-w-7xl px-0  sm:px-2 lg:px-0 lg:py-0 mx-auto">
      <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900 ">

        <div className="mx-auto max-w-2xl lg:max-w-7xl lg:px-0 ">
          <div className=" mt-2 ">
            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
              AI Model Selection :
            </label>
            <div className="mt-2 pb-2 border-b-2">
              <Menu as="div"
                    className="w-full relative inline-block text-left"
              >
                <div className="">
                  <Menu.Button
                      className="inline-flex w-full justify-left gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {selectedAiModel.modelDescription || 'Select an AI Model'}
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {aiModels.length > 0 && aiModels.map((aiModel, index) => {
                        return(
                            <Menu.Item key={"aiModelSelMenu_"+index}>
                              {({ active }) => (
                                  <div
                                      onClick={(e) => handleSelectAiModelChange(e,aiModel)}
                                      className={classNames(
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                          'block px-4 py-2 text-sm'
                                      )}
                                  >
                                    {aiModel.modelDescription}
                                  </div>
                              )}
                            </Menu.Item>
                        )

                      })}


                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className="align-middle block text-sm font-medium leading-6 text-gray-900 cursor-pointer"
              >
            Advanced GPT Prompt :
            <Switch

                  onChange={()=>{
                    setAdvanceSection(!advanceSection)

                  }}
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

          {!advanceSection && (

          <div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Writing Tone : </label>
              {/*<p className="text-sm text-gray-500"></p>*/}
              <fieldset className="mt-4">
                <legend className="sr-only">Writing Tone</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {coverletterWritingTones.map((coverletterWritingTone) => (
                      <div key={coverletterWritingTone.id} className="inline-block items-center">
                        <input
                            id={coverletterWritingTone.id}
                            name="coverletterWritingTone"
                            type="radio"
                            value={"writingTone_"+coverletterWritingTone.id}
                            onChange={(e) => {
                             // setWritingTone(e.target.value);
                              handleAdvancedFeature(e.target.value);
                            } }
                            defaultChecked={coverletterWritingTone.id === writingTone}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor={coverletterWritingTone.id} className="ml-2 mr-2 text-sm font-medium leading-6 text-gray-900">
                          {coverletterWritingTone.title}
                        </label>
                      </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Paragraph length : </label>
              {/*<p className="text-sm text-gray-500"></p>*/}
              <fieldset className="mt-4">
                <legend className="sr-only">Paragraph length</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {writingParagraphLength.map((eachParagraphLength) => (
                      <div key={eachParagraphLength.id} className="inline-block items-center">
                        <input
                            id={eachParagraphLength.id}
                            name="paragraphLength"
                            type="radio"
                            value={"paragraphLength_"+eachParagraphLength.workingWords}
                            onChange={(e) => {
                              //setParagraphLength(e.target.value);
                              handleAdvancedFeature(e.target.value);
                            } }
                            defaultChecked={eachParagraphLength.workingWords === paragraphLength}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor={eachParagraphLength.id} className="ml-2 mr-2 text-sm font-medium leading-6 text-gray-900">
                          {eachParagraphLength.title}
                        </label>
                      </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className=" mt-2 ">
              <div>
                <label htmlFor="contentTemplate" className="block text-sm font-medium leading-6 text-gray-900">
                  Cover Letter Content Template :
                  <div className="inline-block text-blue-500 cursor-pointer ml-2"
                          onClick={() => {
                            setContentTemplateDetailsOpen(!contentTemplateDetailsOpen);
                          }}
                > Details</div>
                </label>

              </div>

              <div className="mt-2 pb-2 border-b-2"

              >
                <Menu as="div"
                      className="w-full relative inline-block text-left"
                      id="contentTemplate"
                      name="contentTemplate"
                >
                  <div className="">
                    <Menu.Button
                        className="inline-flex w-full justify-left gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      {selectedContentTemplate.sourceName || 'Select a Content Template'}
                      <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>
                  </div>

                  <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {contentTemplates.length > 0 && contentTemplates.map((contentTemplate, index) => {
                          return(
                              <Menu.Item key={"coverLetterContentTemplateSelMenu_"+index}>
                                {({ active }) => (
                                    <div
                                        onClick={(e) => handleSelectContentTemplateChange(e,contentTemplate)}
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                      {contentTemplate.sourceName}
                                    </div>
                                )}
                              </Menu.Item>
                          )

                        })}


                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>

          </div>
            )}




          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">

            {advanceSection &&
            <div className="mt-4 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              {/*<label className="text-base font-semibold text-gray-900 ">*/}
              {/*  Advanced Prompt Section :*/}
              {/*</label>*/}

              <div className="grid grid-cols-1  lg:gap-8">
                <div className="">
                  {/*<label className="text-base font-semibold text-gray-900">Must have ingredients</label>*/}
                  {/*<p className="text-sm text-gray-500">What are the must have ingredients you want to use for this recipe? </p>*/}
                  <fieldset className="">
                    <div className="space-y-2 sm:block  w-full h-auto">
                      <div className="">
                        <div className="">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Cover letter advanced GPT prompt :
                          </label>
                          <div>
                            <h2 className="sr-only">Cover letter advanced GPT prompt :</h2>
                            <label htmlFor="coverletterExtraPrompt"
                                   className="block text-sm font-medium leading-6 text-gray-900">
                              Extra prompt for the AI model to tailed the cover letter result to your needs. You can
                              ask for a specific tone to write the cover letter, return paragraph length, adding new
                              requirements, follow a well known template or even add a humor joke to the cover letter .
                            </label>
                            <div className="mt-2">
                            <textarea
                                rows={3}
                                name="coverletterExtraPrompt"
                                id="coverletterExtraPrompt"
                                ref={coverletterExtraPromptRef}
                                onChange={(e) => {
                                    handleAdvancedFeature("coverletterExtraPrompt_"+e.target.value);
                                }}

                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="EX: please make it 550 words with a easy tone. adding a bit of humor is a plus a joke."
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

          </div>



        </div>

    </div>
        <Transition.Root show={contentTemplateDetailsOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setContentTemplateDetailsOpen}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                      {/*<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">*/}
                      {/*  <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />*/}
                      {/*</div>*/}
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          {selectedContentTemplate.sourceName}
                        </Dialog.Title>
                        <div className="mt-2 bg-gray-50 p-2 ">
                          <div className="text-sm text-gray-800 text-left">{selectedContentTemplate.structureExplain && selectedContentTemplate.structureExplain}</div>

                          <div className="text-sm text-gray-800 text-left mt-3">
                            <span className="text-black font-bold">Cover letter structure details :</span>
                            {selectedContentTemplate.structureDetails && selectedContentTemplate.structureDetails.Introduction && (
                                <div className="m-2"> <span className="text-black font-bold">[Introduction] : </span>{selectedContentTemplate.structureDetails.Introduction} </div>
                            )}
                            {selectedContentTemplate.structureDetails && selectedContentTemplate.structureDetails.Body && (
                                <div className="m-2"> <span className="text-black font-bold">[Main Body] : </span>{selectedContentTemplate.structureDetails.Body} </div>
                            )}
                            {selectedContentTemplate.structureDetails && selectedContentTemplate.structureDetails.Conclusion && (
                                <div className="m-2"> <span className="text-black font-bold">[Conclusion] : </span>{selectedContentTemplate.structureDetails.Conclusion} </div>
                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-3 sm:gap-3">
                      <button
                          type="button"
                          className="mt-1 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={() => {

                            handleSelectContentTemplateItems("pre",selectedContentTemplate);
                          }}
                      >
                        Previous
                      </button>
                      <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600  sm:col-start-2"
                          onClick={() =>
                          {
                            setContentTemplateDetailsOpen(false)
                            setSelectedContentTemplate(selectedContentTemplate)
                          }}
                      >
                        Use this template
                      </button>
                      <button
                          type="button"
                          className="mt-1 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-3 sm:mt-0"
                          onClick={() => {

                            handleSelectContentTemplateItems("next",selectedContentTemplate);
                          }}

                      >
                        Next
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
  )
}
export default AdvanceFeatureCoverLetter;
