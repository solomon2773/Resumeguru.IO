import { Modal } from "flowbite-react";
import { useState, useEffect } from 'react'
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from 'file-saver';
import ClTemplatesModal from "../../../../../components/aiResume/modals/clTemplatesModal";
import {Pricing_Popup_Box} from "../../../../../components/Pricing/Pricing_Popup_Box";
import {mongodbGetResumeTemplate} from "../../../../../helpers/mongodb/pages/user/docTemplate";
import {mongodbGetCurrentUserInvoice} from "../../../../../helpers/mongodb/components/pricing";
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';


const ClSelectTemplateModal = ({ isModalOpenSelectTemplate, setIsModalOpenSelectTemplate}) => {

  const [templateList, setTemplateList] = useState([]);
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateLoading, setTemplateLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedHTMLTemplate, setSelectedHTMLTemplate] = useState(false);
  const [openPricingModal, setOpenPricingModal] = useState(false);
  const clTemplateData = useSelector(state => state.coverLetterEdit.clData)

  const user = useSelector((state) => state.user.profile);

  useEffect(() => {
    if (user) {
        mongodbGetCurrentUserInvoice(user.userId).then((res) => {
            if (res.length > 0){
              setIsSubscribed(true);
            }
        })
    }
  }, [user])

  useEffect(()=>{

    mongodbGetResumeTemplate("coverletter").then((res) => {
      if(res && res.length > 0){
        setTemplateList(res);
      }
      setTemplateLoading(false);
    }).catch((error) => {
      setTemplateLoading(false);
      toast.error("Error fetching templates. ")
      //console.log(error);
    })
  },[])

  const handleClick = (template) => {

    if (template.isPremium && !isSubscribed) {
      setOpenPricingModal(true);
    } else {
      if (template.isHTML){
        const DynamicImport = dynamic(() => import(`../../../../../components/${template.componentPath}`), {
          ssr: false,
        });
        setSelectedHTMLTemplate(() => DynamicImport);
      }
    }

    setSelectedTemplate(template);
    setOpenTemplateModal(true);
  }

  const handleCoverLetterDownload = async (fileType) => {

    const response = await fetch(process.env.SITE_URL +selectedTemplate.filePath);
    const template = await response.arrayBuffer();

    // Create a new instance of the Docxtemplater library
    const doc = new Docxtemplater();

    // Load the template using PizZip
    const zip = new PizZip(template);
    doc.loadZip(zip);

    doc.setData(clTemplateData);

    // Render the document
    doc.render();

    if (fileType == 'pdf') {
      const generatedDoc = doc.getZip().generate({ type: 'nodebuffer' });
      const docBufferBase64 = generatedDoc.toString('base64');
      const pdfBufferResp = await fetch(process.env.SITE_URL + '/api/convertDocxToPdfUp', {
        method: 'POST',
        body: JSON.stringify({
          docBuffer : docBufferBase64,
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
        },
        responseType: 'arraybuffer'
      });

      if (pdfBufferResp.ok) {
        const arrayBuffer = await pdfBufferResp.arrayBuffer();
        const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
        saveAs(pdfBlob, "coverLetter_" + clTemplateData.firstName+clTemplateData.lastName + ".pdf");
      } else {
        toast.error("Error generating document. Please try again.")
      }
    } else {
      const generatedDoc = doc.getZip().generate({ type: 'blob' });
      saveAs(generatedDoc, "coverLetter_" + clTemplateData.firstName+clTemplateData.lastName + ".docx");
    }
    setIsModalOpenSelectTemplate(false);
  }


  return (
    <Modal show={isModalOpenSelectTemplate} size="7xl"  onClose={() => setIsModalOpenSelectTemplate(false)}>
      <Modal.Header>
        Cover Letter Templates
      </Modal.Header>
      <Modal.Body>
        <div className="relative p-4 w-full max-w-7xl h-full ">
          <div className="container mx-auto">
            {templateLoading  ? (
                <div className="flex justify-center items-center h-96">
                  <svg aria-hidden="true"
                      className="w-20 h-20 mx-auto animate-spin text-gray-200 dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"/>
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"/>
                  </svg>
                </div>

            ) :(
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {
                  templateList.length >0 &&
                  templateList.map((template, tempIndex) => (
                    <div key={"template-"+template._id}>
                      <img
                        onClick={() => handleClick(template)} src={process.env.SITE_URL  + template.thumbnailPath} alt={template.thumbnailAlt}
                        //class="block h-full w-full rounded-lg object-cover object-center"
                        className="block cursor-pointer h-full w-full object-cover object-center border-2 h-96 rounded-lg hover:border-gray-400"
                      />
                    </div>
                  ))
                }
            </div>
            )}
          </div>
          <ClTemplatesModal
            openTemplateModal={openTemplateModal}
            setOpenTemplateModal={setOpenTemplateModal}
            handleCoverLetterDownload={handleCoverLetterDownload}
            selectedTemplate={selectedTemplate}
            SelectedHTMLTemplate={selectedHTMLTemplate}
          />
        </div>
    </Modal.Body>
    <Modal dismissible show={openPricingModal} size={"3xl"} onClose={() => setOpenPricingModal(false)}>
      <Modal.Body>
          <Pricing_Popup_Box />
      </Modal.Body>
    </Modal>

  </Modal>
  )
}

export default ClSelectTemplateModal;
