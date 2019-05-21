import { CLICommand, ICLICommander } from './../../';

class DummyCommanderClass implements ICLICommander {
  cliCommands:CLICommand[] = [];
}

class DummyCommand extends CLICommand {
  mock:any;
  
  async onCommand(app, command, options) {
    return this.mock();
  }
}

let dummyCommander = new DummyCommanderClass();

describe('CLICommand', () => {
  it('should require a real commander', () => {
    expect(() => new DummyCommand(null, 'anything')).toThrow();
  });
  
  it('should should be constructable with a commander', () => {
    expect(() => new DummyCommand(dummyCommander, 'anything')).not.toThrow();
  });
});

describe('isAction', () => {
  it('should match on label, no matter the case', () => {
    let command = new DummyCommand(dummyCommander, 'anything');
    expect(command.isAction('anything')).toStrictEqual(true);
    expect(command.isAction('ANYTHING')).toStrictEqual(true);
    expect(command.isAction('anyThING')).toStrictEqual(true);
  });
  
  it('should return false when theres no match', () => {
    let command = new DummyCommand(dummyCommander, 'Hello');
    expect(command.isAction('world')).toStrictEqual(false);
    expect(command.isAction('hell')).toStrictEqual(false);
    expect(command.isAction('hellop')).toStrictEqual(false);
  });
  
  it('should check aliases, and still be case insensitive', () => {
    let command = new DummyCommand(dummyCommander, 'hello', ['hel', 'he', 'hellop']);
    expect(command.isAction('hel')).toStrictEqual(true);
    expect(command.isAction('HeL')).toStrictEqual(true);
    expect(command.isAction('hell')).toStrictEqual(false);
    expect(command.isAction('hELl')).toStrictEqual(false);
    expect(command.isAction('hElLo')).toStrictEqual(true);
    expect(command.isAction('helloP')).toStrictEqual(true);
  });
});