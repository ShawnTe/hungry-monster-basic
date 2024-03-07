export default function Utils() {
  const generateRandomNumber = (max, min) => {
    return Math.floor(min + Math.random() * (max - min));
  };

  return {
    generateRandomNumber,
  };
}
