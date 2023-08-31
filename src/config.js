const prod = {
 url: {
  API_URL: 'https://tanoshii-api.vercel.app/meta/anilist',
};
const dev = {
 url: {
  API_URL: 'https://api.consumet.org/meta/anilist'
 }
};

export const config = process.env.NODE_ENV === ‘development’ ? dev : prod;
