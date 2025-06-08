# Email Confirmation and Password Reset

This guide explains how to implement email confirmation for new registrations and password reset functionality using `@nestjs-modules/mailer` with SendGrid's SMTP service.

---

## Checklist

- [x] Set up Mailgun account and SMTP credentials
- [x] Configure email templates for confirmation and password reset
- [x] Update registration flow to require email confirmation
- [x] Implement password reset flow
- [x] Add email confirmation status to user model
- [x] Create frontend components for email confirmation and password reset
- [x] Test both flows end-to-end

## PR Breakdown

### PR 1: Email Service Foundation

- [x] Install and configure @nestjs-modules/mailer
- [x] Create basic EmailService with test endpoint
- [x] Add environment variables for SMTP
- [x] Add email templates
- [x] Add unit tests for email service
- [x] Add integration tests for test endpoint
- [x] Document local testing setup
- [x] Test email delivery in production

### PR 2: User Model Updates

- [x] Add email confirmation fields to Prisma schema
- [x] Update user model with confirmation status
- [x] Add migration for new fields
- [x] Update user service to handle confirmation status
- [x] Add tests for new user model functionality

### PR 3: Registration Flow Updates

- [x] Modify registration endpoint to require email confirmation
- [x] Add email confirmation endpoint
- [x] Update auth service to handle unconfirmed users
- [x] Add tests for new registration flow
- [x] Update frontend registration flow

### PR 4: Password Reset Implementation

- [x] Add password reset endpoints
- [x] Implement password reset email flow
- [x] Add token expiration handling
- [x] Add tests for password reset flow
- [x] Update frontend with password reset UI

### PR 5: Frontend Components

- [x] Create email confirmation page
- [x] Create password reset pages
- [x] Add loading states and error handling
- [x] Add tests for frontend components
- [x] Update documentation

### PR 6: Final Integration & Testing

- [x] End-to-end testing of all flows
- [x] Security review
- [x] Performance testing
- [x] Documentation updates
- [x] Production deployment verification

---

## 1. Email Service Setup

- Install required packages:

  ```bash
  pnpm add @nestjs-modules/mailer nodemailer
  pnpm add -D @types/nodemailer
  ```

- Store SMTP credentials in environment variables:
  ```env
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_USER=apikey
  SMTP_PASS=your_sendgrid_api_key
  SMTP_FROM_EMAIL=your_verified_sender@domain.com
  ```

---

## 2. Update User Model

- Add email confirmation fields to your Prisma schema:

  ```prisma
  // prisma/schema.prisma
  model User {
    // ... existing fields ...

    isEmailConfirmed    Boolean   @default(false)
    emailConfirmationToken String?
    passwordResetToken    String?
    passwordResetExpires  DateTime?

    @@map("users")
  }
  ```

- After updating the schema, run:
  ```bash
  npx prisma generate
  npx prisma db push
  ```

---

## 3. Email Service Setup

- Create an email module with templates:

  ```typescript
  // src/email/email.module.ts
  import { Module } from '@nestjs/common';
  import { MailerModule } from '@nestjs-modules/mailer';
  import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
  import { join } from 'path';
  import { ConfigService } from '@nestjs/config';

  @Module({
    imports: [
      MailerModule.forRootAsync({
        useFactory: async (config: ConfigService) => ({
          transport: {
            host: config.get('SMTP_HOST'),
            port: config.get('SMTP_PORT'),
            secure: false,
            auth: {
              user: config.get('SMTP_USER'),
              pass: config.get('SMTP_PASS'),
            },
          },
          defaults: {
            from: config.get('SMTP_FROM_EMAIL'),
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }),
        inject: [ConfigService],
      }),
    ],
    providers: [EmailService],
    exports: [EmailService],
  })
  export class EmailModule {}
  ```

- Create email templates:

  ```handlebars
  // src/email/templates/confirmation.hbs
  <h1>Confirm Your Email</h1>
  <p>Please click the link below to confirm your email address:</p>
  <a href='{{confirmationUrl}}'>Confirm Email</a>
  ```

  ```handlebars
  // src/email/templates/reset-password.hbs
  <h1>Reset Your Password</h1>
  <p>Please click the link below to reset your password:</p>
  <a href='{{resetUrl}}'>Reset Password</a>
  <p>This link will expire in 1 hour.</p>
  ```

