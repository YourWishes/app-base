import { getPackageVersion } from './';

describe('getPackageVersion', () => {
  it('should throw an error on an invalid version string', () => {
    'bad,1.2.3.4,456,1.1.2.3,!@#!@#,...'.split(',').forEach(e => {
      expect(() => getPackageVersion(e)).toThrow();
    });
  });

  it('should parse a valid version string', () => {
    [
      ['1.2.3', [1,2,3]],
      ['10.4.5', [10,4,5]],
      ['^9.12.10', [9,12,10]]
    ].forEach(e => {
      let [ str, arr ] = e;
      expect(getPackageVersion(str as string)).toStrictEqual(arr);
    });
  });
});
