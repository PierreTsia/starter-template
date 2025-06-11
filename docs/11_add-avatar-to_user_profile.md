# Add Avatar to User Profile

## Overview

Implement user avatar functionality using Cloudinary for image storage and management. This includes both frontend and backend changes to support avatar upload, storage, and display.

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
