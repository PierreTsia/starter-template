import { readFileSync } from 'fs';
import { join } from 'path';

type Messages = Record<string, Record<string, string>>;

export class MessageResolver {
  private messages: Record<string, Messages> = {};
  private defaultLanguage = 'en';
  private supportedLanguages = ['en', 'fr'] as const;

  constructor() {
    this.loadMessages();
  }

  private loadMessages() {
    // Get the root directory of the project
    const rootDir = process.cwd();
    const messagesDir = join(rootDir, 'src', 'errors', 'messages');

    this.supportedLanguages.forEach((lang) => {
      try {
        const filePath = join(messagesDir, `${lang}.json`);
        const content = readFileSync(filePath, 'utf-8');
        this.messages[lang] = JSON.parse(content) as Messages;
      } catch (error) {
        console.error(`Failed to load messages for language ${lang}:`, error);
      }
    });
  }

  private interpolate(message: string, params?: Record<string, string | number | boolean>): string {
    if (!params) return message;

    return message.replace(/\{(\w+)\}/g, (match, key: keyof typeof params) => {
      const value = params[key];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Parse Accept-Language header and return the best matching language
   * @param acceptLanguage The Accept-Language header value
   * @returns The best matching language code
   */
  parseAcceptLanguage(acceptLanguage?: string): string {
    if (!acceptLanguage) return this.defaultLanguage;

    // Parse the Accept-Language header
    const languages = acceptLanguage
      .split(',')
      .map((lang) => {
        const [language, quality = 'q=1.0'] = lang.trim().split(';');
        return {
          language: language.split('-')[0], // Get primary language code
          quality: parseFloat(quality.split('=')[1] || '1.0'),
        };
      })
      .sort((a, b) => b.quality - a.quality);

    // Find the first supported language
    const preferredLanguage = languages.find((lang) =>
      this.supportedLanguages.includes(lang.language as (typeof this.supportedLanguages)[number])
    );

    return preferredLanguage?.language || this.defaultLanguage;
  }

  resolve(
    code: string,
    acceptLanguage?: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const language = this.parseAcceptLanguage(acceptLanguage);
    const [category, errorCode] = code.split('.');

    const messages = this.messages[language] || this.messages[this.defaultLanguage];

    if (!messages?.[category]?.[errorCode]) {
      console.warn(`No message found for code ${code} in language ${language}`);
      return code;
    }

    const message = messages[category][errorCode];
    return this.interpolate(message, params);
  }
}

// Export a singleton instance
export const messageResolver = new MessageResolver();
