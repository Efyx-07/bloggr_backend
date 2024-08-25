import { IsEmail, IsString, MinLength } from 'class-validator';
import { AdminEntity } from 'src/entities/admin.entity';

export default class LoginAdminDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: AdminEntity['email'];

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: AdminEntity['password'];
}
