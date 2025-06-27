import { Button, Modal, Card } from "flowbite-react";
import {useState, useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setResumeFontSize, setResumeFontColor } from "../../../../store/resumeEditReducer";

const ResumeTemplatesModal = ({openTemplateModal, setOpenTemplateModal, handleWordDownloadAi, selectedTemplate, SelectedHTMLTemplate}) => {

  const [loadingPDF , setLoadingPDF] = useState(false);
  const [htmlThumbnail , setHtmlThumbnail] = useState(null);
  const isResumeLayoutLoading = useSelector(state => state.resumeEdit.isResumeLayoutLoading)
  const selectedFontSize = useSelector(state => state.resumeEdit.resumeFontSize)
  const selectedColor = useSelector(state => state.resumeEdit.resumeFontColor)

  const dispatch = useDispatch();

  const fontSizes = [16, 17,18, 19,20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  //const colors = ['black', 'gray', 'red', 'green', 'blue', 'yellow', 'purple'];
  const colors = {
    '737373': '262626',
    'ef4444': '991b1b',
    'f97316': '9a3412',
    'eab308': '854d0e',
    '22c55e': '166534',
    '3b82f6': '1e40af',
    '8b5cf6': '5b21b6',
    'ec4899': '9d174d',
    'a855f7': '6b21a8'
  };

  const handleGenerateThumbNail = async () => {
    if (!document.getElementById('resume-layout-outerdiv') || !document.getElementById('resume-layout-outerdiv').innerHTML) {

      return;
    }
    const response = await fetch('/api/pdf/generate-thumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: document.getElementById('resume-layout-outerdiv').innerHTML,
        fileName: 'resumeguru.png',
        htmlSelectorEId: selectedTemplate.htmlSelectorEId
      },{
        responseType: 'arraybuffer'
      }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    setHtmlThumbnail(url);
  };

  useEffect(() => {
    if (!isResumeLayoutLoading) {
      handleGenerateThumbNail();
    }
  }, [isResumeLayoutLoading]);

  useEffect(() => {
    colors[selectedTemplate.fontColor] = selectedTemplate.fontColor;
    dispatch(setResumeFontColor(selectedTemplate.fontColor));
    dispatch(setResumeFontSize(selectedTemplate.fontSize));
  }, [selectedTemplate]);

  const handleApplyStyles = () => {
    setHtmlThumbnail(null);
    handleGenerateThumbNail();
  }

  const handleColorClick = (color) => {
    dispatch(setResumeFontColor(color));
  };

  const handleFontSizeChange = (e) => {
    dispatch(setResumeFontSize(e.target.value));
  };

  const handleClick = (fileType) => {
    handleWordDownloadAi(fileType);
    setOpenTemplateModal(false);
  }

  const handleGeneratePDF = async () => {
    setLoadingPDF(true);

    const response = await fetch('/api/pdf/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: document.getElementById('resume-template').outerHTML,
        fileName: 'resumeguru.pdf',
      }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'part.pdf';
    a.click();
    window.URL.revokeObjectURL(url);

    setLoadingPDF(false);
  };

  return (
    <Modal dismissible show={openTemplateModal} size="4xl"  onClose={() => setOpenTemplateModal(false)}>
    {/*<Modal.Header>Select Resume Format</Modal.Header>*/}
    <Modal.Body>
    {
      selectedTemplate.isHTML ? (

        <div  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-4xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          {SelectedHTMLTemplate && <SelectedHTMLTemplate />}
          {
            !htmlThumbnail ? (
              <div className="flex justify-center items-center h-96 md:w-1/2">
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
              ) : (
                <img
                src={htmlThumbnail} alt="HTML_THUMB"
                //class="block h-full w-full rounded-lg object-cover object-center"
                className="object-cover w-full rounded-t-lg max-h-full md:w-1/2 md:rounded-none md:rounded-s-lg"
              />
              )
          }
          <div className="flex flex-col justify-between mx-auto p-4 leading-normal">
            <label htmlFor="font-size" className="block text-gray-700 font-medium mb-2">
              Select Font Size
            </label>
            <div className="flex flex-row space-x-4 mb-4">
              <select
                id="font-size"
                value={selectedFontSize}
                onChange={handleFontSizeChange}
                className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size + 'px'}
                  </option>
                ))}
              </select>
            </div>
            <label htmlFor="font-size" className="block text-gray-700 font-medium mb-2">
              Select Color
            </label>
            <div className="grid grid-cols-5 gap-x-4 gap-y-4 mb-4">
              {Object.entries(colors).map(([clrIndex, color]) => (
                <div key={color} className={`rounded-lg border border-gray-700 p-1 ${selectedColor === clrIndex ? 'bg-lime-300' : 'bg-transparent'}`}>
                  <div
                    key={color}
                    onClick={() => handleColorClick(clrIndex)}
                    className={`w-4 h-4 cursor-pointer ${selectedColor === clrIndex ? 'border-2 border-gray-900' : 'border-2 border-transparent'}`}
                    style={{ backgroundColor: "#" + color }}
                  />
                  </div>
              ))}
            </div>

            <div className="flex items-center flex-row mb-10">
              <p className="flex flex-wrap gap-2 font-normal text-gray-700 dark:text-gray-400">
              <Button
                    isProcessing={loadingPDF || !htmlThumbnail}
                    className="flex mx-auto" outline
                    gradientDuoTone="purpleToBlue"
                    onClick={ () => {
                      if (!loadingPDF && htmlThumbnail){
                        handleApplyStyles()
                      }


                    }}
                >
                    Apply Styles
                </Button>
              </p>
            </div>

            <label className="block text-gray-700 font-medium mb-2">
              Download Resume
            </label>
            <div className="flex items-center flex-row">
              <p className="flex flex-wrap gap-2 font-normal text-gray-700 dark:text-gray-400">
              <Button
                    isProcessing={loadingPDF || !htmlThumbnail}
                    disabled={loadingPDF}
                    className="flex mx-auto" outline
                    gradientDuoTone="purpleToBlue"
                    onClick={ () => {
                      if (!loadingPDF && htmlThumbnail){
                        handleGeneratePDF()
                      }
                    }}
                >
                    Download (.pdf)
                </Button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-4xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <img
            src={process.env.SITE_URL + selectedTemplate.thumbnailPath} alt={selectedTemplate.thumbnailAlt}
            //class="block h-full w-full rounded-lg object-cover object-center"
            className="object-cover w-full rounded-t-lg h-full md:w-1/2 md:rounded-none md:rounded-s-lg"
          />
          <div className="flex flex-col justify-between mx-auto p-4 leading-normal">
            <h5 className="m-2 mr-auto ml-auto text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Download Resume
            </h5>
            <p className="flex flex-wrap gap-2 font-normal text-gray-700 dark:text-gray-400">
                <Button
                    className="flex mx-auto" outline
                    onClick={ () => {handleClick('docx')}}
                    gradientDuoTone="purpleToBlue"
                >
                    Download(.docx)
                </Button>
                <Button
                    className="flex mx-auto" outline
                    gradientDuoTone="purpleToBlue"
                    onClick={ () => {handleClick('pdf')}}
                >
                    Download (.pdf)
                </Button>
            </p>
          </div>
        </div>
      )
    }
      {/* <div className="h-full">
        <Card className="h-full w-full" imgSrc={process.env.SITE_URL + "/images/templates/" + selectedTemplate} horizontal>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Download AI Generated Resume
          </h5>
          <p className="flex flex-wrap gap-2 font-normal text-gray-700 dark:text-gray-400">
            <Button className="flex" outline
                    onClick={handleClick}
                    gradientDuoTone="purpleToBlue">
              Download (.docx)
            </Button>
            <Button className="flex" outline disabled={true}
                    gradientDuoTone="purpleToBlue">
              Download (.pdf)
            </Button>
          </p>
        </Card>
      </div> */}
    </Modal.Body>

  </Modal>
  )
}

export default ResumeTemplatesModal;
