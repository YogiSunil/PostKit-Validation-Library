# Postkit: Validation Library
Validate post data before saving or publishing.

## Installation
```bash
npm i postkit-validation
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

### ValidationResult shape
```ts
ValidationResult = {
  valid: boolean
  issues: ValidationIssue[]
}
```

ValidationIssue.code values:
- REQUIRED
- TOO_SHORT
- TOO_LONG
- INVALID_STATUS
- INVALID_TYPE

## Usage
```ts
import {
  validateTitle,
  validateBody,
  validateStatus,
  validatePost,
  isPostValid,
  getPostValidationErrors,
} from "postkit-validation";

const post = {
  id: "p1",
  title: "My First Draft",
  body: "This is the body of my post with enough content to pass.",
  author: "Sunil",
  tags: ["writing", "intro"],
  category: "General",
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

console.log(validateTitle(post.title).valid); // true
console.log(validateBody(post.body).valid); // true
console.log(validateStatus(post.status).valid); // true

const result = validatePost(post);
console.log(result.valid); // true

console.log(isPostValid(post)); // true
console.log(getPostValidationErrors(post)); // []

const invalid = validatePost({ ...post, title: "Hi", status: "Draft" });
console.log(invalid.valid); // false
console.log(invalid.issues.map((x) => x.code)); // ["TOO_SHORT", "INVALID_STATUS"]
```

## Edge Cases
- Empty or whitespace-only title should fail.
- Body text that is empty or too short should fail.
- Invalid status values (including wrong casing like "Draft") should fail.
- Missing fields in partially filled form data should return issues, not crash.
- Leading/trailing whitespace should be handled consistently by validation rules.
- Non-object inputs to validatePost (for example null or []) return INVALID_TYPE.
- Type mismatches (non-string title/body/status) return INVALID_TYPE.

## Changes From Week 1 API Proposal
- Package name changed from postkit-validation-sunil to postkit-validation.
- Optional ValidationOptions are now part of validateTitle, validateBody, validatePost, isPostValid, and getPostValidationErrors.
- Error behavior is now explicitly documented with structured ValidationIssue codes.

## Design Notes
- Main validators return a consistent ValidationResult shape for predictable app integration.
- Convenience helpers are included for common UI flows: boolean checks and field error rendering.
- validatePost aggregates title, body, and status checks so rules stay consistent in one place.
- Validators return structured issues instead of throwing on common invalid input.
