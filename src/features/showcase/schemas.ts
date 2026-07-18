import { z } from 'zod'

// THE single list of what a submittable lead requires — the send button gates purely on this schema
// (formState.isValid); no requirement lives outside it. Error messages are i18n keys (validation.*).
// Deliberately minimal: an email alone is a valuable lead — qualification is S0's job, not the form's.
export const leadSchema = z.object({
  email: z.string().min(1, { error: 'required' }).email({ error: 'invalidEmail' }),
  name: z.string(),
  phone: z.string(),
  note: z.string(),
  hasDoc: z.boolean(),
  hasDesign: z.boolean(),
  features: z.array(z.string()),
  platforms: z.array(z.string()).min(1, { error: 'required' }),
})

export type LeadFormData = z.infer<typeof leadSchema>

export const LEAD_FORM_DEFAULTS: LeadFormData = {
  email: '',
  name: '',
  phone: '',
  note: '',
  hasDoc: false,
  hasDesign: false,
  features: [],
  platforms: ['web'],
}
