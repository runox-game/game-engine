/**
 * Return a random integer between min an max values.
 * Include min value but exclude max value
 * @param min min value
 * @param max max value
 */
export function randomizeInteger(min: number, max: number) {
  if (max === null) {
    max = min === null ? Number.MAX_SAFE_INTEGER : min;
    min = 1;
  }

  min = Math.ceil(min); // inclusive min
  max = Math.floor(max); // exclusive max

  if (min > max - 1) {
    throw new Error('Incorrect arguments.');
  }

  return min + Math.floor((max - min) * Math.random());
}
