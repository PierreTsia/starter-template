# Update User Profile

## Overview

Implement secure user profile update functionality allowing users to modify their name and password while ensuring they can only update their own information. This feature requires both frontend and backend changes to support secure profile updates with proper validation and error handling. Additionally, implement secure account deletion functionality that properly cleans up user data including Cloudinary assets.

## Frontend Implementation

### Setup

- [ ] Update existing UserProfile component
- [ ] Add password update functionality
- [ ] Implement form validation
- [ ] Add success/error notifications
- [ ] Add account deletion section

### Components

- [ ] Enhance existing UserProfile component with:
  - [ ] Name update form
  - [ ] Password update form
  - [ ] Form validation
  - [ ] Loading states
  - [ ] Error handling
  - [ ] Success notifications
  - [ ] Account deletion section
- [ ] Create PasswordUpdateForm component with:
  - [ ] Current password field
  - [ ] New password field
  - [ ] Confirm password field
  - [ ] Password strength indicator
  - [ ] Password requirements display
- [ ] Create AccountDeletionForm component with:
  - [ ] Warning message about consequences
  - [ ] Confirmation text input
  - [ ] Final confirmation dialog
  - [ ] Example: "Please type 'delete my account' to confirm"

### Form Validation

- [ ] Name validation:
  - [ ] Minimum length: 2 characters
  - [ ] Maximum length: 50 characters
  - [ ] No special characters
- [ ] Password validation:
  - [ ] Minimum length: 8 characters
  - [ ] At least one uppercase letter
  - [ ] At least one lowercase letter
  - [ ] At least one number
  - [ ] At least one special character
  - [ ] Password confirmation match

## Backend Implementation

### Security Measures

- [ ] Implement user authorization check:
  - [ ] Verify user can only update their own profile
  - [ ] Add middleware to check user ID matches
  - [ ] Log unauthorized attempts
- [ ] Password security:
  - [ ] Verify current password before allowing changes
  - [ ] Enforce password format requirements through DTO validation

### API Endpoints

- [ ] Add profile update endpoint:
  ```typescript
  PUT / api / users / profile;
  ```
  - [ ] Add authorization check
  - [ ] Add password validation
  - [ ] Add name validation
  - [ ] Add proper error responses
- [ ] Add account deletion endpoint:
  ```typescript
  DELETE /api/users/:id
  ```
  - [ ] Add authorization check
  - [ ] Add password confirmation
  - [ ] Add Cloudinary cleanup
  - [ ] Add proper error responses

### Database Changes

- [ ] Add user deletion tracking:
  ```typescript
  UserDeletion {
    id: string;
    userId: string;
    deletedAt: Date;
    reason?: string;
  }
  ```

### Cloudinary Cleanup

- [ ] Implement avatar cleanup:
  - [ ] Delete avatar from Cloudinary
  - [ ] Handle cleanup errors gracefully
  - [ ] Log cleanup operations
  - [ ] Add retry mechanism for failed deletions

## Definition of Done

### Frontend

- [ ] Name update works
- [ ] Password update works
- [ ] Form validation works
- [ ] Error states are handled
- [ ] Success notifications show
- [ ] Loading states work
- [ ] Password strength indicator works
- [ ] Responsive design works
- [ ] Account deletion works
- [ ] Deletion confirmation flow works
- [ ] Deletion success/error states handled

### Backend

- [ ] Profile update endpoint works
- [ ] Authorization checks work
- [ ] Password validation works
- [ ] Error handling is implemented
- [ ] Account deletion works
- [ ] Cloudinary cleanup works
- [ ] Deletion audit logging works

### Testing

- [ ] Name update works
- [ ] Password update works
- [ ] Authorization works
- [ ] Validation works
- [ ] Error handling works
- [ ] Edge cases are handled
- [ ] Account deletion works
- [ ] Cloudinary cleanup works
- [ ] Deletion audit logging works

### Documentation

- [ ] API endpoints documented
- [ ] Component usage documented
- [ ] Security measures documented
- [ ] Environment variables documented
- [ ] Deletion process documented

## Example Implementation

### Password Update Form

```typescript
interface PasswordUpdateFormProps {
  onSubmit: (data: PasswordUpdateData) => Promise<void>;
  isLoading: boolean;
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordUpdateForm: React.FC<PasswordUpdateFormProps> = ({ onSubmit, isLoading }) => {
  // Implementation
};
```

### Account Deletion Form

```typescript
interface AccountDeletionFormProps {
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

const AccountDeletionForm: React.FC<AccountDeletionFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const CONFIRMATION_PHRASE = 'delete my account';

  return (
    <div className="space-y-4">
      <div className="text-destructive">
        <h3 className="font-semibold">Delete Account</h3>
        <p className="text-sm">
          This action cannot be undone. This will permanently delete your account
          and remove all associated data.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm">
          Please type <span className="font-mono">{CONFIRMATION_PHRASE}</span> to confirm
        </label>
        <Input
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder={CONFIRMATION_PHRASE}
        />
      </div>

      <Button
        variant="destructive"
        disabled={confirmationText !== CONFIRMATION_PHRASE || isLoading}
        onClick={onSubmit}
      >
        {isLoading ? 'Deleting...' : 'Delete Account'}
      </Button>
    </div>
  );
};
```

### Backend Service

```typescript
interface UserProfileService {
  updateProfile(
    userId: string,
    data: {
      name?: string;
      currentPassword?: string;
      newPassword?: string;
    }
  ): Promise<User>;

  verifyPassword(userId: string, password: string): Promise<boolean>;

  deleteAccount(userId: string): Promise<void>;
}
```

## Error Handling

### Frontend Errors

- [ ] Invalid name format
- [ ] Invalid password format
- [ ] Password mismatch
- [ ] Current password incorrect
- [ ] Network error
- [ ] Server error
- [ ] Deletion confirmation text mismatch
- [ ] Deletion failed

### Backend Errors

- [ ] Unauthorized access
- [ ] Invalid input
- [ ] Password validation failed
- [ ] Database error
- [ ] Cloudinary cleanup failed

## Implementation Battle Plan

### Phase 1: Backend Security

- [ ] Implement authorization middleware
- [ ] Add password validation
- [ ] Test security measures

### Phase 2: Frontend Forms

- [ ] Update UserProfile component
- [ ] Add password update form
- [ ] Implement validation
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test forms

### Phase 3: Account Deletion

- [ ] Implement deletion endpoint
- [ ] Add Cloudinary cleanup
- [ ] Add deletion audit logging
- [ ] Create deletion form
- [ ] Add confirmation flow
- [ ] Test deletion process

### Phase 4: Integration

- [ ] Connect frontend to backend
- [ ] Test full flow
- [ ] Add monitoring
- [ ] Document changes
