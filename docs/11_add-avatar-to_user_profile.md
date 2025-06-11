# Add Avatar to User Profile

## Overview

Implement user avatar functionality using Cloudinary for image storage and management. This includes both frontend and backend changes to support avatar upload, storage, and display. For users without a custom avatar, we'll use DiceBear's identicon style to generate unique, abstract geometric patterns that are completely gender-neutral and inclusive.

## Frontend Implementation

### Setup

- [ ] Install required dependencies:
  ```bash
  pnpm add cloudinary-react @cloudinary/url-gen
  ```
- [ ] Set up Cloudinary configuration
- [ ] Create avatar upload component
- [ ] Add avatar display component

### Components

- [ ] Create AvatarUpload component with:
  - [ ] Drag and drop support
  - [ ] Image preview
  - [ ] Upload progress indicator
  - [ ] Error handling
  - [ ] File type validation
  - [ ] File size limits
- [ ] Create AvatarDisplay component with:
  - [ ] Fallback image
  - [ ] Loading state
  - [ ] Error state
  - [ ] Responsive sizing

### User Profile Integration

- [ ] Add avatar section to profile page
- [ ] Implement avatar update functionality
- [ ] Add avatar to user menu/header
- [ ] Add avatar to user list/cards

## Backend Implementation

### Default Avatar Strategy

- [ ] Implement DiceBear's identicon style as default avatar solution:
  - [ ] Generate unique, abstract geometric patterns based on user's name or email
  - [ ] Use a consistent color scheme that's accessible and visually appealing
  - [ ] Fallback to email username if name is not available
  - [ ] Example URL format: `https://api.dicebear.com/7.x/identicon/svg?seed=John&backgroundColor=b6e3f4&scale=90`
  - [ ] Benefits of identicon style:
    - Completely gender-neutral
    - Creates unique, memorable patterns
    - Works well at any size
    - Accessible and inclusive
    - Professional looking while being distinctive

### Database Changes

- [ ] Add avatar fields to User model:
  ```typescript
  avatar: {
    url: string;
    publicId: string;
    version: string;
  }
  ```

### API Endpoints

- [ ] Create avatar upload endpoint:
  ```typescript
  POST /api/users/avatar
  Content-Type: multipart/form-data
  ```
- [ ] Create avatar update endpoint:
  ```typescript
  PUT / api / users / avatar;
  ```
- [ ] Create avatar delete endpoint:
  ```typescript
  DELETE / api / users / avatar;
  ```

### Cloudinary Integration

- [ ] Set up Cloudinary configuration
- [ ] Implement upload service
- [ ] Implement image transformation service
- [ ] Add error handling
- [ ] Add cleanup for unused images

### Environment Separation Strategy

- [ ] Use folder-based separation in Cloudinary:
  - [ ] Production: `prod/avatars/`
  - [ ] Development: `dev/avatars/`
- [ ] Configure upload presets per environment:
  ```typescript
  const CLOUDINARY_FOLDER = process.env.NODE_ENV === 'production' ? 'prod/avatars' : 'dev/avatars';
  ```
- [ ] Benefits:
  - [ ] Clear separation between environments
  - [ ] Easy to manage and clean up test data
  - [ ] No risk of mixing production and development assets
  - [ ] Can set different transformation rules per environment
  - [ ] Easier to track usage and costs per environment

## Definition of Done

### Frontend

- [ ] Avatar upload works
- [ ] Avatar display works
- [ ] Image preview works
- [ ] Upload progress is shown
- [ ] Error states are handled
- [ ] Responsive design works
- [ ] Fallback image shows when needed
- [ ] Avatar updates in real-time

### Backend

- [ ] Avatar upload endpoint works
- [ ] Avatar update endpoint works
- [ ] Avatar delete endpoint works
- [ ] Cloudinary integration works
- [ ] Error handling is implemented
- [ ] Image cleanup works
- [ ] Database changes are applied

