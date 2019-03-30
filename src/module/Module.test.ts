import { Module } from './Module';
import { App } from './../app/App';

//Testing Subclass
class TestApp extends App {};
class TestModule extends Module {
  testInit:jest.Mock;
  async init() { this.testInit(); }
  async destroy() { }
}

describe('Module', () => {
  it('should require an App instance', () => {
    expect(() =>  new TestModule(null)).toThrow();
  });

  it('should be constructable', () => {
    let testApp = new TestApp();
    expect(() => new TestModule(testApp)).not.toThrow();
  });
});

describe('getName', () => {
  it('should return the name from the package data', () => {
    let module = new TestModule(new TestApp());

    expect(() => module.getName()).toThrow();

    module.package = {name: ''};
    expect(() => module.getName()).toThrow();

    module.package = {name: 'Hello World'};
    expect(module.getName()).toStrictEqual('Hello World');
  });
});
