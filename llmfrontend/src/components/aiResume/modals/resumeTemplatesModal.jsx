import { Button, Modal, Card } from "flowbite-react";

const ResumeTemplatesModal = ({openTemplateModal, setOpenTemplateModal, handleResumeDownload, selectedTemplate}) => {


  const handleClick = (fileType) => {
    handleResumeDownload(fileType);
    setOpenTemplateModal(false);
  }

  return (
    <Modal show={openTemplateModal} size="3xl"  onClose={() => setOpenTemplateModal(false)}>
    <Modal.Header>Select Resume Format</Modal.Header>
    <Modal.Body>


    <div  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <img
          src={process.env.SITE_URL + selectedTemplate.thumbnailPath} alt={selectedTemplate.thumbnailAlt}
        //class="block h-full w-full rounded-lg object-cover object-center"
        className="object-cover w-full rounded-t-lg h-full md:w-1/2 md:rounded-none md:rounded-s-lg"
      />

        <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="m-2 mr-auto ml-auto text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Download Resume
            </h5>
            <p className="flex flex-wrap gap-2 font-normal text-gray-700 dark:text-gray-400">
            <Button
              className="flex" outline
              onClick={() => {handleClick('docx') }}
              gradientDuoTone="purpleToBlue"
            >
              Download(.docx)
            </Button>
            <Button
              className="flex" outline
              gradientDuoTone="purpleToBlue"
              onClick={() => {handleClick('pdf') }}
            >
              Download (.pdf)
            </Button>
          </p>
        </div>
    </div>



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
