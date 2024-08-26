import { Test, TestingModule } from '@nestjs/testing';
import { AdminsService } from './admins.service';
import { AdminEntity } from '../entities/admin.entity';
import LoginAdminDto from './admins-DTO/login-admin.dto';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { comparePasswords } from '../passwords/utils/comparePassword';
import {
  //NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

// Mock for comparePasswords
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

  describe('loginAdmin', () => {
    it('should login the admin and return its id, email and a token', async () => {
      const dto: LoginAdminDto = {
        email: 'email@example.com',
        password: 'password',
      };

      const admin: AdminEntity = {
        id: 1,
        email: 'email@example.com',
        password: 'hashedPassword',
        // Include other properties if necessary
      } as AdminEntity;

      const token = 'mockToken';

      // Mock repository and method returns
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(admin);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      jest.spyOn(authService, 'generateJWTToken').mockReturnValue(token);

      const result = await adminsService.loginAdmin(dto);

      expect(result).toEqual({
        id: admin.id,
        email: admin.email,
        token,
      });
    });

    /*
    it('should throw NotFoundException if admin is not found', async () => {
      const dto: LoginAdminDto = {
        email: 'email@example.com',
        password: 'password',
      };

      // Mock de findOne pour renvoyer null
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(null);

      // On teste que l'appel de loginAdmin renvoie l'exception attendue
      await expect(adminsService.loginAdmin(dto)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });*/

    it('should throw InternalServerErrorException if findAdminByEmail fails', async () => {
      const dto: LoginAdminDto = {
        email: 'email@example.com',
        password: 'password',
      };

      jest
        .spyOn(adminRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(adminsService.loginAdmin(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    /*it('should throw an error if comparePasswords fails', async () => {
      const dto: LoginAdminDto = {
        email: 'email@example.com',
        password: 'password',
      };

      const admin: AdminEntity = {
        id: 1,
        email: 'email@example.com',
        password: 'hashedPassword',
        // Include other properties if necessary
      } as AdminEntity;

      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(admin);
      (comparePasswords as jest.Mock).mockResolvedValue(true);

      await expect(adminsService.loginAdmin(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });*/
  });
});
