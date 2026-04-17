import {
  getPostValidationErrors,
  isPostValid,
  type Post,
  validateBody,
  validatePost,
  validateStatus,
  validateTitle,
} from '../src/index'
import { describe, expect, it } from 'vitest'

const validPost: Post = {
  id: 'p1',
  title: 'A Valid Title',
  body: 'This body has enough characters to pass validation.',
  author: 'Author',
  tags: ['writing'],
  category: 'General',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('validateTitle', () => {
  it('returns valid true for a normal title', () => {
    const result = validateTitle('My Good Title')
    expect(result.valid).toBe(true)
    expect(result.issues).toHaveLength(0)
  })

  it('fails when title is too short', () => {
    const result = validateTitle('Hi')
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'TOO_SHORT')).toBe(true)
  })

  it('fails for whitespace-only title (edge case)', () => {
    const result = validateTitle('   ')
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'REQUIRED')).toBe(true)
  })
})

describe('validateBody', () => {
  it('returns valid true for sufficient body text', () => {
    const result = validateBody('This is long enough to pass the default minimum.')
    expect(result.valid).toBe(true)
    expect(result.issues).toHaveLength(0)
  })

  it('fails when body is too short', () => {
    const result = validateBody('Too short')
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'TOO_SHORT')).toBe(true)
  })

  it('fails for empty body (edge case)', () => {
    const result = validateBody('')
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'REQUIRED')).toBe(true)
  })
})

describe('validateStatus', () => {
  it('accepts draft as valid status', () => {
    const result = validateStatus('draft')
    expect(result.valid).toBe(true)
  })

  it('accepts published as valid status', () => {
    const result = validateStatus('published')
    expect(result.valid).toBe(true)
  })

  it('rejects wrong case status (edge case)', () => {
    const result = validateStatus('Draft')
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'INVALID_STATUS')).toBe(true)
  })
})

describe('validatePost', () => {
  it('returns valid true for a complete valid post', () => {
    const result = validatePost(validPost)
    expect(result.valid).toBe(true)
    expect(result.issues).toHaveLength(0)
  })

  it('aggregates field issues for invalid post data', () => {
    const result = validatePost({ ...validPost, title: 'Hi', status: 'bad' as never })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.field === 'title')).toBe(true)
    expect(result.issues.some((i) => i.field === 'status')).toBe(true)
  })

  it('fails when input is not an object (edge case)', () => {
    const result = validatePost(null as never)
    expect(result.valid).toBe(false)
    expect(result.issues[0].field).toBe('post')
    expect(result.issues[0].code).toBe('INVALID_TYPE')
  })
})

describe('isPostValid', () => {
  it('returns true for a valid post', () => {
    expect(isPostValid(validPost)).toBe(true)
  })

  it('returns false for an invalid post', () => {
    expect(isPostValid({ ...validPost, body: 'short' })).toBe(false)
  })

  it('returns false for invalid input (edge case)', () => {
    expect(isPostValid(123 as never)).toBe(false)
  })
})

describe('getPostValidationErrors', () => {
  it('returns an empty list for a valid post', () => {
    expect(getPostValidationErrors(validPost)).toEqual([])
  })

  it('returns field issues for invalid post', () => {
    const issues = getPostValidationErrors({ ...validPost, title: 'Hi' })
    expect(issues.length).toBeGreaterThan(0)
    expect(issues.some((i) => i.field === 'title')).toBe(true)
  })

  it('returns post-level invalid type issue for non-object input (edge case)', () => {
    const issues = getPostValidationErrors([] as never)
    expect(issues).toHaveLength(1)
    expect(issues[0].field).toBe('post')
    expect(issues[0].code).toBe('INVALID_TYPE')
  })
})
