import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import LoginAdminDto from './admins-DTO/login-admin.dto';
import { AdminEntity } from '../entities/admin.entity';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  // Connecte l'Admin avec son email et son mot de passe - endpoint: .../admins/login
  // ===========================================================================================
  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto): Promise<{
    success: boolean;
    message: string;
    token: string;
    admin: { id: AdminEntity['id']; email: AdminEntity['email'] };
  }> {
    try {
      // Connecte l'Admin
      const admin = await this.adminsService.loginAdmin(loginAdminDto);
      // Génère le token
      const token = admin.token;
      return {
        success: true,
        message: 'Successfully connected',
        token: token,
        admin: {
          id: admin.id,
          email: admin.email,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error while login admin');
    }
  }
}
