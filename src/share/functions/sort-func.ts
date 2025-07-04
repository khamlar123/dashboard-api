export const sortFunc = (
  array: any[],
  filed: string,
  option: 'min' | 'max',
) => {
  let result;
  if (option === 'min') {
    result = array.sort((a, b) => a[filed] - b[filed]);
  } else {
    result = array.sort((a, b) => b[filed] - a[filed]);
  }

  return result;
};
