import { z } from 'zod'

// Content Shape Validators

export const contentSchema = z.object({
  id: z.string(),
  type: z.string()
})

export const heroContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  ctas: z.array(
    z.object({
      label: z.string(),
      href: z.string()
    })
  )
})

export const industryProblemContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  bullets: z.array(z.string())
})

export const coreThesisContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  bullets: z.array(z.string())
})

export const architectureContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  layers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      icon: z.string()
    })
  )
})

export const productContentSchema = contentSchema.extend({
  name: z.string(),
  tag: z.string(),
  badge: z.string(),
  description: z.string(),
  keyFeatures: z.array(z.string()),
  variants: z.array(z.string()),
  route: z.string()
})

export const explainabilityContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      points: z.array(z.string())
    })
  )
})

export const qualityGatesContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  gates: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      signals: z.array(z.string())
    })
  ),
  keyMessage: z.string()
})

export const howItWorksContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  steps: z.array(z.string()),
  flowDescription: z.string()
})

export const researchContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  pillars: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      relevance: z.string()
    })
  )
})

export const edgeDeploymentContentSchema = contentSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  keyPrinciples: z.array(
    z.object({
      title: z.string(),
      description: z.string()
    })
  ),
  securityNote: z.string()
})

// Validation Functions
export function validate(content, schema) {
  const result = schema.safeParse(content)
  if (!result.success) {
    console.error('Content validation error:', result.error.errors)
    throw new Error(`Invalid content: ${result.error.errors[0].message}`)
  }
  return result.data
}