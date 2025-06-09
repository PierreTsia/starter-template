import { describe, it, expect } from 'vitest';

import enMessages from '../locales/en.json';
import frMessages from '../locales/fr.json';

type Messages = {
  [key: string]: string | Messages;
};

function getAllKeys(obj: Messages, prefix = ''): string[] {
  return Object.entries(obj).reduce<string[]>((keys, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      return [...keys, newKey];
    }
    return [...keys, ...getAllKeys(value as Messages, newKey)];
  }, []);
}

describe('Locales', () => {
  it('should have the same keys in both locales', () => {
    const enKeys = getAllKeys(enMessages);
    const frKeys = getAllKeys(frMessages);

    // Check for missing keys in French
    const missingInFr = enKeys.filter((key) => !frKeys.includes(key));
    expect(missingInFr, 'Missing keys in French locale').toHaveLength(0);

    // Check for missing keys in English
    const missingInEn = frKeys.filter((key) => !enKeys.includes(key));
    expect(missingInEn, 'Missing keys in English locale').toHaveLength(0);
  });

  it('should have no empty values', () => {
    const checkEmptyValues = (obj: Messages, path = ''): string[] => {
      return Object.entries(obj).reduce<string[]>((emptyPaths, [key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === 'string') {
          if (!value.trim()) {
            return [...emptyPaths, currentPath];
          }
          return emptyPaths;
        }
        return [...emptyPaths, ...checkEmptyValues(value as Messages, currentPath)];
      }, []);
    };

    const emptyInEn = checkEmptyValues(enMessages);
    expect(emptyInEn, 'Empty values found in English locale').toHaveLength(0);

    const emptyInFr = checkEmptyValues(frMessages);
    expect(emptyInFr, 'Empty values found in French locale').toHaveLength(0);
  });
});
