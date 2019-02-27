import { App, Environment } from './App';
import { Module } from './../module/Module';

//Testing Subclass
class SubClass extends App {
  constructor() {
    super();
    this.config.loadConfig = async() => { }
  }
};
class SubModuleClass extends Module {
  testInit:jest.Mock;
  async init() { this.testInit(); }
}

describe('App', () => {
  it('should be constructable a subclass', () => {
    expect(() => new SubClass()).not.toThrow();
  });

  it('should attempt to determine the environment', () => {
    //Default to development
    delete process.env['NODE_ENV'];
    expect(new SubClass().environment).toEqual(Environment.DEVELOPMENT);

    process.env['NODE_ENV'] = 'PRODUCTION';
    expect(new SubClass().environment).toEqual(Environment.PRODUCTION);

    process.env['NODE_ENV'] = 'STAGING';
    expect(new SubClass().environment).toEqual(Environment.STAGING);
  });
});

describe('addModule', () => {
  it('should require a module', () => {
    let test = new SubClass();
    expect(() => test.addModule(null)).toThrow();
  });

  it('should add a module', () => {
    let test = new SubClass();
    let module = new SubModuleClass(test);
    expect(() => test.addModule(module)).not.toThrow();
    expect(test.modules).toContain(module);
  });

  it('should not double up', () => {
    let test = new SubClass();
    let module = new SubModuleClass(test);
    test.addModule(module);
    test.addModule(module);
    expect(test.modules).toHaveLength(1);
  });

  it('should let me add multiple modules', () => {
    let test = new SubClass();
    let module1 = new SubModuleClass(test);
    let module2 = new SubModuleClass(test);
    [module1,module2].forEach(e => test.addModule(e));
    expect(test.modules).toHaveLength(2);
    expect(test.modules).toContain(module1);
    expect(test.modules).toContain(module2);
  });
});

describe('removeModule', () => {
  it('should require a module', () => {
    let test = new SubClass();
    expect(() => test.removeModule(null)).toThrow();
  });

  it('should remove a module', () => {
    let test = new SubClass();
    let module = new SubModuleClass(test);
    test.addModule(module);
    test.removeModule(module);
    expect(test.modules).not.toContain(module);
  });

  it('should remove the correct module', () => {
    let test = new SubClass();
    let module1 = new SubModuleClass(test);
    let module2 = new SubModuleClass(test);
    [module1,module2].forEach(e => test.addModule(e));
    test.removeModule(module1);
    expect(test.modules).toHaveLength(1);
    expect(test.modules).not.toContain(module1);
    expect(test.modules).toContain(module2);
  });
});

describe('init', () => {
  it('should not throw any errors', async () => {
    let test = new SubClass();
    await expect(test.init()).resolves.not.toThrow();
  });

  it('should init a module', async () => {
    let test = new SubClass();
    let module = new SubModuleClass(test);
    let mock = module.testInit = jest.fn();
    test.addModule(module);
    await expect(test.init()).resolves.not.toThrow();
    expect(mock).toHaveBeenCalled();
  });

  it('should init in order of add', async () => {
    let test = new SubClass();

    let module1 = new SubModuleClass(test);
    let module2 = new SubModuleClass(test);

    let lastCalled = 0;
    let mock1 = module1.testInit = jest.fn().mockImplementation(() => lastCalled = 420);
    let mock2 = module2.testInit = jest.fn().mockImplementation(() => lastCalled = 69);

    test.addModule(module1);
    test.addModule(module2);
    await test.init();

    expect(lastCalled).toEqual(69);
  });
});
