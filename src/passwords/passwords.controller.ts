import {
  Body,
  Controller,
  InternalServerErrorException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import UpdatePasswordDto from './passwords-DTO/update-passwords.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  // Met à jour le password de l'Admin - endpoint: .../passwords/update-password
  // ===========================================================================================
  @UseGuards(AuthGuard)
  @Put('update-password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    try {
      await this.passwordsService.updateAdminPasswordById(updatePasswordDto);
      return { message: 'Password successfully updated' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while updating password' + error.message,
      );
    }
  }
}
