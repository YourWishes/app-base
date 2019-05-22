import {
  CLIManager, App, useCLI, CLICommand, CommandOptions
} from './../../';

//Dummy classes
class DummyApp extends App {}
class DummyCommand extends CLICommand {
  mock:any = jest.fn();

  async onCommand(app:App, action:string, options:CommandOptions) {
    return this.mock(app, action, options);
  }
}

//Dummy instances
const SampleApp = new DummyApp();

describe('Manager', () => {
  it('should require a valid app instance', () => {
    expect(() => new CLIManager(null)).toThrow();
  });

  it('should be constructable', () => {
    expect(() => new CLIManager(SampleApp)).not.toThrow();
  });
});

describe('execute', () => {

  it('should trigger the command', async () => {
    let app = new DummyApp();
    let manager = app.cli;
    let cmd = new DummyCommand(manager, 'test');
    manager.addCommand(cmd);

    expect(cmd.mock).not.toHaveBeenCalled();
    await expect(
      manager.execute(manager,'test',{flags:{},args:{}})
    ).resolves.not.toThrow();

    expect(cmd.mock).toHaveBeenCalledWith( app, 'test', {flags:{},args:{}} );
  });
});

describe('useCLI', () => {
  it('should cause an app initilization to invoke it', async () => {
    let dummyCLI = jest.fn(() => true);
    let dummyCLICB = async () => dummyCLI();
    expect(() => new DummyApp()).not.toThrow();
    expect(dummyCLI).not.toHaveBeenCalled();

    //Link
    expect(() => useCLI(dummyCLICB)).not.toThrow();

    //Should be called on init
    let app = new DummyApp();
    await expect(app.init()).resolves.not.toThrow();
    expect(dummyCLI).toHaveBeenCalled();

    //Allow unlinking
    expect(() => useCLI(null)).not.toThrow();
  });
});

describe('addCommand', () => {
  it('should require a real command', () => {
    let man = new CLIManager(SampleApp);
    expect(() => man.addCommand(null)).toThrow();
  });

  it('should add a command only once', () => {
    let man = new CLIManager(SampleApp);

    let command1 = new DummyCommand(man, 'test1');
    let command2 = new DummyCommand(man, 'test2');
    let command3 = new DummyCommand(man, 'test3');

    expect(man.cliCommands).not.toContain(command1);
    expect(man.cliCommands).toHaveLength(0);

    expect(() => man.addCommand(command1)).not.toThrow();
    expect(man.cliCommands).toContain(command1);
    expect(man.cliCommands).toHaveLength(1);

    expect(() => man.addCommand(command1)).not.toThrow();
    expect(man.cliCommands).toHaveLength(1);

    expect(() => man.addCommand(command2)).not.toThrow();
    expect(() => man.addCommand(command3)).not.toThrow();

    expect(man.cliCommands).toHaveLength(3);
  });
});

describe('removeCommand', () => {
  it('should require a real command', () => {
    let man = new CLIManager(SampleApp);
    expect(() => man.removeCommand(null)).toThrow();
  });

  it('should remove the command only once', () => {
    let man = new CLIManager(SampleApp);

    let command1 = new DummyCommand(man, 'test1');
    let command2 = new DummyCommand(man, 'test2');
    let command3 = new DummyCommand(man, 'test3');

    man.addCommand(command1);
    man.addCommand(command2);
    man.addCommand(command3);
    expect(man.cliCommands).toHaveLength(3);

    expect(() => man.removeCommand(command1)).not.toThrow();
    expect(man.cliCommands).toHaveLength(2);
    expect(man.cliCommands).not.toContain(command1);

    expect(() => man.removeCommand(command3)).not.toThrow();
    expect(man.cliCommands).toHaveLength(1);
    expect(man.cliCommands).not.toContain(command3);

    expect(() => man.removeCommand(command3)).not.toThrow();
    expect(man.cliCommands).toHaveLength(1);
    expect(man.cliCommands).toContain(command2);
  });
});
