# Feature: Document State Persistence by File Hash

## Summary
Implement automatic saving and restoration of document fields based on the PDF file's hash. When a user re-selects a previously edited PDF, all fields and their configurations should be automatically restored, allowing them to resume editing where they left off.

## User Story
As a user, when I select a PDF file that I've previously added fields to, I want all my fields to be automatically restored with their positions and content, so I can continue editing without having to recreate everything from scratch.

## Acceptance Criteria

### Saving State
- [x] When a user adds, modifies, or removes a field in a document, generate a hash of the PDF file using the existing `hashFile` utility method
- [x] Persist the following data, the same way other user data is persisted, keyed by the file hash:
  - Document hash (for verification)
  - Array of text fields with:
    - Field ID
    - Text content
    - Position (x, y coordinates)
    - Font settings (family, size, color, etc.)
  - Array of signature fields with:
    - Signature ID
    - Position (x, y coordinates)
    - Size (width, height)
  - Timestamp of last modification
- [x] Auto-save should trigger on any field change (debounced to avoid excessive writes)

### Restoring State
- [x] When a PDF file is selected, compute its hash before rendering
- [x] Check database for existing state associated with that hash
- [x] If state exists:
  - Restore all text fields with their content, positions, and formatting
  - Restore all signature fields with their IDs, positions, and sizes
  - Display a subtle notification: "Restored [X] fields from previous session"

### Edge Cases
- [x] Handle corrupted or invalid saved data gracefully (clear and start fresh)
- [x] If the same filename but different content is selected, treat as a new document (hash will differ)

### Implementation Notes
- Use debouncing (300-500ms) when saving state to avoid excessive writes
- The `hashFile` utility in `@utils.ts` should return a consistent hash for identical files
