import Utils from "./utils.mjs";

const { generateRandomNumber } = Utils();

export default function Messages() {
  const successMessages = [
    "Right on, Turkey Feathers",
    "Huzzah Fo-Fizzah",
    "WooHoo Shmoodo",
    "Hot Diggity Doggie",
    "Booya, Baby",
    "Bodacious",
    "Fantastilicious",
    "Fantastico Bombastico",
    "Rock on, Sugar Cakes",
    "Razzle Dazzle",
    "Kaboom Kaboomie",
    "Hooray Hurrah",
    "Honky Dora-licious",
    "Fantastico",
  ];
  const tooLowMessages = [
    "I'm still hungry!",
    "More, please!",
    "More more more!",
    "Another bite!",
    "Not enough, try more!",
  ];
  const tooHighMessages = [
    "I'm too full!",
    "Ugh, that's too much!",
    "I have a belly ache from too much!",
    "Burp. Too much!",
    "Less, please.",
    "Not So Much!",
    "I can't eat so much",
  ];

  const chooseMessage = (list) => {
    const highestIndex = list.length;
    const messageIndex = generateRandomNumber(highestIndex, 0);

    return list[messageIndex];
  };

  return {
    successMessages,
    tooLowMessages,
    tooHighMessages,
    chooseMessage,
  };
}
