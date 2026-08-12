

// const axios = require("axios");

// const getLatLngFromAddress = async (address) => {
//   try {
//     // Try original address
//     let queries = [
//       `${address}, Telangana, India`,
//       `${address}, Kodad, Telangana, India`,
//       `Kodad, Telangana, India`
//     ];

  

//     for (let query of queries) {
//       const response = await axios.get(
//         "https://nominatim.openstreetmap.org/search",
//         {
//           params: {
//             q: query,
//             format: "json",
//             limit: 1,
//           },
//           headers: {
//             "User-Agent": "AnusFarm-App",
//           },
//         }
//       );

//       console.log("SEARCH:", query);
//       console.log("RESULT:", response.data);

//       if (response.data.length > 0) {
//         return {
//           lat: Number(response.data[0].lat),
//           lng: Number(response.data[0].lon),
//         };
//       }
//     }

//     throw new Error("Location not found");

//   } catch (error) {
//     console.log("GEOCODE ERROR =", error.message);
//     throw error;
//   }
// };

// module.exports = {
//   getLatLngFromAddress,
// };

const axios = require("axios");

const getLatLngFromAddress = async (address) => {
    try {
        const queries = [
            `${address}, Hyderabad, Telangana, India`,
            `${address}, Ameerpet, Hyderabad, Telangana, India`,
            `${address}, Telangana, India`,
        ];

        for (const query of queries) {
            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: query,
                        format: "json",
                        limit: 1,
                    },
                    headers: {
                        "User-Agent": "AnusFarm-App",
                    },
                }
            );

            console.log("SEARCH:", query);
            console.log("RESULT:", response.data);

            if (response.data.length > 0) {
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