### Testing

- [ ] Upload functionality works
- [ ] Display functionality works
- [ ] Error handling works
- [ ] Image transformations work
- [ ] Cleanup works
- [ ] Edge cases are handled

### Documentation

- [ ] API endpoints documented
- [ ] Component usage documented
- [ ] Cloudinary setup documented
- [ ] Environment variables documented

## Example Implementation

### Avatar Upload Component

```typescript
interface AvatarUploadProps {
  onUpload: (file: File) => Promise<void>;
  currentAvatar?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onUpload,
  currentAvatar,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
}) => {
  // Implementation
};
```

### Backend Service

```typescript
interface AvatarService {
  upload(file: Buffer): Promise<{
    url: string;
    publicId: string;
    version: string;
  }>;

  update(
    publicId: string,
    file: Buffer
  ): Promise<{
    url: string;
    publicId: string;
    version: string;
  }>;

  delete(publicId: string): Promise<void>;
}
```

## Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_preset
```

## Error Handling

### Frontend Errors

- [ ] File too large
- [ ] Invalid file type
- [ ] Upload failed
- [ ] Network error
- [ ] Server error

### Backend Errors

- [ ] Invalid file
- [ ] Upload failed
- [ ] Cloudinary error
- [ ] Database error
- [ ] Authorization error

## Implementation Battle Plan

### Phase 1: Backend Setup

#### Cloudinary Integration

- [x] Install Cloudinary SDK
  ```bash
  pnpm add cloudinary
  ```
- [x] Set up environment variables
  ```env
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```
- [x] Create Cloudinary service
  - [x] Implement upload function with environment-based folder
  - [x] Implement delete function
  - [x] Add error handling
  - [x] Add logging
  - [x] test service

#### Database & Models

- [ ] Update User model with avatar fields
  ```typescript
  avatar: {
    url: string;
    publicId: string;
    version: string;
  }
  ```
- [ ] Create database migration
- [ ] Add avatar-related types and interfaces
- [ ] Implement avatar utility functions
  - [ ] Default avatar generation (DiceBear)
  - [ ] Avatar URL formatting

#### API Endpoints

- [ ] Create avatar upload endpoint
  ```typescript
  POST /api/users/avatar
  Content-Type: multipart/form-data
  ```
- [ ] Create avatar delete endpoint
  ```typescript
  DELETE / api / users / avatar;
  ```
- [ ] Add authentication middleware
- [ ] Add request validation
- [ ] Add error handling

### Phase 2: Frontend Setup

#### Component Development

- [ ] Create AvatarUpload component
  - [ ] Drag and drop support
  - [ ] Image preview
  - [ ] Progress indicator
  - [ ] Error handling
- [ ] Create AvatarDisplay component
  - [ ] Fallback to DiceBear
  - [ ] Loading states
  - [ ] Error states

#### Integration

- [ ] Add avatar to user profile page
- [ ] Add avatar to user menu/header
- [ ] Implement avatar update flow
- [ ] Add avatar to user list/cards

#### Testing & Polish

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Test error scenarios
- [ ] Test environment separation
- [ ] Performance testing

### Phase 3: Documentation & Deployment

#### Documentation

- [ ] API documentation
- [ ] Component documentation
- [ ] Environment setup guide
- [ ] Testing guide

#### Deployment

- [ ] Set up Cloudinary folders
- [ ] Configure production environment
- [ ] Deploy backend changes
- [ ] Deploy frontend changes

#### Final Testing & Launch

- [ ] End-to-end testing
- [ ] Load testing
- [ ] Security review
- [ ] Launch checklist
- [ ] Monitor initial usage

### Success Metrics

- [ ] All tests passing
- [ ] No environment mixing
- [ ] Successful uploads in both environments
- [ ] Proper fallback to DiceBear
- [ ] Clean error handling
- [ ] Performance within acceptable limits
