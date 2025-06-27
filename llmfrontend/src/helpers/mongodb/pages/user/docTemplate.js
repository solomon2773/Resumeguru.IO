

export async function mongodbGetResumeTemplate(templateType, formatType) {
    try {
        const docTempResp = await fetch(process.env.SITE_URL + '/api/mongodb/pages/templates/docTemplate', {
            method: 'POST',
            body: JSON.stringify({
                templateType : templateType,
                formatType: formatType,
                action: 'getResumeTemplate'
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.API_AUTH_BEARER_TOKEN}`,
            },
        });
        const tResp = await docTempResp.json();

        if (tResp.success && Array.isArray(tResp.result)) {
            return tResp.result;
        } else {
            return [];
        }

    } catch (error) {
        console.error("Error during fetch:", error);
        return [];
    }

}
