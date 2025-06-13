# Backend Internationalization v2

## Overview

Refactor the current custom internationalization implementation to use the official `nestjs-i18n` package. This refactoring will be done incrementally to ensure no breaking changes and maintain existing functionality while improving the translation system.

## Current Implementation

### Custom Translation System

- Uses request headers for language detection
- Custom error translation mechanism
- Manual translation key management
- Limited to error messages

### Limitations

- No type safety for translation keys
- No built-in fallback languages
- No support for nested translations
- No variable formatting
- No pluralization support
- Manual maintenance of translation files

## Migration Plan

### Phase 1: Setup and New Features

#### Setup

- [ ] Install required dependencies:
  ```bash
  pnpm add nestjs-i18n
  ```
- [ ] Configure i18n module in `app.module.ts`:

  ```typescript
  import { I18nModule } from 'nestjs-i18n';
  import * as path from 'path';

  @Module({
    imports: [
      I18nModule.forRoot({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
    ],
  })
  ```

- [ ] Create initial translation structure:
  ```
  src/
  └── i18n/
      ├── en/
      │   └── common.json
      │   └── errors.json
      │   └── users.json
      └── fr/
          └── common.json
          └── errors.json
          └── users.json
  ```

#### New Features Implementation

- [ ] Add translations for new features first:
  - [ ] User profile updates
  - [ ] Account deletion
  - [ ] Password changes
- [ ] Use i18n service in new controllers
- [ ] Add type-safe translation keys
- [ ] Implement variable formatting
- [ ] Add pluralization support where needed

### Phase 2: Gradual Replacement

#### Error Messages

- [ ] Create error translation files:
  ```json
  // errors.json
  {
    "validation": {
      "invalidEmail": "Invalid email format",
      "passwordTooShort": "Password must be at least 8 characters"
    },
    "auth": {
      "unauthorized": "Unauthorized access",
      "invalidCredentials": "Invalid credentials"
    }
  }
  ```
- [ ] Replace custom error translations one by one:
  - [ ] Start with less critical errors
  - [ ] Test each replacement thoroughly
  - [ ] Keep both systems running in parallel initially

#### Success Messages

- [ ] Add success message translations
- [ ] Implement in new features first
- [ ] Gradually replace existing messages

### Phase 3: Cleanup and Optimization

#### Code Cleanup

- [ ] Remove custom translation implementation
- [ ] Update all controllers to use i18n service
- [ ] Remove old translation files
- [ ] Clean up any unused code

#### Optimization

- [ ] Implement caching for translations
- [ ] Add language detection strategies
- [ ] Optimize bundle size
- [ ] Add performance monitoring

## Implementation Details

### Translation Service Usage

```typescript
// Before
@Injectable()
export class CustomTranslationService {
  translate(key: string, lang: string): string {
    // Custom implementation
  }
}

// After
@Injectable()
export class TranslationService {
  constructor(private i18n: I18nService) {}

  async translate(key: string, lang: string, args?: any): Promise<string> {
    return this.i18n.translate(key, {
      lang,
      args,
    });
  }
}
```

### Controller Implementation

```typescript
// Before
@Controller('users')
export class UsersController {
  constructor(private translationService: CustomTranslationService) {}

  @Get()
  async findAll(@Headers('accept-language') lang: string) {
    const error = this.translationService.translate('errors.notFound', lang);
    // ...
  }
}

// After
@Controller('users')
export class UsersController {
  constructor(private i18n: I18nService) {}

  @Get()
  async findAll(@I18nLang() lang: string) {
    const error = await this.i18n.translate('errors.notFound', { lang });
    // ...
  }
}
```

## Definition of Done

### Phase 1

- [ ] nestjs-i18n package installed and configured
- [ ] Basic translation structure set up
- [ ] New features using i18n
- [ ] Type-safe translation keys implemented
- [ ] Variable formatting working
- [ ] Pluralization support added

### Phase 2

- [ ] Error messages migrated to i18n
- [ ] Success messages migrated to i18n
- [ ] All new features using i18n
- [ ] No regression in existing functionality
- [ ] All translations properly typed

### Phase 3

- [ ] Custom translation system removed
- [ ] All controllers using i18n service
- [ ] Old translation files removed
- [ ] Performance optimizations implemented
- [ ] Documentation updated

## Testing Strategy

### Unit Tests

- [ ] Translation service tests
- [ ] Language detection tests
- [ ] Fallback language tests
- [ ] Variable formatting tests
- [ ] Pluralization tests

### Integration Tests

- [ ] API response language tests
- [ ] Error message translation tests
- [ ] Success message translation tests
- [ ] Language header tests

### Performance Tests

- [ ] Translation loading time
- [ ] Memory usage
- [ ] Bundle size impact

## Rollback Plan

### Triggers for Rollback

- Critical translation failures
- Performance degradation
- Breaking changes in existing features

### Rollback Steps

1. Revert to custom translation system
2. Restore old translation files
3. Update controllers to use old system
4. Verify all translations work
5. Document issues for future attempt

## Documentation

### Technical Documentation

- [ ] i18n configuration
- [ ] Translation file structure
- [ ] Usage examples
- [ ] Best practices

### User Documentation

- [ ] Supported languages
- [ ] Language selection
- [ ] Translation contribution guide
