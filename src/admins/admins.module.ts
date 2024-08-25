import { Module } from '@nestjs/common';
import { SController } from './s/s.controller';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
  controllers: [SController, AdminsController],
  providers: [AdminsService]
})
export class AdminsModule {}
