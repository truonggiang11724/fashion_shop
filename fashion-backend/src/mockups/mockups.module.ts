import { Module } from '@nestjs/common';
import { MockupsService } from './mockups.service';
import { MockupsController } from './mockups.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MockupsController],
  providers: [MockupsService],
  exports: [MockupsService],
})
export class MockupsModule {}
