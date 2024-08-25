import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminEntity } from 'src/entities/admin.entity';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Generate a token
  // ===========================================================================================
  generateJWTToken(adminId: AdminEntity['id']): string {
    return this.jwtService.sign({ adminId });
  }

  // Verify a token
  // ===========================================================================================
  verifyJWTToken(token: string): any {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
