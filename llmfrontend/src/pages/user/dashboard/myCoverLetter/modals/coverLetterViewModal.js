import { Button, Modal, Card } from "flowbite-react";
import {useDispatch, useSelector} from 'react-redux';
import { setClData } from "../../../../../store/coverLetterReducer";

const CoverLetterViewModal = ({ setIsModalOpenCoverLetter, isModalOpenCoverLetter,coverLetterPopupData, coverLetterCandidateStrength, coverLetterAiGenerated, setIsModalOpenSelectTemplate }) => {

    const user = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();

  const handleSelectClTemplate = () => {

    const coverLetterLines = coverLetterAiGenerated.replace(/Dear Hiring Manager,[\n\n|\n\s]*/g, "").replace(/\\n|\n\n|\n/g, "\n").split(/\\n|\n\n|\n/).map((line, index) => {
        return {  line };
    });
    const top4Strengths = coverLetterCandidateStrength.slice(0, 4).map((strength, index) => {
        return {  strength };
    });


    //console.log(user)
    // Set the template data
    const data = {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "phoneNo":user.phoneNumber ? user.phoneNumber : "123-123-1234",
        "city":user.city ? user.city : "My Location",
        "coverLetterAiGenerate":coverLetterLines,
        "coverLetterCandidateStrengthMessageContent":top4Strengths,

    };
    dispatch(setClData(data));
    setIsModalOpenCoverLetter(false);
    setIsModalOpenSelectTemplate(true);
  }
  return (
    <Modal show={isModalOpenCoverLetter} size="7xl"  onClose={() => setIsModalOpenCoverLetter(false)}>
      <Modal.Header>
        Cover Letter View
      </Modal.Header>
      <Modal.Body>
        <div className="relative p-4 w-full max-w-7xl h-full ">
          <div class="flow-root">
            <p class="float-left"></p>
            <p class="float-right">
            {coverLetterPopupData ? (
              <>
                <Button
                  className="flex" outline
                  onClick={ () => {handleSelectClTemplate()}}
                  gradientDuoTone="purpleToBlue"
                >
                  Select Cover Letter Download Template
                </Button>
              </>
              ) : (
                <>
                </>
              ) }
            </p>
          </div>

          <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            {coverLetterPopupData ? (
              <div >
                <div className="gap-4 m-2 ">
                  <div>
                    <label htmlFor="companyName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name
                    </label>
                    <input type="text" name="companyName" id="companyName"
                      value={coverLetterPopupData.userContent.companyName + ' sdfasdfasd'}
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="jobTitle"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title
                    </label>
                    <input type="text" name="jobTitle" id="jobTitle"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={coverLetterPopupData.userContent.jobTitle}
                      readOnly
                    />
                  </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="coverLetterAiGenerated"
                        className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Letter Detail :
                      </label>
                      <div className="mt-2 p-2 bg-gray-50 border border-gray-300 rounded-lg">
                        {coverLetterAiGenerated.split(/\\n|\n/).map((line, index) => (
                          <p key={"coverLetterAiGenerate_"+index} className="indent-8 mb-4">{line}</p>
                        ))}
                        <li className="flex justify-between py-2 pl-2 pr-2 text-sm leading-6">
                          <div className="flex flex-wrap justify-start ">
                            {coverLetterCandidateStrength && coverLetterCandidateStrength.map((candidateStrength,candidateStrengthIndex)=>{
                              return(
                                <div key={"coverLetterCandidateStrength_"+candidateStrengthIndex} className="text-sm font-small leading-6 bg-blue-500 text-white py-2 px-2 m-1  flex items-center justify-center ">{candidateStrength}</div>
                              )
                            })}
                          </div>
                        </li>
                        </div>
                    </div>
                </div>
              </div>
            ):(
              <div className="text-center">
                <div role="status">
                  <svg aria-hidden="true"
                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                  </svg>
                    Loading...
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
            )}
          </div>
        </div>
    </Modal.Body>

  </Modal>
  )
}

export default CoverLetterViewModal;
