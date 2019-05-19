import { App, Environment, useCLI } from './../';

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

describe('useCLI', () => {
  it('should cause an app initilization to invoke it', () => {
    let dummyCLI = jest.fn(() => true);
    expect(() => new SubClass()).not.toThrow();
    expect(dummyCLI).not.toHaveBeenCalled();

    //Link
    expect(() => useCLI(dummyCLI)).not.toThrow();

    //Should be called on init
    expect(() => new SubClass()).not.toThrow();
    expect(dummyCLI).toHaveBeenCalled();

    //Allow unlinking
    expect(() => useCLI(null)).not.toThrow();
  });
});

describe('init', () => {
  it('should not throw any errors', async () => {
    let test = new SubClass();
    await expect(test.init()).resolves.not.toThrow();
  });
});

describe('loadPackage', () => {
  it('should be invoked on init', () => {
    let version = '1.0.0';
    let testMock = jest.fn();

    const PackageClass = class extends SubClass {
      loadPackage() {
        testMock();
        return { version };
      }
    }

    expect(() => new PackageClass()).not.toThrow();
    expect(testMock).toHaveBeenCalled();
  });
});
