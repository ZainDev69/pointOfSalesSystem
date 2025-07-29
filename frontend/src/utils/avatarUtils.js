import maleAvatar from '../assets/Male.webp';
import femaleAvatar from '../assets/Female.webp';

/**
 * Get the appropriate avatar image based on client title and gender
 * @param {string} title - Client title (Mr, Mrs, Miss, Ms, Dr, Prof, Rev)
 * @param {string} gender - Client gender (Male, Female, Non-binary, Other, Prefer not to say)
 * @returns {string} - Path to the appropriate avatar image
 */
export const getClientAvatar = (title, gender) => {
    // If gender is explicitly set, use it as primary indicator
    if (gender) {
        if (gender === 'Male') return maleAvatar;
        if (gender === 'Female') return femaleAvatar;
    }

    // If gender is not set or is non-binary/other, use title as fallback
    if (title) {
        const maleTitles = ['Mr', 'Dr', 'Prof', 'Rev'];
        const femaleTitles = ['Mrs', 'Miss', 'Ms'];

        if (maleTitles.includes(title)) return maleAvatar;
        if (femaleTitles.includes(title)) return femaleAvatar;
    }

    // Default to male avatar if no clear indication
    return maleAvatar;
};

/**
 * Get client image with fallback to appropriate avatar
 * @param {string} photo - Client photo URL
 * @param {string} title - Client title
 * @param {string} gender - Client gender
 * @param {string} backendUrl - Backend URL for uploaded images
 * @returns {string} - Final image URL to display
 */
export const getClientImage = (photo, title, gender, backendUrl) => {
    // If client has a photo, use it
    if (photo) {
        if (photo.startsWith("/uploads/")) {
            return `${backendUrl}${photo}`;
        }
        return photo;
    }

    // If no photo, use appropriate avatar
    return getClientAvatar(title, gender);
}; 