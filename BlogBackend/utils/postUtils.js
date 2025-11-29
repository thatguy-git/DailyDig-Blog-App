/**
 * Extracts an introduction from the post content.
 * It takes the first 150 characters and appends '...' if the content is longer.
 * @param {string} content - The full content of the post.
 * @returns {string} The extracted introduction.
 */
export const extractIntro = (content) => {
    if (!content) {
        return '';
    }
    // Remove any potential HTML tags for a cleaner intro
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= 150) {
        return textContent;
    }
    return textContent.substring(0, 150) + '...';
};
