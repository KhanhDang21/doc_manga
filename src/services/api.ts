import axios from 'axios';

const API_BASE_URL = 'https://api.mangadex.org'; 
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'; // proxy thử nghiệm

export const fetchHomeManga = async () => {
  try {
    const response = await axios.get(
      `${CORS_PROXY}${API_BASE_URL}/manga?limit=16&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
    );
    console.log("API response for home manga:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching featured manga:", error);
    throw new Error('Error fetching featured manga: ' + error.message);
  }
};

export const fetchMangaDetails = async (id: string) => {
  try {
    const response = await axios.get(`${CORS_PROXY}${API_BASE_URL}/manga/${id}`);
    console.log("API response for manga details:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching manga details:", error);
    throw new Error('Error fetching manga details: ' + error.message);
  }
};

export const fetchMangaChapters = async (id: string) => {
    try {
      const response = await axios.get(`${CORS_PROXY}${API_BASE_URL}/manga/${id}/aggregate`);
      console.log("API response for chapters:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching chapters:", error);
      throw new Error('Error fetching chapters: ' + error.message);
    }
};

export const fetchChapterRaw = async (id: string) => {
  try {
    const response = await axios.get(`${CORS_PROXY}${API_BASE_URL}/at-home/server/${id}`);
    console.log("API response for chapter raw:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching chapter raw:", error);
    throw new Error('Error fetching chapter raw: ' + error.message);
  }
};
