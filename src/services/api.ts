import axios from 'axios';

const API_BASE_URL = 'https://otruyenapi.com/v1/api'; 

export const fetchHomeManga = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home`);
    console.log("API response for home manga:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching featured manga:", error);
    throw new Error('Error fetching featured manga: ' + error.message);
  }
};

export const fetchMangaDetails = async (slug: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/truyen-tranh/${slug}`);
    console.log("API response for manga details:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching manga details:", error);
    throw new Error('Error fetching manga details: ' + error.message);
  }
};

export const fetchChapter = async (link: string) => {
    try {
      const response = await axios.get(link);
      console.log("API response for chapter:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching chapter:", error);
      throw new Error('Error fetching chapter: ' + error.message);
    }
};