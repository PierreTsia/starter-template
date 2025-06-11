import { readFileSync } from 'fs';
import { join } from 'path';

type Messages = Record<string, string>;

describe('Language Messages', () => {
  it('should have the same keys in both language files', () => {
    const enMessages = JSON.parse(readFileSync(join(__dirname, 'en.json'), 'utf-8')) as Messages;
    const frMessages = JSON.parse(readFileSync(join(__dirname, 'fr.json'), 'utf-8')) as Messages;

    const enKeys = new Set(Object.keys(enMessages));
    const frKeys = new Set(Object.keys(frMessages));

    const missingInFr = [...enKeys].filter((key) => !frKeys.has(key));
    const missingInEn = [...frKeys].filter((key) => !enKeys.has(key));

    expect(missingInFr).toHaveLength(0);
    expect(missingInEn).toHaveLength(0);
  });
});
