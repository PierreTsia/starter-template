# Cloudinary Avatar Cleanup Strategy

## Problem Statement

Currently, when users upload new avatars, the previous avatar files remain in Cloudinary storage. This leads to:

- Unnecessary storage costs
- Orphaned files
- No clear ownership of files
- Potential security concerns with abandoned files

## Proposed Solution

Implement a hybrid approach combining:

1. Deterministic file naming
2. Immediate cleanup of old files
3. Safety net CRON job

### 1. Deterministic File Naming

#### Implementation

- [x] Format: `{userId}/avatar.{timestamp}`
- [x] Example: `63e61cb7-61bb-4128-a426-93f0fd06bdd8/avatar.1749655562832`
- [x] No file extension in public_id (handled by Cloudinary)
- [x] Timestamp in milliseconds for versioning
- [x] User ID in path for ownership

#### Benefits

- [x] Clear ownership of files
- [x] Easy to track and debug
- [x] No need for additional storage
- [x] Versioning through timestamps

### 2. Immediate Cleanup

#### Implementation

1. Extract `publicId` from current user's `avatarUrl`
2. Upload new avatar with deterministic name
3. Update user record with new `avatarUrl`
4. Delete old avatar using extracted `publicId`

#### Error Handling

- If deletion fails, log error but don't fail operation
- Failed deletions will be caught by CRON job

### 3. Safety Net CRON Job

#### Implementation

1. Query all valid `avatarUrl`s from users table
2. Extract `publicId`s from URLs
3. List all files in Cloudinary avatars folder
4. Delete files not in valid `publicId`s list

#### Schedule

- Run weekly during low-traffic periods
- Log all operations for audit

## Implementation Steps

### Phase 1: File Naming

- [x] Update CloudinaryService to use deterministic naming
- [x] Add timestamp to file names
- [x] Update tests to verify naming convention

### Phase 2: Immediate Cleanup

- [x] Add method to extract publicId from avatarUrl
- [x] Implement cleanup after successful upload
- [x] Add error handling for failed deletions
- [x] Update tests to verify cleanup

### Phase 3: CRON Job

- [ ] Create cleanup service
- [ ] Implement CRON job
- [ ] Add logging and monitoring
- [ ] Add tests for CRON job

## Definition of Done

### Functional Requirements

- [x] New avatars use deterministic naming
- [x] Old avatars are deleted after successful upload
- [ ] CRON job runs weekly and cleans orphaned files
- [x] All operations are logged
- [x] Error cases are handled gracefully

### Technical Requirements

- [x] No additional database tables needed
- [x] Minimal impact on upload performance
- [x] Proper error handling and logging
- [x] Tests for all new functionality
- [x] Documentation updated

### Monitoring Requirements

- [ ] Logs for all cleanup operations
- [ ] Metrics for storage usage
- [ ] Alerts for failed operations
- [ ] Dashboard for cleanup status

## Error Handling

### Upload Failures

- [x] Clean up temporary file
- [x] Log error with context
- [x] Return appropriate error to user

### Deletion Failures

- [x] Log error with context
- [x] Don't fail the operation
- [ ] Add to CRON job cleanup list

### CRON Job Failures

- [ ] Log error with context
- [ ] Retry failed operations
- [ ] Alert if too many failures

## Testing Strategy

### Unit Tests

- [x] File naming convention
- [ ] publicId extraction
- [ ] Cleanup operations
- [ ] Error handling

### Integration Tests

- [ ] Upload + cleanup flow
- [ ] CRON job execution
- [ ] Error scenarios
