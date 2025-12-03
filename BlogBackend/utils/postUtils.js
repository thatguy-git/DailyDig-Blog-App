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

export const escapeLucene = (str) => {
    if (!str) return '';
    // Escape special Lucene characters
    return str.replace(/([+\-&|!(){}\[\]^"~*?:\\/])/g, '\\$1');
};
