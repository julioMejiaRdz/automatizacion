import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const checkPassword = (enteredPassword: string, storedHash: string) =>
  bcrypt.compare(enteredPassword, storedHash)
