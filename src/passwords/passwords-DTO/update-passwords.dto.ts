import { IsNumber, IsString, Matches, MinLength } from 'class-validator';
import { AdminEntity } from '../../entities/admin.entity';

export default class UpdatePasswordDto {
  @IsNumber()
  adminId: AdminEntity['id'];

  @IsString()
  @MinLength(8)
  currentPassword: AdminEntity['password'];

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!*]).*$/)
  newPassword: AdminEntity['password'];
}
