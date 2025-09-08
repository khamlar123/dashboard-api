export const reduceFunc: (array: number[]) => number = (
  array: number[],
): number => {
  return array.reduce((accumulator: number, current: number): number => {
    return Number((accumulator + current).toFixed(2));
  }, 0);
};
