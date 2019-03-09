import { padWith } from './';

describe('padWidth', () => {
  it('should pad the supplied string or number with the supplied zeros needed', () => {
    expect(padWith('apple', 10)).toStrictEqual('00000apple');
    expect(padWith(5, 3)).toStrictEqual('005');
  });

  it('should pad the supplied string or number with the supplied amount of characters', () => {
    expect(padWith('test', 8, '!')).toStrictEqual('!!!!test');
    expect(padWith(9, 4, 'x')).toStrictEqual('xxx9');
  });
});
