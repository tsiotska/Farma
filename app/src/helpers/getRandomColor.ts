// one-liner from stackOverflow
export const getRandomColor = () => '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
