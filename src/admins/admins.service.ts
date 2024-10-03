import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../entities/admin.entity';
import { Repository } from 'typeorm';
import LoginAdminDto from './admins-DTO/login-admin.dto';
import { comparePasswords } from '../passwords/utils/comparePassword';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly authService: AuthService,
  ) {}

  // Connecte l'Admin (avec email et password)
  // ===========================================================================================
  async loginAdmin(loginAdminDto: LoginAdminDto): Promise<{
    id: AdminEntity['id'];
    email: AdminEntity['email'];
    firstName: AdminEntity['firstName'];
    lastName: AdminEntity['lastName'];
    token: string;
  }> {
    const { email, password } = loginAdminDto;
    // Retrouve l'Admin par son email
    const admin: AdminEntity = await this.findAdminByEmail(email);
    // Compare les passwords
    await comparePasswords(password, admin.password);
    // Genere un JWT token
    const token: string = this.authService.generateJWTToken(admin.id);
    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      token,
    };
  }

  // Retrouve l'Admin par son email
  // ===========================================================================================
  private async findAdminByEmail(
    email: AdminEntity['email'],
  ): Promise<AdminEntity> {
    const admin: AdminEntity = await this.adminRepository.findOne({
      where: { email: email },
    });
    if (!admin) throw new NotFoundException('User not found');
    return admin;
  }

  // Retrouve l'Admin par son ID
  // ===========================================================================================
  async findAdminById(adminId: AdminEntity['id']): Promise<AdminEntity> {
    const admin: AdminEntity = await this.adminRepository.findOne({
      where: { id: adminId },
    });
    if (!admin) throw new NotFoundException('User not found');
    return admin;
  }
}
