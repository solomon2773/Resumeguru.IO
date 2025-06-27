export async function mongodbInsertResumeBuildingSteps(buildingStep, description, userId) {
    try {
        const docTempResp = await fetch(process.env.SITE_URL + '/api/mongodb/pages/resume/resumeBuildingSteps', {
            method: 'POST',
            body: JSON.stringify({
                userId: userId,
                buildingStep: buildingStep,
                description: description,
                action: 'insertResumeBuildingSteps'
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.API_AUTH_BEARER_TOKEN}`,
            },
        });
        const tResp = await docTempResp.json();

        if (tResp.success) {
            return tResp.result;
        } else {
            return [];
        }

    } catch (error) {
        console.error("Error during fetch:", error);
        return [];
    }

}

