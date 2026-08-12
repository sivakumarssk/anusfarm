
// require("dotenv").config();
// const app = require("./app");

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, "0.0.0.0", () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });

// const path = require("path");
// const fs = require("fs");

// console.log("__dirname =", __dirname);

// const envPath = path.resolve(__dirname, "../.env");
// console.log("ENV PATH =", envPath);
// console.log("ENV EXISTS =", fs.existsSync(envPath));

// require("dotenv").config({ path: envPath });

// console.log("GOOGLE_API_KEY =", process.env.GOOGLE_API_KEY);

// const app = require("./app");

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
const path = require("path");
const fs = require("fs");

console.log("__dirname =", __dirname);

const envPath = path.resolve(__dirname, "../.env");
console.log("ENV PATH =", envPath);
console.log("ENV EXISTS =", fs.existsSync(envPath));

require("dotenv").config({ path: envPath });

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});