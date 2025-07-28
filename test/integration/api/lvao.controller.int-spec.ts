import { TestUtil } from '../../TestUtil';

describe('Synthese (API test)', () => {
  const OLD_ENV = process.env;

  beforeAll(async () => {
    await TestUtil.appinit();
  });

  beforeEach(async () => {
    process.env = { ...OLD_ENV }; // Make a copy
    await TestUtil.deleteAll();
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await TestUtil.appclose();
  });

  it(`GET `, async () => {
    // GIVEN
    // WHEN
    // THEN
    expect(1).toEqual(1);
  });
});
