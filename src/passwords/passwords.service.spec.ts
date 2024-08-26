import { Test, TestingModule } from '@nestjs/testing';
import { PasswordsService } from './passwords.service';
import { AdminsService } from '../admins/admins.service';
import { AdminEntity } from '../entities/admin.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { comparePasswords } from './utils/comparePassword';
import { hashPassword } from './utils/hashPassword';
import UpdatePasswordDto from './passwords-DTO/update-passwords.dto';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('./utils/comparePassword', () => ({
  comparePasswords: jest.fn(),
}));

jest.mock('./utils/hashPassword', () => ({
  hashPassword: jest.fn(),
}));

describe('PasswordsService', () => {
  let passwordsService: PasswordsService;
  let adminsService: AdminsService;
  let adminRepository: Repository<AdminEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordsService,
        {
          provide: AdminsService,
          useValue: {
            findAdminById: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AdminEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    passwordsService = module.get<PasswordsService>(PasswordsService);
    adminsService = module.get<AdminsService>(AdminsService);
    adminRepository = module.get<Repository<AdminEntity>>(
      getRepositoryToken(AdminEntity),
    );
  });

  it('should be defined', () => {
    expect(passwordsService).toBeDefined();
  });

  describe('updateAdminPasswordById', () => {
    it('should update the password successfully', async () => {
      const dto = new UpdatePasswordDto();
      dto.adminId = 1;
      dto.currentPassword = 'currentPassword';
      dto.newPassword = 'newPassword';

      const admin = new AdminEntity();
      admin.id = 1;
      admin.password = 'hashedCurrentPassword';

      jest.spyOn(adminsService, 'findAdminById').mockResolvedValue(admin);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      (hashPassword as jest.Mock).mockResolvedValue('hashedNewPassword');
      const updateSpy = jest
        .spyOn(adminRepository, 'update')
        .mockResolvedValue(undefined);

      await passwordsService.updateAdminPasswordById(dto);

      expect(adminsService.findAdminById).toHaveBeenCalledWith(1);
      expect(comparePasswords).toHaveBeenCalledWith(
        'currentPassword',
        'hashedCurrentPassword',
      );
      expect(hashPassword).toHaveBeenCalledWith('newPassword');
      expect(updateSpy).toHaveBeenCalledWith(1, {
        password: 'hashedNewPassword',
      });
    });

    it('should throw an InternalServerErrorException if update fails', async () => {
      const dto = new UpdatePasswordDto();
      dto.adminId = 1;
      dto.currentPassword = 'currentPassword';
      dto.newPassword = 'newPassword';

      const admin = new AdminEntity();
      admin.id = 1;
      admin.password = 'hashedCurrentPassword';

      jest.spyOn(adminsService, 'findAdminById').mockResolvedValue(admin);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      (hashPassword as jest.Mock).mockResolvedValue('hashedNewPassword');
      jest
        .spyOn(adminRepository, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        passwordsService.updateAdminPasswordById(dto),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an error if current password does not match', async () => {
      const dto = new UpdatePasswordDto();
      dto.adminId = 1;
      dto.currentPassword = 'wrongPassword';
      dto.newPassword = 'newPassword';

      const admin = new AdminEntity();
      admin.id = 1;
      admin.password = 'hashedCurrentPassword';

      jest.spyOn(adminsService, 'findAdminById').mockResolvedValue(admin);
      (comparePasswords as jest.Mock).mockRejectedValue(
        new Error('Passwords do not match'),
      );

      // Utilisation de jest.spyOn pour la méthode update du repository
      const updateSpy = jest
        .spyOn(adminRepository, 'update')
        .mockResolvedValue(undefined);

      await expect(
        passwordsService.updateAdminPasswordById(dto),
      ).rejects.toThrow(Error);

      // Vérifie que la méthode update n'est pas appelée si les mots de passe ne correspondent pas
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});
