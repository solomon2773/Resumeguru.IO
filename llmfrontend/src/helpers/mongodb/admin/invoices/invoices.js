const makeDbCall = async (params = {}) => {
    try {
      const response = await fetch(process.env.SITE_URL + '/api/mongodb/admin/invoices', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_AUTH_BEARER_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('DB call failed:', error);
      throw error;
    }
};


export async function mongodbAddingInvoice(inputData) {
    const tResp = await makeDbCall({
        inputData : inputData,
        action: 'addingInvoice'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}

export async function mongodbAddingPromoInvoice(userData, signupId) {
    const tResp = await makeDbCall({
        userData : userData,
        signupId: signupId,
        action: 'addingPromoInvoice'
    });

    if (tResp.success) {
        return tResp.result;
    } else {
        return false;
    }
}
