
import {
    mongodbUserInvoiceHistory
 } from "../../mongodb/user/invoice";

 export async function getInvoicesApi(requestData) {
    try {
        const userId = requestData.userId;
 
        const invoiceResult = await mongodbUserInvoiceHistory(userId);

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
        console.error("error while excecuting  getInvoicesApi function :", error);
        return false;
    }
}

 
 