- Create the email service:

  ```typescript
  // src/email/email.service.ts
  import { Injectable } from '@nestjs/common';
  import { MailerService } from '@nestjs-modules/mailer';
  import { ConfigService } from '@nestjs/config';

  @Injectable()
  export class EmailService {
    constructor(
      private readonly mailerService: MailerService,
      private readonly config: ConfigService
    ) {}

    async sendConfirmationEmail(email: string, token: string) {
      const confirmationUrl = `${this.config.get('FRONTEND_URL')}/confirm-email?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirm your email',
        template: 'confirmation',
        context: {
          confirmationUrl,
        },
      });
    }

    async sendPasswordResetEmail(email: string, token: string) {
      const resetUrl = `${this.config.get('FRONTEND_URL')}/reset-password?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password',
        template: 'reset-password',
        context: {
          resetUrl,
        },
      });
    }
  }
  ```

---

## 4. Update Registration Flow

- Modify registration endpoint to:

  1. Generate confirmation token
  2. Save unconfirmed user
  3. Send confirmation email

  ```typescript
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        isEmailConfirmed: false,
        emailConfirmationToken: confirmationToken,
      },
    });

    await this.emailService.sendConfirmationEmail(
      user.email,
      confirmationToken
    );

    return { message: 'Please check your email to confirm your account' };
  }
  ```

---

## 5. Email Confirmation Endpoint

- Add endpoint to confirm email:

  ```typescript
  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailConfirmationToken: token }
    });

    if (!user) {
      throw new NotFoundException('Invalid confirmation token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailConfirmed: true,
        emailConfirmationToken: null,
      },
    });

    return { message: 'Email confirmed successfully' };
  }
  ```

---

## 6. Password Reset Flow

- Add endpoints for password reset:

  ```typescript
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If your email is registered, you will receive a reset link' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    await this.emailService.sendPasswordResetEmail(
      user.email,
      resetToken
    );

    return { message: 'If your email is registered, you will receive a reset link' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: 'Password reset successful' };
  }
  ```

---

## 7. Frontend Components

- Create confirmation page component:

  ```tsx
  // src/pages/ConfirmEmail.tsx
  const ConfirmEmail = () => {
    const [token] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
      const confirmEmail = async () => {
        try {
          await api.get(`/auth/confirm-email?token=${token}`);
          setStatus('success');
        } catch {
          setStatus('error');
        }
      };

      confirmEmail();
    }, [token]);

    return (
      <div>
        {status === 'loading' && <p>Confirming your email...</p>}
        {status === 'success' && <p>Email confirmed! You can now log in.</p>}
        {status === 'error' && <p>Invalid or expired confirmation link.</p>}
      </div>
    );
  };
  ```

- Create password reset components:

  ```tsx
  // src/pages/ForgotPassword.tsx
  const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setStatus('loading');

      try {
        await api.post('/auth/forgot-password', { email });
        setStatus('success');
      } catch {
        setStatus('idle');
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit" disabled={status === 'loading'}>
          Send Reset Link
        </button>
        {status === 'success' && <p>If your email is registered, you will receive a reset link.</p>}
      </form>
    );
  };
  ```

---

## 8. Testing

- Test registration flow:
  1. Register new user
  2. Check email received
  3. Click confirmation link
  4. Verify user can log in
- Test password reset flow:
  1. Request password reset
  2. Check email received
  3. Click reset link
  4. Set new password
  5. Verify can log in with new password

---

## Definition of Done

- [ ] New users must confirm email before logging in
- [ ] Users can request password reset via email
- [ ] Reset links expire after 1 hour
- [ ] All emails are sent via SMTP (SendGrid)
- [ ] Frontend handles all states (loading, success, error)
- [ ] Both flows work end-to-end in production

---

**This doc is your reference for implementing secure email confirmation and password reset functionality.**
