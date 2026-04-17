export type PostStatus = 'draft' | 'review' | 'published'

export type Post = {
  id: string
  title: string
  body: string
  author: string
  tags: string[]
  category: string
  status: PostStatus
  createdAt: string
  updatedAt: string
}

export type ValidationIssue = {
  field: 'title' | 'body' | 'status' | 'post'
  code: 'REQUIRED' | 'TOO_SHORT' | 'TOO_LONG' | 'INVALID_STATUS' | 'INVALID_TYPE'
  message: string
}

export type ValidationResult = {
  valid: boolean
  issues: ValidationIssue[]
}

export type ValidationOptions = {
  minTitleLength?: number
  maxTitleLength?: number
  minBodyLength?: number
  allowLeadingTrailingWhitespace?: boolean
}

const DEFAULTS: Required<ValidationOptions> = {
  minTitleLength: 3,
  maxTitleLength: 120,
  minBodyLength: 20,
  allowLeadingTrailingWhitespace: false,
}

function withDefaults(options?: ValidationOptions): Required<ValidationOptions> {
  return { ...DEFAULTS, ...options }
}

function invalidType(field: ValidationIssue['field'], expected: string): ValidationIssue {
  return {
    field,
    code: 'INVALID_TYPE',
    message: `${field} must be a ${expected}`,
  }
}

export function validateTitle(title: string, options?: ValidationOptions): ValidationResult {
  const issues: ValidationIssue[] = []
  const opts = withDefaults(options)

  if (typeof title !== 'string') {
    issues.push(invalidType('title', 'string'))
    return { valid: false, issues }
  }

  const value = opts.allowLeadingTrailingWhitespace ? title : title.trim()

  if (value.length === 0) {
    issues.push({
      field: 'title',
      code: 'REQUIRED',
      message: 'title is required',
    })
  }

  if (value.length > 0 && value.length < opts.minTitleLength) {
    issues.push({
      field: 'title',
      code: 'TOO_SHORT',
      message: `title must be at least ${opts.minTitleLength} characters`,
    })
  }

  if (value.length > opts.maxTitleLength) {
    issues.push({
      field: 'title',
      code: 'TOO_LONG',
      message: `title must be at most ${opts.maxTitleLength} characters`,
    })
  }

  return { valid: issues.length === 0, issues }
}

export function validateBody(body: string, options?: ValidationOptions): ValidationResult {
  const issues: ValidationIssue[] = []
  const opts = withDefaults(options)

  if (typeof body !== 'string') {
    issues.push(invalidType('body', 'string'))
    return { valid: false, issues }
  }

  const value = opts.allowLeadingTrailingWhitespace ? body : body.trim()

  if (value.length === 0) {
    issues.push({
      field: 'body',
      code: 'REQUIRED',
      message: 'body is required',
    })
  }

  if (value.length > 0 && value.length < opts.minBodyLength) {
    issues.push({
      field: 'body',
      code: 'TOO_SHORT',
      message: `body must be at least ${opts.minBodyLength} characters`,
    })
  }

  return { valid: issues.length === 0, issues }
}

export function validateStatus(status: string): ValidationResult {
  const issues: ValidationIssue[] = []

  if (typeof status !== 'string') {
    issues.push(invalidType('status', 'string'))
    return { valid: false, issues }
  }

  const allowed: PostStatus[] = ['draft', 'review', 'published']
  if (!allowed.includes(status as PostStatus)) {
    issues.push({
      field: 'status',
      code: 'INVALID_STATUS',
      message: `status must be one of: ${allowed.join(', ')}`,
    })
  }

  return { valid: issues.length === 0, issues }
}

export function validatePost(post: Post, options?: ValidationOptions): ValidationResult {
  if (post === null || typeof post !== 'object' || Array.isArray(post)) {
    return {
      valid: false,
      issues: [invalidType('post', 'Post object')],
    }
  }

  const titleResult = validateTitle((post as Post).title as unknown as string, options)
  const bodyResult = validateBody((post as Post).body as unknown as string, options)
  const statusResult = validateStatus((post as Post).status as unknown as string)

  const issues = [...titleResult.issues, ...bodyResult.issues, ...statusResult.issues]
  return { valid: issues.length === 0, issues }
}

export function isPostValid(post: Post, options?: ValidationOptions): boolean {
  return validatePost(post, options).valid
}

export function getPostValidationErrors(post: Post, options?: ValidationOptions): ValidationIssue[] {
  return validatePost(post, options).issues
}
