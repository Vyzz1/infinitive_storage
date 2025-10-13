const axios = require("axios");

const options = {
  method: "GET",
  url: "https://instagram-premium-api-2023.p.rapidapi.com/v1/user/highlights/by/username",
  params: { username: "quinh_quinhp" },
  headers: {
    "x-rapidapi-key": "0208ab29c5mshdc9c46390600b29p1d93a1jsnfb975d83e7b8",
    "x-rapidapi-host": "instagram-premium-api-2023.p.rapidapi.com",
  },
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error?.response?.data || error.message);
  }
}

for (let i = 0; i < 10; i++) {
  fetchData();
}
