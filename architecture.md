

## Stage 4 Optimisations (2025-08-23)
- Added composite index `(receiverId, createdAt)` on `Message` for inbox queries.
- Introduced DataLoader in chat resolver to remove N+1 when fetching attachments.
