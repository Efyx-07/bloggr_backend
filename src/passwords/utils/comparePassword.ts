import * as bcrypt from 'bcrypt';
import { AdminEntity } from '../../entities/admin.entity';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

// Compare the password filled and user password
// ===========================================================================================
export async function comparePasswords(
  password: AdminEntity['password'],
  hashedPassword: AdminEntity['password'],
): Promise<void> {
  try {
    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      hashedPassword,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid current password');
    }
  } catch (error) {
    throw new InternalServerErrorException(
      'Error while comparing passwords: ' + error.message,
    );
  }
}
