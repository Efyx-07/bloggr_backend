import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  // Met à jour le mot de passe de l'Admin avec son ID
  // ===========================================================================================
  async updateAdminPasswordById(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { adminId, currentPassword, newPassword } = updatePasswordDto;

    const admin: AdminEntity = await this.adminsService.findAdminById(adminId);
    await comparePasswords(currentPassword, admin.password);
    const hashedNewPassword: string = await hashPassword(newPassword);

    try {
      await this.adminRepository.update(adminId, {
        password: hashedNewPassword,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while updating password: ' + error.message,
      );
    }
  }
}
