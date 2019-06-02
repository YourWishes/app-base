import {
    getColorFromLevel, DefaultTheme, LoggerTheme,
    LogLevel
  } from './../';

describe('getColorFromLevel', () => {
  it('should return the correct color for a given level', () => {
    expect(() => getColorFromLevel(DefaultTheme, LogLevel.INFO)).not.toThrow();
    expect(getColorFromLevel(DefaultTheme, LogLevel.SUCCESS)).toEqual(DefaultTheme.success);
    expect(getColorFromLevel(DefaultTheme, LogLevel.DEBUG)).toEqual(DefaultTheme.debug);
    expect(getColorFromLevel(DefaultTheme, LogLevel.SEVERE)).toEqual(DefaultTheme.severe);
  });

  it('should return a default for any undetermined log levels', () => {
    let level = new LogLevel(1000, 'test1', 'test1');
    expect(() => getColorFromLevel(DefaultTheme, level)).not.toThrow();
  });
});