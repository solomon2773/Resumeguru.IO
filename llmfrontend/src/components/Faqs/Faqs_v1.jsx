export function Faqs_v1({faq_questions}) {
  return (
      <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
              <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                  <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
                  <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                        {faq_questions && faq_questions.map((faq, faqIndex) => (
                            <div className="pt-6" key={"faq_"+faqIndex}>
                                <dt>

                                    <button type="button"
                                            onClick={() => {
                                                const faqAnswer = document.getElementById("faq_answer_"+faqIndex);
                                                const faqQuestionPlus = document.getElementById("faq_question_plus_"+faqIndex);
                                                const faqQuestionMinus = document.getElementById("faq_question_minus_"+faqIndex);
                                              if (faqAnswer.classList.contains("hidden")) {
                                                  faqAnswer.classList.remove("hidden");
                                                  faqQuestionPlus.classList.add("hidden");
                                                  faqQuestionMinus.classList.remove("hidden");
                                              } else {
                                                    faqAnswer.classList.add("hidden");
                                                    faqQuestionPlus.classList.remove("hidden");
                                                    faqQuestionMinus.classList.add("hidden");
                                              }

                                            }}
                                            className="flex w-full items-start justify-between text-left text-gray-900"
                                            aria-controls="faq-0" aria-expanded="false">
                                      <span className="text-base font-semibold leading-7" id={"faq_question_"+faqIndex} name={"faq_question_"+faqIndex}>{faq.question}</span>
                                      <span className="ml-6 flex h-7 items-center">
                                          <svg  id={"faq_question_plus_"+faqIndex} name={"faq_question_plus_"+faqIndex}
                                              className={`h-6 w-6 ${faq.open && "hidden"}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                               stroke="currentColor" aria-hidden="true">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"/>
                                          </svg>
                                          <svg id={"faq_question_minus_"+faqIndex} name={"faq_question_minus_"+faqIndex}
                                              className={`h-6 w-6 ${!faq.open && "hidden"}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                               stroke="currentColor" aria-hidden="true">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6"/>
                                          </svg>
                                      </span>
                                    </button>
                                </dt>
                                <dd className={`mt-2 pr-12 ${!faq.open && "hidden"}`} id={"faq_answer_"+faqIndex}  name={"faq_answer_"+faqIndex}>
                                    <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                                </dd>
                            </div>
                            ))}


                  </dl>
              </div>
          </div>
      </div>
  )
}

