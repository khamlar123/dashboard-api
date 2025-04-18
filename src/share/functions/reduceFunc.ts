export const reduceFunc: (array: number[]) => number = (
  array: number[],
): number => {
  return array.reduce((accumulator: number, current: number): number => {
    return accumulator + current;
  }, 0);
};
