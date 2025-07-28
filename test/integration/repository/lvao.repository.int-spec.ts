import { LVAORepository } from '../../../src/infrastructure/repository/lvao.repository';
import { TestUtil } from '../../TestUtil';

describe('LVAORepository', () => {
  const OLD_ENV = process.env;
  const lVAORepository = new LVAORepository(TestUtil.prisma);

  beforeAll(async () => {
    await TestUtil.appinit();
  });

  beforeEach(async () => {
    await TestUtil.deleteAll();
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await TestUtil.appclose();
  });

  it('test', async () => {
    // GIVEN

    expect(1).toEqual(1);
  });
});
