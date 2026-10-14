
const axios = require("axios");

const getLatLngFromAddress = async (address) => {
    try {
        // Try the user's complete address first
        const queries = [
            address,

            // Remove common landmark words and try again
            address
                .replace(/^near\s+/i, "")
                .replace(/^opposite\s+/i, "")
                .replace(/^beside\s+/i, "")
                .trim(),

            // Try Telangana-specific version
            `${address}, Telangana, India`,
        ];

        for (const query of queries) {
            console.log("SEARCH:", query);

            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: query,
                        format: "json",
                        limit: 1,
                        countrycodes: "in",
                    },
                    headers: {
                        "User-Agent": "AnusFarm-App/1.0",
                    },
                    timeout: 10000,
                }
            );

            console.log("RESULT:", response.data);

            if (response.data && response.data.length > 0) {
                return {
                    lat: Number(response.data[0].lat),
                    lng: Number(response.data[0].lon),
                };
            }
        }

        // If complete landmark address is not found,
        // extract the village/location part manually
        const fallbackQueries = [
            "Gondriyala, Kodad, Telangana, India",
            "Kodad, Telangana, India",
        ];

        for (const query of fallbackQueries) {
            console.log("FALLBACK SEARCH:", query);

            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: query,
                        format: "json",
                        limit: 1,
                        countrycodes: "in",
                    },
                    headers: {
                        "User-Agent": "AnusFarm-App/1.0",
                    },
                    timeout: 10000,
                }
            );

            console.log("FALLBACK RESULT:", response.data);

            if (response.data && response.data.length > 0) {
                return {
                    lat: Number(response.data[0].lat),
                    lng: Number(response.data[0].lon),
                };
            }
        }

        throw new Error("Location not found");

    } catch (error) {
        console.log("GEOCODE ERROR =", error.message);
        throw error;
    }
};

module.exports = {
    getLatLngFromAddress,
};