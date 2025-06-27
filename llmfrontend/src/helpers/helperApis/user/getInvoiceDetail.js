import {
    mongodbUserInvoiceDetail,
} from "../../mongodb/user/invoice";

export async function getInvoiceDetailApi(requestData) {
    try {
        const userId = requestData.userId;
        const _id = requestData._id;
        const invoiceResult = await mongodbUserInvoiceDetail(_id,userId);
        if (invoiceResult){
            return {
                status: true,
                invoiceResult,
            }
        } else {
            return {
                status: false,
                invoiceResult: [],
            }
        }
    } catch (error) {
        console.error("error while excecuting  getInvoiceDetailApi function :", error);
        return false;
    }
}

