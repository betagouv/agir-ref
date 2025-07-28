import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { LVAOController } from './infrastructure/api/lvao.controller';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { LVAORepository } from './infrastructure/repository/lvao.repository';
import { LVAOUsecase } from './usecase/lvao.usecase';

function getControllers(): any[] {
  const controllers = [];
  controllers.push(LVAOController);
  return controllers;
}
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 1000 * 60 * 60 * 24,
        limit: 10000,
      },
    ]),
  ],
  controllers: getControllers(),
  providers: [PrismaService, LVAORepository, LVAOUsecase],
})
export class AppModule {}
