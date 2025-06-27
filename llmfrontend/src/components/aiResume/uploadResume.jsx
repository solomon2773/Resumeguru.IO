import {useContext, useEffect, useRef, useState} from 'react'
import { toast } from "react-toastify";
import {uploadFilePrivate} from "../../helpers/s3/s3client";
import {parseResumeFromPdf} from "../../helpers/parse-resume-from-pdf"
import {useSelector} from "react-redux";



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const UploadResume = () => {

  // const router = useRouter()
  const user = useSelector(state => state.user.profile);
  const [ resumeUploadStatus, setResumeUploadStatus] = useState(false);



  const handleSubmitResume = async () => {
    setResumeUploadStatus(false);
    const files = document.getElementById("resume-file-upload").files;
    if (!files.length) {
      toast.error("Please choose a file to upload first.");
      return ;
    }
    const file = files[0];
    const reader = new FileReader();
    if (file) {
      const fileType = file.type;

      if (fileType === 'application/pdf' || fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // console.log('File is in accepted format.');
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          if (fileType === 'application/pdf') {
            try {
              const blobUrl = URL.createObjectURL(file);
              const resume = await parseResumeFromPdf(blobUrl);
              console.log(resume);
            //  console.log(`PDF loaded with ${pdf.numPages} pages.`);
            } catch (error) {
                // console.log(error);
              toast.error("Invalid PDF format.");
              return;
            }
          }
          const base64String = reader.result;
          const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');

          const fileNameBuffer = encodeURIComponent(file.name.replace(/ /g, '-'));
          // setProfileImage(process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/" + user.profileImage.bucket+"/"+user.userId+"/"+fileNameBuffer);
          uploadFilePrivate('userResumeUpload', {
            data: buffer,
            userId: user.userId,
            type: file.type,
            size: file.size,
            name: fileNameBuffer,

          })
              .then((data) => {
                setResumeUploadStatus(true);
                // console.log(data.$metadata)
                // updateMergeUserData(user.userId,
                //     {
                //       profileImage:{
                //         // location:data.Location,
                //         key:user.userId+"/"+fileNameBuffer,
                //         bucket:"userProfileImages",
                //         size:file.size,
                //         type:file.type,
                //       },
                //     }).then((data) =>{
                //   toast.success('Profile picture updated successfully');
                //   window.location.reload();
                // })

              })
        };
      } else {
        // console.log('File is not in accepted format.');
        toast.error("File is not in accepted format.");
        return ;
      }

    }




  }
  return (
      <section className="pt-2 pb-2">
      <div className="container mx-auto">
        <div className="bg-white">

          <div className="pb-10 sm:pb-10">
            {/*<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">*/}
            {/*  <h1 className="text-center">AI Resume Revolution: Refining and Rewriting the Future</h1>*/}

            {/*</div>*/}


            <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">

              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Upload your Resume / CV
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {/*<PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />*/}
                    <div className="mt-4  text-sm leading-6 text-gray-600">
                      <label
                          htmlFor="resume-file-upload"
                          className="text-center relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="resume-file-upload" name="resume-file-upload" type="file" onChange={handleSubmitResume} className="sr-only" />
                      </label>
                      {/*<p className="pl-1">or drag and drop</p>*/}
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PDF, DOCX up to 20MB</p>
                  </div>
                </div>
              </div>



            </div>
          </div>
        </div>
      </div>
      </section>
  )
}
export default UploadResume;
