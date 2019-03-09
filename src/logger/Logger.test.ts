import {
  Logger, LogLevel, LogListener, DEBUG, INFO, WARN, ERROR, SEVERE
} from './index';

class TestListener implements LogListener {
  test:jest.Mock;

  onLog(level:LogLevel, info:string|Error, logger:Logger, time:Date):void {
    this.test(level, info, logger, time);
  }
}

describe('Logger', () => {
  it('should be constructable', () => {
    expect(() => new Logger()).not.toThrow();
  });

  it('should allow a parent logger to be passed', () => {
    let loggerParent = new Logger();
    let logger = new Logger(loggerParent);
    expect(logger.parent).toEqual(loggerParent);
  });
});

describe('addListener', () => {
  it('should add a listener', () => {
    let logger = new Logger();
    let listener = new TestListener();
    logger.addListener(listener);

    expect(logger.listeners).toHaveLength(1);
    expect(logger.listeners).toContain(listener);

    let listener2 = new TestListener();
    logger.addListener(listener2);
    expect(logger.listeners).toHaveLength(2);
    expect(logger.listeners).toContain(listener2);
  });

  it('should require a real listener', () => {
    let logger = new Logger();
    expect(() => logger.addListener(null)).toThrow();
  });

  it('should not double up', () => {
    let logger = new Logger();
    let listener = new TestListener();
    logger.addListener(listener);
    expect(logger.listeners).toHaveLength(1);

    logger.addListener(listener);
    expect(logger.listeners).toHaveLength(1);
  });
});

describe('removeListener', () => {
  it('should remove a listener', () => {
    let logger = new Logger();
    let listener = new TestListener();
    logger.addListener(listener);
    expect(logger.listeners).toHaveLength(1);
    logger.removeListener(listener);
    expect(logger.listeners).toHaveLength(0);
  });

  it('should require a real listener', () => {
    let logger = new Logger();
    expect(() => logger.removeListener(null)).toThrow();
  });

  it('should remove the correct listeners', () => {
    let logger = new Logger();
    let listener1 = new TestListener();
    let listener2 = new TestListener();
    let listener3 = new TestListener();
    logger.addListener(listener1);
    logger.addListener(listener2);
    logger.addListener(listener3);

    expect(logger.listeners).toHaveLength(3);

    logger.removeListener(listener2);
    expect(logger.listeners).toHaveLength(2);
    expect(logger.listeners).not.toContain(listener2);
    expect(logger.listeners).toContain(listener1);
    expect(logger.listeners).toContain(listener3);
  });
});

describe('log', () => {
  it('should pass to the listeners', () => {
    let logger = new Logger();
    let listener = new TestListener();
    listener.test = jest.fn();
    logger.addListener(listener);

    let date = new Date();

    expect(() => {
      logger.log(DEBUG, 'Test Log', logger, date)
    }).not.toThrow();

    expect(listener.test).toHaveBeenCalledWith(DEBUG, 'Test Log', logger, date);
  });

  it('should pass to the parent logger', () => {
    let parent = new Logger();
    let child = new Logger(parent);
    let listener = new TestListener();
    listener.test = jest.fn();
    parent.addListener(listener);
    let date = new Date();

    expect(() => {
      child.log(INFO, 'Test2', child, date);
    }).not.toThrow();

    expect(listener.test).toHaveBeenCalledWith(INFO, 'Test2', child, date);
  });

  it('should default the source to the called logger and the date to now', () => {
    let parent = new Logger();
    let child = new Logger(parent);
    let listener = new TestListener();
    listener.test = jest.fn();
    parent.addListener(listener);

    expect(() => {
      child.log(ERROR, 'test3');
    }).not.toThrow();

    expect(listener.test.mock.calls[0]).toContain(ERROR)
    expect(listener.test.mock.calls[0]).toContain('test3')
    expect(listener.test.mock.calls[0]).toContain(child)
  });
});
