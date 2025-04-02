export const checkNan = (value: number | string): number => {
  const result = Number(value);
  if (isNaN(result)) {
    return 0;
  }
  return result;
};
