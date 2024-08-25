import * as bcrypt from 'bcrypt';
import { AdminEntity } from 'src/entities/admin.entity';

export async function hashPassword(
  password: AdminEntity['password'],
): Promise<string> {
  try {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw Error('Error while hashing password' + error);
  }
}
