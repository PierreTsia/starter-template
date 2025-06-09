export type Messages = {
  [key: string]: string | Messages | null | undefined;
};

/**
 * Flattens a nested messages object into a flat structure with dot notation keys.
 * Example:
 * Input: { common: { settings: "Settings" } }
 * Output: { "common.settings": "Settings" }
 *
 * Note: null and undefined values are filtered out as they are not supported by react-intl
 */
export const flattenMessages = (nestedMessages: Messages, prefix = ''): Record<string, string> => {
  return Object.keys(nestedMessages).reduce((messages: Record<string, string>, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else if (value !== null && value !== undefined) {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
};
