import * as bcrypt from 'bcryptjs';

export const genHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const compareHash = async (
  challenger: string,
  password: string,
): Promise<boolean> => {
  const isValid = await bcrypt.compare(challenger, password);
  return isValid;
};
