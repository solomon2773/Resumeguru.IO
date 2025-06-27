import { Modal } from "flowbite-react";

const MessageModal = ({openMessageModal, setOpenMessageModal, messageType, message}) => {

  return (
    <Modal show={openMessageModal} size="3xl"  onClose={() => setOpenMessageModal(false)}>
        <Modal.Header>{messageType}</Modal.Header>
        <Modal.Body>
            <div  className="flex flex-col items-center bg-white rounded-lg  md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <p className="flex flex-wrap gap-2 font-normal text-gray-700 dark:text-gray-400">
                        {message}
                    </p>
                </div>
            </div>
        </Modal.Body>
  </Modal>
  )
}

export default MessageModal;
