import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';

export class TestUtil {
  constructor() {}
  public static ok_appclose = true;
  public static app: INestApplication;
  public static prisma = new PrismaService();

  static getServer() {
    return request(this.app.getHttpServer());
  }

  static GET(url: string) {
    return TestUtil.getServer().get(url);
  }
  static PUT(url: string) {
    return TestUtil.getServer().put(url);
  }
  static PATCH(url: string) {
    return TestUtil.getServer().patch(url);
  }
  static DELETE(url: string) {
    return TestUtil.getServer().delete(url);
  }
  static POST(url: string) {
    return TestUtil.getServer().post(url);
  }

  static async appinit() {
    if (TestUtil.app === undefined) {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      TestUtil.app = moduleFixture.createNestApplication();
      await TestUtil.app.init();
    }
  }
  static async appclose() {
    if (TestUtil.ok_appclose) {
      await this.app.close();
      await this.prisma.$disconnect();
    }
  }

  static async deleteAll() {}
}
