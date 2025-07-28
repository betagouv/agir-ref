import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LVAOUsecase } from './usecase/lvao.usecase';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const command = process.argv[2];
  switch (command) {
    case 'load_lvao_big_csv':
      await application.get(LVAOUsecase).smart_load_csv_lvao(process.argv[3]);
      break;

    default:
      console.log('Command not found');
      process.exit(1);
  }

  await application.close();
  process.exit(0);
}

bootstrap();
