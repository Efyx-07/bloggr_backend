import { Test, TestingModule } from '@nestjs/testing';
import { AdminsService } from './admins.service';
import { AdminEntity } from '../entities/admin.entity';
import LoginAdminDto from './admins-DTO/login-admin.dto';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { comparePasswords } from '../passwords/utils/comparePassword';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

jest.mock('../passwords/utils/comparePassword', () => ({
  comparePasswords: jest.fn(),
}));

describe('AdminsService', () => {
  let adminsService: AdminsService;
  let authService: AuthService;
  let adminRepository: Repository<AdminEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminsService,
        {
          provide: AuthService,
          useValue: {
            generateJWTToken: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AdminEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    adminsService = module.get<AdminsService>(AdminsService);
    authService = module.get<AuthService>(AuthService);
    adminRepository = module.get<Repository<AdminEntity>>(
      getRepositoryToken(AdminEntity),
    );
  });

  it('should be defined', () => {
    expect(adminsService).toBeDefined();
  });

  // Test - loginAdmin
  // ===========================================================================================
  describe('loginAdmin', () => {
    it('should login the admin and return admin details and a token', async () => {
      const dto: LoginAdminDto = {
        email: 'email@example.com',
        password: 'password',
      };

      const admin: AdminEntity = {
        id: 1,
        email: 'email@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'hashedPassword',
      } as AdminEntity;

      const token = 'mockToken';

      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(admin);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      jest.spyOn(authService, 'generateJWTToken').mockReturnValue(token);

      const result = await adminsService.loginAdmin(dto);

      expect(result).toEqual({
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        token,
      });
    });

    it('should throw NotFoundException if admin is not found', async () => {
      const dto: LoginAdminDto = {
        email: 'email@example.com',
        password: 'password',
      };

      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(null);

      await expect(adminsService.loginAdmin(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if comparePasswords fails', async () => {
      const dto: LoginAdminDto = {
        email: 'email@example.com',
        password: 'password',
      };

      const admin: AdminEntity = {
        id: 1,
        email: 'email@example.com',
        password: 'hashedPassword',
      } as AdminEntity;

      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(admin);

      const error = new InternalServerErrorException(
        'Error during password comparison',
      );
      (comparePasswords as jest.Mock).mockRejectedValue(error);

      await expect(adminsService.loginAdmin(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
