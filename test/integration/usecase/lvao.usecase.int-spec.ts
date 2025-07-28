import { TestUtil } from '../../TestUtil';

describe('LVAO Usecase', () => {
  beforeAll(async () => {
    await TestUtil.appinit();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestUtil.deleteAll();
  });

  afterAll(async () => {
    await TestUtil.appclose();
  });

  it('test', async () => {
    // GIVEN
    // WHEN
    // THEN
    expect(1).toEqual(1);
  });
});
