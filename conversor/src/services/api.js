import axios from 'axios';

const apiKey = process.env.REACT_APP_HG_API_KEY;

const api = axios.create({
    baseURL: '/',
});

export const fetchCurrencies = async () => {
    try {
        const response = await api.get(`/finance?key=${apiKey}&format=json`);
        return response.data.results.currencies;
    } catch (error) {
        console.error("Erro ao buscar cotações: ", error);
        return null;
    }
};