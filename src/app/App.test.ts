import { App, Environment } from './../';

//Testing Subclass
class SubClass extends App {
  constructor() {
    super();
    this.config.loadConfig = async() => { }
  }
};

describe('App', () => {
  it('should be constructable a subclass', () => {
    expect(() => new SubClass()).not.toThrow();
  });

  it('should attempt to determine the environment', () => {
    //Default to production
    delete process.env['NODE_ENV'];
    expect(new SubClass().environment).toEqual(Environment.PRODUCTION);

    process.env['NODE_ENV'] = 'PRODUCTION';
    expect(new SubClass().environment).toEqual(Environment.PRODUCTION);

    process.env['NODE_ENV'] = 'STAGING';
    expect(new SubClass().environment).toEqual(Environment.STAGING);
  });
});

describe('init', () => {
  it('should not throw any errors', async () => {
    let test = new SubClass();
    await expect(test.init()).resolves.not.toThrow();
  });
});
