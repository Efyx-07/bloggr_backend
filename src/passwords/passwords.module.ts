import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordsController } from './passwords.controller';
import { PasswordsService } from './passwords.service';
import { AdminsService } from '../admins/admins.service';
import { AdminEntity } from '../entities/admin.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), AuthModule],
  controllers: [PasswordsController],
  providers: [PasswordsService, AdminsService],
})
export class PasswordsModule {}
