import { describe, it, expect } from 'vitest';

import { flattenMessages, type Messages } from '../utils';

describe('flattenMessages', () => {
  it('should flatten a simple nested object', () => {
    const input: Messages = {
      common: {
        settings: 'Settings',
        loading: 'Loading...',
      },
    };

    const expected = {
      'common.settings': 'Settings',
      'common.loading': 'Loading...',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  it('should handle deeply nested objects', () => {
    const input: Messages = {
      common: {
        settings: {
          general: 'General Settings',
          advanced: 'Advanced Settings',
        },
        loading: 'Loading...',
      },
    };

    const expected = {
      'common.settings.general': 'General Settings',
      'common.settings.advanced': 'Advanced Settings',
      'common.loading': 'Loading...',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  it('should handle multiple top-level keys', () => {
    const input: Messages = {
      common: {
        settings: 'Settings',
      },
      auth: {
        login: 'Login',
        register: 'Register',
      },
    };

    const expected = {
      'common.settings': 'Settings',
      'auth.login': 'Login',
      'auth.register': 'Register',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  it('should handle empty objects', () => {
    expect(flattenMessages({})).toEqual({});
  });

  it('should handle objects with only string values', () => {
    const input: Messages = {
      key1: 'value1',
      key2: 'value2',
    };

    const expected = {
      key1: 'value1',
      key2: 'value2',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  // Edge cases
  it('should handle objects with numeric keys', () => {
    const input: Messages = {
      '1': 'one',
      '2': {
        '3': 'three',
      },
    };

    const expected = {
      '1': 'one',
      '2.3': 'three',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  it('should handle objects with special characters in keys', () => {
    const input: Messages = {
      'user-name': 'John',
      'user.email': {
        primary: 'john@example.com',
      },
    };

    const expected = {
      'user-name': 'John',
      'user.email.primary': 'john@example.com',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  it('should handle objects with empty string keys', () => {
    const input: Messages = {
      '': 'empty key',
      nested: {
        '': 'nested empty key',
      },
    };

    const expected = {
      '': 'empty key',
      'nested.': 'nested empty key',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  it('should handle objects with very long nested paths', () => {
    const input: Messages = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 'deeply nested',
              },
            },
          },
        },
      },
    };

    const expected = {
      'a.b.c.d.e.f': 'deeply nested',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  it('should handle objects with duplicate keys at different levels', () => {
    const input: Messages = {
      key: 'top level',
      nested: {
        key: 'nested level',
        deeper: {
          key: 'deepest level',
        },
      },
    };

    const expected = {
      key: 'top level',
      'nested.key': 'nested level',
      'nested.deeper.key': 'deepest level',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });

  it('should filter out null and undefined values', () => {
    const input = {
      key1: null,
      key2: undefined,
      key3: 'valid string',
      nested: {
        key4: null,
        key5: 'another valid string',
      },
    } as Messages;

    const expected = {
      key3: 'valid string',
      'nested.key5': 'another valid string',
    };

    expect(flattenMessages(input)).toEqual(expected);
  });
});
