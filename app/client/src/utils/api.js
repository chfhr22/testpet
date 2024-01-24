import axios from 'axios';

export const BASE_URL = 'http://apis.data.go.kr';

const options = {
    params: {
        serviceKey: process.env.REACT_APP_PET_API_KEY,
        _type: "json"
    },
};

export const fetchFromAPI = async (url) => {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return data;
};