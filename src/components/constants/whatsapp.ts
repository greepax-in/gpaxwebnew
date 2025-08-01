export const WHATSAPP_NUMBER = '917207907222'; // without + sign
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const facebookURL = 'https://www.facebook.com/greenpax.in';
export const instagramURL = 'https://www.instagram.com/greenpax.in/';
export const twitterURL = 'https://twitter.com/greenpax_in';
export const youtubeURL = 'https://www.youtube.com/@greenpax.in';


export const getWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

