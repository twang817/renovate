import githubActions from '.';

describe('modules/versioning/github-actions/index', () => {
  describe('.sortVersions(a, b)', () => {
    it('should return zero for equal versions', () => {
      expect(githubActions.sortVersions('1.0.0', '1.0.0')).toBe(0);
    });

    it('should return -1 for a < b', () => {
      expect(githubActions.sortVersions('1.0.0', '1.0.1')).toBe(-1);
    });

    it('should return 1 for a > b', () => {
      expect(githubActions.sortVersions('1.0.1', '1.0.0')).toBe(1);
    });

    it('should return 0 for equal non-strict versions', () => {
      expect(githubActions.sortVersions('1.0', '1.0')).toBe(0);
    });

    it('should return 0 for equal non-strict versions', () => {
      expect(githubActions.sortVersions('1', '1')).toBe(0);
      expect(githubActions.sortVersions('1.0', '1.0')).toBe(0);
    });

    it('should return 1 for a is less precise than b', () => {
      expect(githubActions.sortVersions('1', '1.0.1')).toBe(1);
      expect(githubActions.sortVersions('1', '1.1.1')).toBe(1);
      expect(githubActions.sortVersions('1', '1.0')).toBe(1);
      expect(githubActions.sortVersions('1', '1.1')).toBe(1);
      expect(githubActions.sortVersions('1.0', '1.0.1')).toBe(1);
    });

    it('should return -1 for a is less precise than b, but a < b in explicit version numbers', () => {
      expect(githubActions.sortVersions('1', '2.0.0')).toBe(-1);
      expect(githubActions.sortVersions('1.0', '2.0.0')).toBe(-1);
      expect(githubActions.sortVersions('1.0', '1.1.0')).toBe(-1);
    });
  });


  describe('.matches(version, range)', () => {
    it('should return true when version is in range', () => {
      expect(githubActions.matches('1.0.0', '1.0.0 || 1.0.1')).toBeTrue();
    });

    it('should return true when version a match', () => {
      expect(githubActions.matches('1.0.0', '1.0.0')).toBeTrue();
      expect(githubActions.matches('1.0.1', '1.0.1')).toBeTrue();
      expect(githubActions.matches('1.1.0', '1.1.0')).toBeTrue();
      expect(githubActions.matches('1.1', '1.1')).toBeTrue();
      expect(githubActions.matches('1', '1')).toBeTrue();
    });

    it('should return true with non-strict version in range', () => {
      expect(githubActions.matches('1.0', '1.0.0 || 1.0.1')).toBeTrue();
      expect(githubActions.matches('1.0.0', '1')).toBeTrue();
      expect(githubActions.matches('1.0.1', '1')).toBeTrue();
      expect(githubActions.matches('1.1.0', '1')).toBeTrue();
    });

    it('should return false when version is not in range', () => {
      expect(githubActions.matches('1.2.3', '1.4.1 || 1.4.2')).toBeFalse();
      expect(githubActions.matches('1.2', '1.4.1 || 1.4.2')).toBeFalse();
      expect(githubActions.matches('1.2.1', '1.4 || 1.3')).toBeFalse();
      expect(githubActions.matches('2.0.0', '1')).toBeFalse();
    });
  });
});
