import { Test, TestingModule } from '@nestjs/testing';
import { PasswordsController } from './passwords.controller';
import { PasswordsService } from './passwords.service';
import UpdatePasswordDto from './passwords-DTO/update-passwords.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // Importez votre AuthGuard

describe('PasswordsController', () => {
  let passwordsController: PasswordsController;
  let passwordsService: PasswordsService;

  beforeEach(async () => {
    const mockAuthGuard = {
      canActivate: jest.fn(() => true), // Simule l'authentification réussie
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordsController],
      providers: [
        {
          provide: PasswordsService,
          useValue: {
            updateAdminPasswordById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard) // Remplacez l'AuthGuard par le mock
      .useValue(mockAuthGuard)
      .compile();

    passwordsController = module.get<PasswordsController>(PasswordsController);
    passwordsService = module.get<PasswordsService>(PasswordsService);
  });

  describe('updatePassword', () => {
    it('should return a success message when password is updated', async () => {
      const dto = new UpdatePasswordDto();
      (passwordsService.updateAdminPasswordById as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await passwordsController.updatePassword(dto);

      expect(result).toEqual({ message: 'Password successfully updated' });
      expect(passwordsService.updateAdminPasswordById).toHaveBeenCalledWith(
        dto,
      );
    });

    it('should throw an InternalServerErrorException when an error occurs', async () => {
      const dto = new UpdatePasswordDto();
      (passwordsService.updateAdminPasswordById as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(passwordsController.updatePassword(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(passwordsService.updateAdminPasswordById).toHaveBeenCalledWith(
        dto,
      );
    });
  });
});
