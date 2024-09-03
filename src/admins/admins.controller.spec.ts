import { Test, TestingModule } from '@nestjs/testing';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import LoginAdminDto from './admins-DTO/login-admin.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('AdminsController', () => {
  let adminsController: AdminsController;
  let adminsService: AdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [
        {
          provide: AdminsService,
          useValue: {
            loginAdmin: jest.fn(),
          },
        },
      ],
    }).compile();

    adminsController = module.get<AdminsController>(AdminsController);
    adminsService = module.get<AdminsService>(AdminsService);
  });

  it('should be defined', () => {
    expect(adminsController).toBeDefined();
  });

  // Test - login
  // ===========================================================================================
  describe('login', () => {
    it('should return success response with token and admin details on successful login', async () => {
      const loginAdminDto: LoginAdminDto = {
        email: 'email@example.com',
        password: 'password',
      };
      const mockAdmin = {
        id: 1,
        email: 'email@example.com',
        firstName: 'firstName',
        lastName: 'lastName',
        token: 'mockToken',
      };

      jest.spyOn(adminsService, 'loginAdmin').mockResolvedValue(mockAdmin);

      const result = await adminsController.login(loginAdminDto);

      expect(result).toEqual({
        success: true,
        message: 'Successfully connected',
        token: 'mockToken',
        admin: {
          id: mockAdmin.id,
          email: mockAdmin.email,
          firstName: mockAdmin.firstName,
          lastName: mockAdmin.lastName,
        },
      });
    });

    it('should throw InternalServerErrorException if loginAdmin throws an error', async () => {
      const loginAdminDto: LoginAdminDto = {
        email: 'admin@example.com',
        password: 'password',
      };
      jest
        .spyOn(adminsService, 'loginAdmin')
        .mockRejectedValue(new Error('Login failed'));

      await expect(adminsController.login(loginAdminDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
