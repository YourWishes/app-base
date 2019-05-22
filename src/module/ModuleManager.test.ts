import { Module, ModuleManager, IApp, App, CLICommand, CommandOptions } from './../';
class DummyCommand extends CLICommand {
  mock:any = jest.fn();

  async onCommand(app:IApp, action:string, options:CommandOptions) {
    return this.mock(app, action, options);
  }
}

class DummyApp extends App {}
const dummyApp = new DummyApp();

class SubModuleClass extends Module {
  testInit:jest.Mock;
  testDestroy:jest.Mock;
  async init() { this.testInit(); }
  async destroy() { this.testDestroy(); }
}

describe('ModuleManager', () => {
  it('should require an app instance', () => {
    expect(() => new ModuleManager(null)).toThrow();
    expect(() => new ModuleManager(undefined)).toThrow();
  });

  it('should construct', () => {
    expect(() => new ModuleManager(dummyApp)).not.toThrow();
  });
});


describe('addModule', () => {
  it('should require a module', () => {
    let test = new ModuleManager(dummyApp);
    expect(() => test.addModule(null)).toThrow();
  });

  it('should add a module', () => {
    let test = new ModuleManager(dummyApp);
    let module = new SubModuleClass(dummyApp);
    expect(() => test.addModule(module)).not.toThrow();
    expect(test.modules).toContain(module);
  });

  it('should not double up', () => {
    let test = new ModuleManager(dummyApp);
    let module = new SubModuleClass(dummyApp);
    test.addModule(module);
    test.addModule(module);
    expect(test.modules).toHaveLength(1);
  });

  it('should let me add multiple modules', () => {
    let test = new ModuleManager(dummyApp);
    let module1 = new SubModuleClass(dummyApp);
    let module2 = new SubModuleClass(dummyApp);
    [module1,module2].forEach(e => test.addModule(e));
    expect(test.modules).toHaveLength(2);
    expect(test.modules).toContain(module1);
    expect(test.modules).toContain(module2);
  });
});

describe('removeModule', () => {
  it('should require a module', () => {
    let test = new ModuleManager(dummyApp);
    expect(() => test.removeModule(null)).toThrow();
  });

  it('should remove a module', () => {
    let test = new ModuleManager(dummyApp);
    let module = new SubModuleClass(dummyApp);
    test.addModule(module);
    test.removeModule(module);
    expect(test.modules).not.toContain(module);
  });

  it('should remove the correct module', () => {
    let test = new ModuleManager(dummyApp);
    let module1 = new SubModuleClass(dummyApp);
    let module2 = new SubModuleClass(dummyApp);
    [module1,module2].forEach(e => test.addModule(e));
    test.removeModule(module1);
    expect(test.modules).toHaveLength(1);
    expect(test.modules).not.toContain(module1);
    expect(test.modules).toContain(module2);
  });
});


describe('addCommand', () => {
  it('should require a real command', () => {
    let module = new SubModuleClass(dummyApp);
    expect(() => module.addCommand(null)).toThrow();
  });

  it('should add a command only once', () => {
    let module = new SubModuleClass(dummyApp);

    let command1 = new DummyCommand(module, 'test1');
    let command2 = new DummyCommand(module, 'test2');
    let command3 = new DummyCommand(module, 'test3');

    expect(module.cliCommands).not.toContain(command1);
    expect(module.cliCommands).toHaveLength(0);

    expect(() => module.addCommand(command1)).not.toThrow();
    expect(module.cliCommands).toContain(command1);
    expect(module.cliCommands).toHaveLength(1);

    expect(() => module.addCommand(command1)).not.toThrow();
    expect(module.cliCommands).toHaveLength(1);

    expect(() => module.addCommand(command2)).not.toThrow();
    expect(() => module.addCommand(command3)).not.toThrow();

    expect(module.cliCommands).toHaveLength(3);
  });
});

describe('removeCommand', () => {
  it('should require a real command', () => {
    let module = new SubModuleClass(dummyApp);
    expect(() => module.removeCommand(null)).toThrow();
  });

  it('should remove the command only once', () => {
    let module = new SubModuleClass(dummyApp);

    let command1 = new DummyCommand(module, 'test1');
    let command2 = new DummyCommand(module, 'test2');
    let command3 = new DummyCommand(module, 'test3');

    module.addCommand(command1);
    module.addCommand(command2);
    module.addCommand(command3);
    expect(module.cliCommands).toHaveLength(3);

    expect(() => module.removeCommand(command1)).not.toThrow();
    expect(module.cliCommands).toHaveLength(2);
    expect(module.cliCommands).not.toContain(command1);

    expect(() => module.removeCommand(command3)).not.toThrow();
    expect(module.cliCommands).toHaveLength(1);
    expect(module.cliCommands).not.toContain(command3);

    expect(() => module.removeCommand(command3)).not.toThrow();
    expect(module.cliCommands).toHaveLength(1);
    expect(module.cliCommands).toContain(command2);
  });
});



describe('init', () => {
  it('should not throw any errors', async () => {
    let test = new ModuleManager(dummyApp);
    await expect(test.init()).resolves.not.toThrow();
  });

  it('should init a module', async () => {
    let test = new ModuleManager(dummyApp);
    let module = new SubModuleClass(dummyApp);
    let mock = module.testInit = jest.fn();
    test.addModule(module);
    await expect(test.init()).resolves.not.toThrow();
    expect(mock).toHaveBeenCalled();
  });

  it('should init in order of add', async () => {
    let test = new ModuleManager(dummyApp);

    let module1 = new SubModuleClass(dummyApp);
    let module2 = new SubModuleClass(dummyApp);

    let lastCalled = 0;
    let mock1 = module1.testInit = jest.fn().mockImplementation(() => lastCalled = 420);
    let mock2 = module2.testInit = jest.fn().mockImplementation(() => lastCalled = 69);

    test.addModule(module1);
    test.addModule(module2);
    await test.init();

    expect(lastCalled).toEqual(69);
  });
});

describe('destroy', () => {
  it('should not throw any errors', async () => {
    let test = new ModuleManager(dummyApp);
    await expect(test.destroy()).resolves.not.toThrow();
  });
});
