import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { AdminEntity } from 'src/entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), AuthModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
