import Module from './Module';
import App from './../app/App';

//Testing Subclass
class TestApp extends App {};
class TestModule extends Module {
  testInit:jest.Mock;
  async init() { this.testInit(); }
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
