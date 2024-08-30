import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminEntity } from '../entities/admin.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Génère un token
  // ===========================================================================================
  generateJWTToken(adminId: AdminEntity['id']): string {
    return this.jwtService.sign({ adminId });
  }

  // Vérifie le token
  // ===========================================================================================
  verifyJWTToken(token: string): any {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
