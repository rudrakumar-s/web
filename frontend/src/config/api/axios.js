// import axios from "axios";

// export default axios.create({
//   baseURL: "https://kollege-api.onrender.com",
//   // "",

//   headers: { "Content-Type": "application/json" },
// });

import axios from "axios";
const baseURL = "http://localhost:3500";

export default axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});
