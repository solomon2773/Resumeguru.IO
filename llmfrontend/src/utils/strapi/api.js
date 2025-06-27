export const strapiFetcher = async (endpoint) => {
    const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    return await response.json();
};
