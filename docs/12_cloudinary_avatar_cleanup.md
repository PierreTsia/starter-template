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

- Format: `{userId}/avatar.{timestamp}`
- Example: `63e61cb7-61bb-4128-a426-93f0fd06bdd8/avatar.1749655562832.jpg`

#### Benefits

- Clear ownership of files
- Easy to track and debug
- No need for additional storage
- Versioning through timestamps

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

- [ ] Update CloudinaryService to use deterministic naming
- [ ] Add timestamp to file names
- [ ] Update tests to verify naming convention

### Phase 2: Immediate Cleanup

- [ ] Add method to extract publicId from avatarUrl
- [ ] Implement cleanup after successful upload
- [ ] Add error handling for failed deletions
- [ ] Update tests to verify cleanup

### Phase 3: CRON Job

- [ ] Create cleanup service
- [ ] Implement CRON job
- [ ] Add logging and monitoring
- [ ] Add tests for CRON job

## Definition of Done

### Functional Requirements

- [ ] New avatars use deterministic naming
- [ ] Old avatars are deleted after successful upload
- [ ] CRON job runs weekly and cleans orphaned files
- [ ] All operations are logged
- [ ] Error cases are handled gracefully

### Technical Requirements

- [ ] No additional database tables needed
- [ ] Minimal impact on upload performance
- [ ] Proper error handling and logging
- [ ] Tests for all new functionality
- [ ] Documentation updated

### Monitoring Requirements

- [ ] Logs for all cleanup operations
- [ ] Metrics for storage usage
- [ ] Alerts for failed operations
- [ ] Dashboard for cleanup status

## Error Handling

### Upload Failures

- [ ] Clean up temporary file
- [ ] Log error with context
- [ ] Return appropriate error to user

### Deletion Failures

- [ ] Log error with context
- [ ] Don't fail the operation
- [ ] Add to CRON job cleanup list

### CRON Job Failures

- [ ] Log error with context
- [ ] Retry failed operations
- [ ] Alert if too many failures

## Testing Strategy

### Unit Tests

- [ ] File naming convention
- [ ] publicId extraction
- [ ] Cleanup operations
- [ ] Error handling

### Integration Tests

- [ ] Upload + cleanup flow
- [ ] CRON job execution
- [ ] Error scenarios

### Load Tests

- [ ] Multiple concurrent uploads
- [ ] CRON job with large dataset
- [ ] Error recovery

## Rollout Strategy

1. Deploy file naming changes
2. Deploy immediate cleanup
3. Deploy CRON job
4. Monitor and adjust

## Success Metrics

- [ ] Reduced storage usage
- [ ] No orphaned files
- [ ] Successful cleanup rate
- [ ] Error rate below threshold
- [ ] User satisfaction with upload process
