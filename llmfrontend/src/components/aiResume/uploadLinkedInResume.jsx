import { useState} from 'react'
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";
import {uploadFilePrivate, uploadFilePublic} from "../../helpers/s3/s3client";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
import createResumeSteps from "../../utils/staticObjects/dashboard/createResumeSteps";
import {useSelector} from "react-redux";

const UploadLinkedInResume = ({resumeData, resumeProgressSelect, linkedInUploadStatus}) => {

  // console.log(resumeData)
  //   console.log(resumeProgressSelect)
  // const router = useRouter()
    const user = useSelector(state => state.user.profile);
  const [ linkedinResumeUploadStatus, setLinkedinResumeUploadStatus] = useState(false);
  const [analyzeDocumentRequest, setAnalyzeDocumentRequest] = useState(false);
  const [analyzeDocumentResult, setAnalyzeDocumentResult] = useState(false);
  const [fileName, setFileName] = useState("");


 // console.log(analyzeDocumentRequest)
  //  console.log(analyzeDocumentResult)

  const handleSubmitResume = async () => {
    setLinkedinResumeUploadStatus(false);
    setAnalyzeDocumentRequest(false);
    setAnalyzeDocumentResult(false);

    const files = document.getElementById("linkedin-resume-file-upload").files;
    if (!files.length) {
      toast.error("Please choose a file to upload first.");
      return ;
    }
    const file = files[0];
    let fileInfo = {};
    const reader = new FileReader();
    if (file) {
      const fileType = file.type;
        setLinkedinResumeUploadStatus(true);
        setAnalyzeDocumentRequest(true);


      if (fileType === 'application/pdf' ) {
        // console.log('File is in accepted format.');
          try{
              const fileNameBuffer = encodeURIComponent(file.name.replace(/ /g, '-'));
              fileInfo = {
                  data: file,
                  userId: user.userId,
                  type: file.type,
                  size: file.size,
                  name: fileNameBuffer,

              };
              reader.readAsDataURL(file);
              reader.onloadend = async () => {

                  const uploadUrl = await uploadFilePublic('userResumeUpload', fileInfo);

                  setFileName(fileNameBuffer);
                  setLinkedinResumeUploadStatus(false);
                  const responsePDFJPGconvert = await fetch(process.env.SITE_URL + '/api/pdfResumeUpload/pdfJPGConvertImageMagic', {
                      method: 'POST',
                      body: JSON.stringify({
                          userId: user.userId,
                          fileName : fileNameBuffer,
                      }),
                      headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
                      }
                  });
                  const resultPDFJPGconvert = await responsePDFJPGconvert.json();
                   // console.log(resultPDFJPGconvert)
                  if (!resultPDFJPGconvert.status) {
                      setAnalyzeDocumentRequest(false);
                      setAnalyzeDocumentResult(false);
                      setLinkedinResumeUploadStatus(false);
                      resumeProgressSelect(createResumeSteps[2]);
                      return toast.error("Error . Please try again later.")
                  }

                  resumeData({
                      resumeJPGImages: resultPDFJPGconvert.resumeJPGImages
                  });

                  linkedInUploadStatus(true);
                  // setAnalyzeDocumentResult(resultPDFJPGconvert.resumeJPGImages);
                  resumeProgressSelect(createResumeSteps[3]);

              };
              // await analyzeDocument(
              //     process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC + "/userResumeUpload/" + user.userId + "/" + fileNameBuffer,
              //     fileInfo);

          } catch (e) {
              console.log(e)
              setAnalyzeDocumentRequest(false);
              setAnalyzeDocumentResult(false);
              setLinkedinResumeUploadStatus(false);

              toast.error("Error analyzing document status check. Please try again.");
          }



      } else {
        // console.log('File is not in accepted format.');
          setAnalyzeDocumentRequest(false);
          setAnalyzeDocumentResult(false);
          setLinkedinResumeUploadStatus(false);
        toast.error("File is not in accepted format. PDF only.");
        return ;
      }

    }




  }
  return (
      <div className="max-w-7xl px-2 py-4 sm:px-2 lg:px-2 lg:py-4 mx-auto">

        <div className="bg-gray-50 rounded-xl shadow dark:bg-slate-900 pt-4 pb-4">
        <div className="container mx-auto">
          <div className="">

            <div className="pb-10 sm:pb-10">
              {/*<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">*/}
              {/*  <h1 className="text-center">AI Resume Revolution: Refining and Rewriting the Future</h1>*/}

              {/*</div>*/}


              <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                {analyzeDocumentRequest && !analyzeDocumentResult ? (
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Spinner aria-label="Resume Uploading and Processing" size="xl"/>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-900">
                                Analyzing your resume. It can take up to 60 seconds. Please wait...
                            </p>
                        </div>
                    </div>
                ) :(

                    <div className="col-span-full bg-white p-4 ">
                      <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        This tool is specifically design for extracting PDF format resume. We will analyze your resume and populate the fields for you to edit and generate your new targeted resume. This tool is limited to pick up up to 10 pages. If you have more than 10 pages, you can add the remaining data manually in the next screen.
                      </label>
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-blue-900">
                            Beta Version: This tool is still in beta version. If you have any feedback, please email us at <a  href="mailto:info@resumeguru.io">info@resumeguru.io</a>
                        </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          {/*<PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />*/}
                          <div className="mt-4  text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="linkedin-resume-file-upload"
                                className="text-center relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload your Public LinkedIn Profile Here or other resume in PDF format</span>
                              <input id="linkedin-resume-file-upload" name="linkedin-resume-file-upload" type="file" onChange={handleSubmitResume} className="sr-only" />
                            </label>
                            {/*<p className="pl-1">or drag and drop</p>*/}
                          </div>
                          <p className="text-xs leading-5 text-gray-600">PDF ONLY</p>
                        </div>
                      </div>
                    </div>
                )}




              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
  )
}
export default UploadLinkedInResume;
