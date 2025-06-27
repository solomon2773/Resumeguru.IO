import { useState, useEffect } from "react";
import axios from "axios";

export function useClientDetails() {
    const [clientDetails, setClientDetails] = useState({
        country: "",
        countryCode: "",
        city: "",
        region: ""
    });
    const [clientIpAddress, setClientIpAddress] = useState("");

    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const ipApiResponse = await axios.get("https://ipapi.co/json/");
                setClientDetails({
                    country: ipApiResponse.data.country_name,
                    countryCode: ipApiResponse.data.country_calling_code,
                    city: ipApiResponse.data.city,
                    region: ipApiResponse.data.region
                });

                const ipifyResponse = await axios.get("https://api.ipify.org/?format=json");
                setClientIpAddress(ipifyResponse.data.ip);
            } catch (error) {
                console.error("Error fetching client details:", error);
            }
        };

        fetchClientDetails();
    }, []); // Empty dependency array to run only once on mount

    return [clientIpAddress, clientDetails];
}
