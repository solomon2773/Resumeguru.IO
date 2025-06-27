import React, {useContext, useEffect, useRef, useState, Fragment} from 'react'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
import createResumeSteps from "../../utils/staticObjects/dashboard/createResumeSteps";
import {CheckBadgeIcon, UsersIcon} from "@heroicons/react/24/outline";

const DataImportMethod = ({resumeProgressSelect}) => {
 // console.log(resumeBasicInfo)

  // const router = useRouter()

  const importMethods = [

    {
      title: 'Upload Your Resume or LinkedIn Profile',
      description: 'We will utilize AI technology to analyze your resume or LinkedIn profile and automatically fill in your resume format for you.',
      sTitle: createResumeSteps[2],
      icon: CheckBadgeIcon,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-50',
    },
    {
      title: 'Start from scratch',
      description: 'Build a standout resume from scratch. With this guided approach, highlight your skills and experiences effectively, ensuring you make a strong impression on potential employers.',
      sTitle: createResumeSteps[3],
      icon: UsersIcon,
      iconForeground: 'text-sky-700',
      iconBackground: 'bg-sky-50',
    },


  ]



  return (
      <div className="max-w-7xl px-2 py-4 sm:px-2 lg:px-2 lg:py-4 mx-auto">
        <div className="container mx-auto">
          <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="bg-white">
              <div className="pb-10 sm:pb-10">
                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-1 sm:gap-px sm:divide-y-0">
                  {importMethods.map((action, actionIdx) => (
                      <div
                          key={action.title}
                          className={classNames(
                              actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none text-center' : '',
                              actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                              actionIdx === importMethods.length - 2 ? 'sm:rounded-bl-lg text-center' : '',
                              actionIdx === importMethods.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none text-center' : '',
                              'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                          )}
                      >
                        <div>
                                                                <span
                                                                    className={classNames(
                                                                        action.iconBackground,
                                                                        action.iconForeground,
                                                                        'inline-flex rounded-lg p-3 ring-4 ring-white'
                                                                    )}
                                                                >
                                                                  <action.icon className="h-6 w-6" aria-hidden="true" />
                                                                </span>
                        </div>
                        <div
                            className="mt-8"
                            onClick={()=>{
                              resumeProgressSelect(action.sTitle);
                            }}
                        >
                          <h3 className="text-base text-center font-semibold leading-6 text-gray-900">
                            <div className="focus:outline-none cursor-pointer">
                              {/* Extend touch target to entire panel */}
                              <span className="absolute inset-0" aria-hidden="true" />
                              {action.title}
                            </div>
                          </h3>
                          <p className="mt-2 text-sm text-center text-gray-500">
                            {action.description}
                          </p>
                        </div>
                        <span
                            className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                            aria-hidden="true"
                        >
                                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                                                                </svg>
                                                              </span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  )
}
export default DataImportMethod;
