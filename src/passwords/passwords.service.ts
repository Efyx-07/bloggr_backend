import { Injectable } from '@nestjs/common';
import UpdatePasswordDto from './passwords-DTO/update-passwords.dto';
import { AdminEntity } from '../entities/admin.entity';
import { hashPassword } from './utils/hashPassword';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminsService } from '../admins/admins.service';
import { comparePasswords } from './utils/comparePassword';

@Injectable()
export class PasswordsService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly adminsService: AdminsService,
  ) {}
  // Update user password by id
  // ===========================================================================================
  async updateAdminPasswordById(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { adminId, currentPassword, newPassword } = updatePasswordDto;

    // Get user by id
    const admin: AdminEntity = await this.adminsService.findAdminById(adminId);

    // Check if current password and hashed password match
    await comparePasswords(currentPassword, admin.password);

    // Hash the new password
    const hashedNewPassword: string = await hashPassword(newPassword);

    try {
      await this.adminRepository.update(adminId, {
        password: hashedNewPassword,
      });
    } catch (error) {
      throw new Error('Error while updating password: ' + error.message);
    }
  }
}
