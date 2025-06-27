
import {
    getResumeTemplateByUserId
} from '../mongodb/pages/api/resume';


export async function searchResumesApi(requestData) {
    try {
        const userTemplates = await getResumeTemplateByUserId( requestData.userId);

        return {
            status: true,
            userTemplates: userTemplates,
        }

    } catch (error) {
        console.error("error while excecuting  searchResumesApi function :", error);
        return false;
    }
}


