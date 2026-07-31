export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getInitialCharacter = (name) => {
  if (!name) return 'G';
  return name.charAt(0).toUpperCase();
};
