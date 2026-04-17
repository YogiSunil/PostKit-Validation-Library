# Postkit: Validation Library
Validate post data before saving or publishing.

## Installation
npm i postkit-validation

## API
### validateTitle
Validate a post title.

Takes in a title string and returns a validation result indicating whether the title is acceptable.

validateTitle(title: string): ValidationResult

### validateBody
Validate post body text.

Takes in a body string and returns a validation result indicating whether the content body is acceptable.

validateBody(body: string): ValidationResult

### validateStatus
Validate post status.

Takes in a status string and returns a validation result indicating whether the status is one of the allowed values.

validateStatus(status: string): ValidationResult

### validatePost
Validate a full post object.

Takes in a Post object and returns a validation result indicating whether the post is valid as a whole.

validatePost(post: Post): ValidationResult

### isPostValid
Quick check for full-post validity.

Takes in a Post object and returns a boolean.

isPostValid(post: Post): boolean

### getPostValidationErrors
Return only validation issues for display.

Takes in a Post object and returns a list of validation issues.

getPostValidationErrors(post: Post): ValidationIssue[]

## Usage
import {
  validateTitle,
  validateBody,
  validateStatus,
  validatePost,
  isPostValid,
  getPostValidationErrors,
} from "postkit-validation-sunil";

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

## Edge Cases
- Empty or whitespace-only title should fail.
- Body text that is empty or too short should fail.
- Invalid status values (including wrong casing like "Draft") should fail.
- Missing fields in partially filled form data should return issues, not crash.
- Leading/trailing whitespace should be handled consistently by validation rules.

## Design Notes
- Main validators return a consistent ValidationResult shape for predictable app integration.
- Convenience helpers are included for common UI flows: boolean checks and field error rendering.
- validatePost aggregates title, body, and status checks so rules stay consistent in one place.
- Validators return structured issues instead of throwing on common invalid input.
