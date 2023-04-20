// vim: sts=2 sw=2 ts=2 et ai
import semver, { SemVer } from 'semver';
import { regEx } from '../../../util/regex';
import type { GenericVersion } from '../generic';
import type { VersioningApi } from '../types';
import { api as semverCoerced } from '../semver-coerced'

export const id = 'github-actions';
export const displayName = 'Github Actions';
export const urls = [];
export const supportsRanges = false;

interface GithubActionVersion extends GenericVersion {
  raw: (number | undefined)[]
  coerced: SemVer | null;
  precision: number;
}

function _parse(version: string): GithubActionVersion | null {
  const regx = regEx(
    /^v?(?<major>\d+)(?:\.(?<minor>\d+))?(?:\.(?<patch>\d+))?(?<rest>.+)?/
  );
  const m = regx.exec(version);

  if (!m?.groups) {
    return null;
  }

  const { major, minor, patch, rest: prerelease } = m.groups
  const parts = [major, minor, patch]
  const precision = parts.filter((x) => typeof x !== 'undefined').length
  const release = parts.map((x) => typeof x === 'undefined' ? 0 : Number.parseInt(x, 10));
  const raw = parts.map((x) => typeof x === 'undefined' ? undefined : Number.parseInt(x, 10));
  const coerced = semver.coerce(version)

  return {
    release,
    prerelease,
    raw,
    coerced,
    precision,
  };
}

function isStable(version: string): boolean {
  const parsed = _parse(version);
  return !!(parsed && !parsed.prerelease);
}

function sortVersions(a: string, b: string): number {
  const v1 = _parse(a);
  const v2 = _parse(b);

  if (v1 && v2) {
    if (v1.precision == 3 && v2.precision == 3) {
      return v1.coerced && v2.coerced ? semver.compare(v1.coerced, v2.coerced) : 0;
    }

    for (let n = 0; n < 3; n++) {
      let x = v1.raw[n];
      let y = v2.raw[n];
      if (x !== undefined && y !== undefined) {
        if (x == y) {
          continue;
        }
        return x > y ? 1 : -1;
      }
      else if (x === undefined && y == undefined) {
        return 0;
      }
      else if (x === undefined) {
        return 1;
      }
      else if (y === undefined) {
        return -1;
      }
    }
  }
  throw new Error('error in sortVersions');
}

function isLessThanRange(version: string, range: string): boolean {
  return sortVersions(version, range) < 0
}

function isGreaterThan(version: string, other: string): boolean {
  return sortVersions(version, other) > 0
}

function isCompatible(version: string, current?: string): boolean {
  if (current) {
    let currentVersion = _parse(current);
    let other = _parse(version);
    if (currentVersion && other) {
      return semverCoerced.isVersion(version) && other.precision == currentVersion.precision
    }
  }
  return semverCoerced.isVersion(version);
}

export const api: VersioningApi = {
  equals: semverCoerced.equals,
  getMajor: semverCoerced.getMajor,
  getMinor: semverCoerced.getMinor,
  getPatch: semverCoerced.getPatch,
  isCompatible,
  isGreaterThan,
  isLessThanRange,
  isSingleVersion: semverCoerced.isSingleVersion,
  isStable,
  isValid: semverCoerced.isValid,
  isVersion: semverCoerced.isVersion,
  matches: semverCoerced.matches,
  getSatisfyingVersion: semverCoerced.getSatisfyingVersion,
  minSatisfyingVersion: semverCoerced.minSatisfyingVersion,
  getNewValue: semverCoerced.getNewValue,
  sortVersions,
};
export default api;
