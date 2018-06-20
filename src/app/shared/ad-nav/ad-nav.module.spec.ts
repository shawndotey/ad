import { AdNavModule } from './ad-nav.module';

describe('AdNavModule', () => {
  let adNavModule: AdNavModule;

  beforeEach(() => {
    adNavModule = new AdNavModule();
  });

  it('should create an instance', () => {
    expect(adNavModule).toBeTruthy();
  });
});
