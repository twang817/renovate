import { toMs } from './pretty-time';

describe('util/pretty-time', () => {
  test.each`
    input                | expected
    ${'1h'}              | ${1 * 60 * 60 * 1000}
    ${' 1 h '}           | ${1 * 60 * 60 * 1000}
    ${'1 h'}             | ${1 * 60 * 60 * 1000}
    ${'1 hour'}          | ${1 * 60 * 60 * 1000}
    ${'1hour'}           | ${1 * 60 * 60 * 1000}
    ${'1h 1m'}           | ${1 * 60 * 60 * 1000 + 1 * 60 * 1000}
    ${'1hour 1minute'}   | ${1 * 60 * 60 * 1000 + 1 * 60 * 1000}
    ${'1 hour 1 minute'} | ${1 * 60 * 60 * 1000 + 1 * 60 * 1000}
    ${'1h 1m 1s'}        | ${1 * 60 * 60 * 1000 + 1 * 60 * 1000 + 1000}
    ${'1h 1 m 1s'}       | ${1 * 60 * 60 * 1000 + 1 * 60 * 1000 + 1000}
    ${'1hour 1 min 1s'}  | ${1 * 60 * 60 * 1000 + 1 * 60 * 1000 + 1000}
    ${'1h 1m 1s 1ms'}    | ${1 * 60 * 60 * 1000 + 1 * 60 * 1000 + 1000 + 1}
    ${'1d2h3m'}          | ${24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 3 * 60 * 1000}
    ${'1 day'}           | ${24 * 60 * 60 * 1000}
    ${'3 days'}          | ${3 * 24 * 60 * 60 * 1000}
    ${'1 week'}          | ${7 * 24 * 60 * 60 * 1000}
    ${'1 month'}         | ${30 * 24 * 60 * 60 * 1000}
    ${'1 M'}             | ${30 * 24 * 60 * 60 * 1000}
    ${'2 months'}        | ${2 * 30 * 24 * 60 * 60 * 1000}
    ${'1month'}          | ${30 * 24 * 60 * 60 * 1000}
    ${'1M'}              | ${30 * 24 * 60 * 60 * 1000}
    ${'2months'}         | ${2 * 30 * 24 * 60 * 60 * 1000}
    ${'1 year'}          | ${365.25 * 24 * 60 * 60 * 1000}
    ${'0'.repeat(100)}   | ${0}
    ${'0'.repeat(101)}   | ${null}
    ${'1 whatever'}      | ${null}
    ${'whatever'}        | ${null}
    ${''}                | ${null}
    ${' '}               | ${null}
    ${'  \t\n   '}       | ${null}
    ${'minute'}          | ${null}
    ${'m'}               | ${null}
    ${'hour'}            | ${null}
    ${'h'}               | ${null}
  `(`toMs('$input') === $expected`, ({ input, expected }) => {
    expect(toMs(input)).toBe(expected);
  });

  it('returns null for error', () => {
    expect(toMs(null as never)).toBeNull();
  });
});
