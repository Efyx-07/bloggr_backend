import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { Repository } from 'typeorm';
import LoginAdminDto from './admins-DTO/login-admin.dto';
import { comparePasswords } from './utils/comparePassword';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    //private readonly authService: AuthService,
  ) {}

  // Connecte l'Admin (avec email et password)
  // ===========================================================================================
  async loginAdmin(loginAdminDto: LoginAdminDto): Promise<{
    id: AdminEntity['id'];
    email: AdminEntity['email'];
  }> {
    const { email, password } = loginAdminDto;

    // Find user by email
    const admin: AdminEntity = await this.findAdminByEmail(email);

    // Compare the passwords
    await comparePasswords(password, admin.password);

    // Generate a JWT token
    //const token: string = this.authService.generateJWTToken(user.id);

    return {
      id: admin.id,
      email: admin.email,
      //token,
    };
  }

  // Retrouve l'Admin par son email
  // ===========================================================================================
  async findAdminByEmail(email: AdminEntity['email']): Promise<AdminEntity> {
    try {
      const admin: AdminEntity = await this.adminRepository.findOne({
        where: { email: email },
      });
      if (!admin) {
        throw new NotFoundException('User not found');
      }
      return admin;
    } catch (error) {
      throw new InternalServerErrorException(
        'No admin found: ' + error.message,
      );
    }
  }
}
