import * as bcrypt from 'bcrypt';

export function encodePassword(rawPassword: string) {
  const SALT = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(rawPassword, SALT);
}

export function comparePasswords(rawPassword: string, hashPassword: string) {
  return bcrypt.compareSync(rawPassword, hashPassword);
}
