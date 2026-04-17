# PostKit Validation Library
Validate post data before saving or publishing.

## Installation
```bash
npm i postkit-validation-library
```

## API
### validateTitle
Validate a post title.

Takes in a title string and returns a validation result indicating whether the title is acceptable.

```ts
validateTitle(title: string, options?: ValidationOptions): ValidationResult
```

### validateBody
Validate post body text.

Takes in a body string and returns a validation result indicating whether the content body is acceptable.

```ts
validateBody(body: string, options?: ValidationOptions): ValidationResult
```

### validateStatus
Validate post status.

Takes in a status string and returns a validation result indicating whether the status is one of the allowed values.

```ts
validateStatus(status: string): ValidationResult
```

### validatePost
Validate a full post object.

Takes in a Post object and returns a validation result indicating whether the post is valid as a whole.

```ts
validatePost(post: Post, options?: ValidationOptions): ValidationResult
```

### isPostValid
Quick check for full-post validity.

Takes in a Post object and returns a boolean.

```ts
isPostValid(post: Post, options?: ValidationOptions): boolean
```

### getPostValidationErrors
Return only validation issues for display.

Takes in a Post object and returns a list of validation issues.

```ts
getPostValidationErrors(post: Post, options?: ValidationOptions): ValidationIssue[]
```

## Types
```ts
interface Post {
  id: string
  title: string
  body: string
  author: string
  tags: string[]
  category: string
  status: string
  createdAt: string
  updatedAt: string
}

interface ValidationIssue {
  field: 'title' | 'body' | 'status' | 'post'
  code: 'REQUIRED' | 'TOO_SHORT' | 'TOO_LONG' | 'INVALID_STATUS' | 'INVALID_TYPE'
  message: string
}

interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
}

type PostStatus = 'draft' | 'review' | 'published'
```

## Example Usage
```ts
import {
  validateTitle,
  validateBody,
  validateStatus,
  validatePost,
} from 'postkit-validation-library'

const post = {
  id: 'p1',
  title: 'Hello World',
  body: 'Some content for the post body with enough length.',
  author: 'Author',
  tags: ['writing'],
  category: 'General',
  status: 'published',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

validateTitle('My First Post')
// -> { valid: true, issues: [] }

validateTitle('')
// -> { valid: false, issues: [{ field: 'title', code: 'REQUIRED', message: 'title is required' }] }

validateBody('Some content for the post body.')
// -> { valid: true, issues: [] }

validateStatus('draft')
// -> { valid: true, issues: [] }

validateStatus('pending')
// -> { valid: false, issues: [{ field: 'status', code: 'INVALID_STATUS', message: 'status must be one of: draft, review, published' }] }

validatePost(post)
// -> { valid: true, issues: [] }

validatePost({ ...post, title: '', body: '', status: 'bad' as any })
// -> { valid: false, issues: [{...}, {...}, {...}] }
```

## Edge Cases
- Empty or whitespace-only title should fail.
- Body text that is empty or too short should fail.
- Invalid status values (including wrong casing like "Draft") should fail.
- Missing fields in partially filled form data should return issues, not crash.
- Leading/trailing whitespace should be handled consistently by validation rules.
- Non-object inputs to validatePost (for example null or []) return INVALID_TYPE.
- Type mismatches (non-string title/body/status) return INVALID_TYPE.

## Design Notes
- Main validators return a consistent ValidationResult shape for predictable app integration.
- Convenience helpers are included for common UI flows: boolean checks and field error rendering.
- validatePost aggregates title, body, and status checks so rules stay consistent in one place.
- Validators return structured issues instead of throwing on common invalid input.
