# Email Confirmation and Password Reset

This guide explains how to implement email confirmation for new registrations and password reset functionality using SendGrid's free tier.

---

## Checklist

- [ ] Set up SendGrid account and API key
- [ ] Configure email templates for confirmation and password reset
- [ ] Update registration flow to require email confirmation
- [ ] Implement password reset flow
- [ ] Add email confirmation status to user model
- [ ] Create frontend components for email confirmation and password reset
- [ ] Test both flows end-to-end

## PR Breakdown

### PR 1: Email Service Foundation

- [ ] Install and configure SendGrid
- [ ] Create basic EmailService with test endpoint
- [ ] Add environment variables for SendGrid
- [ ] Add unit tests for email service
- [ ] Add integration tests for test endpoint
- [ ] Document local testing setup
- [ ] Test email delivery in production

### PR 2: User Model Updates

- [ ] Add email confirmation fields to Prisma schema
- [ ] Update user model with confirmation status
- [ ] Add migration for new fields
- [ ] Update user service to handle confirmation status
- [ ] Add tests for new user model functionality

### PR 3: Registration Flow Updates

- [ ] Modify registration endpoint to require email confirmation
- [ ] Add email confirmation endpoint
- [ ] Update auth service to handle unconfirmed users
- [ ] Add tests for new registration flow
- [ ] Update frontend registration flow

### PR 4: Password Reset Implementation

- [ ] Add password reset endpoints
- [ ] Implement password reset email flow
- [ ] Add token expiration handling
- [ ] Add tests for password reset flow
- [ ] Update frontend with password reset UI

### PR 5: Frontend Components

- [ ] Create email confirmation page
- [ ] Create password reset pages
- [ ] Add loading states and error handling
- [ ] Add tests for frontend components
- [ ] Update documentation

### PR 6: Final Integration & Testing

- [ ] End-to-end testing of all flows
- [ ] Security review
- [ ] Performance testing
- [ ] Documentation updates
- [ ] Production deployment verification

---

## 1. SendGrid Setup

- Create a free SendGrid account (100 emails/day)
- Generate an API key in SendGrid dashboard
- Add SendGrid to your project:
  ```bash
  npm install @sendgrid/mail
  ```
- Store API key in environment variables:
  ```env
  SENDGRID_API_KEY=your_api_key
  SENDGRID_FROM_EMAIL=your_verified_sender@domain.com
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

- Create an email service to handle sending:

  ```typescript
  // src/services/email.service.ts
  import * as sendgrid from '@sendgrid/mail';

  @Injectable()
  export class EmailService {
    constructor() {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async sendConfirmationEmail(email: string, token: string) {
      const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;

      await sendgrid.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Confirm your email',
        html: `Click <a href="${confirmationUrl}">here</a> to confirm your email.`,
      });
    }

    async sendPasswordResetEmail(email: string, token: string) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      await sendgrid.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Reset your password',
        html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
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
- [ ] All emails are sent via SendGrid
- [ ] Frontend handles all states (loading, success, error)
- [ ] Both flows work end-to-end in production

---

**This doc is your reference for implementing secure email confirmation and password reset functionality.**
