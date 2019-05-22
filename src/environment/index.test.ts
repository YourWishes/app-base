import { Environment, getEnvironmentFromString, getEnvironments } from './';

describe('getEnvironments', () => {
  it('should return an array of environments', () => {
    expect(getEnvironments()).toBeDefined();
    expect(getEnvironments().length).toBeGreaterThan(0);
  });
});

describe('getEnvironmentFromString', () => {
  it('should default to production when theres is no matching environment', () => {
    expect(getEnvironmentFromString(null)).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString(undefined)).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString('')).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString('testing')).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString('dummy')).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString('dev')).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString('DEVELOPMENTSTAGING')).toStrictEqual(Environment.PRODUCTION);
  });

  it('should return the appropriate environment', () => {
    expect(getEnvironmentFromString('production')).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString('development')).toStrictEqual(Environment.DEVELOPMENT);
    expect(getEnvironmentFromString('staging')).toStrictEqual(Environment.STAGING);
    expect(getEnvironmentFromString('PRODuction')).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString('PRODUCTION')).toStrictEqual(Environment.PRODUCTION);
    expect(getEnvironmentFromString('test')).toStrictEqual(Environment.DEVELOPMENT);
  });
});
