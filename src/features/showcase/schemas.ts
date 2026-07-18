import { z } from 'zod'

// THE single list of what a submittable lead requires — the send button gates purely on this schema
// (formState.isValid); no requirement lives outside it. Error messages are i18n keys (validation.*).
export function makeLeadSchema(isCustom: boolean) {
  return z
    .object({
      email: z.string().min(1, { error: 'required' }).email({ error: 'invalidEmail' }),
      name: z.string(),
      phone: z.string(),
      note: z.string(),
      hasDoc: z.boolean(),
      hasDesign: z.boolean(),
      features: z.array(z.string()),
      platforms: z.array(z.string()).min(1, { error: 'required' }),
    })
    .superRefine((data, ctx) => {
      // Something to build from: selected features, own documentation, or (custom type) a note.
      const hasContent = data.hasDoc || data.features.length > 0 || (isCustom && data.note.trim().length > 0)
      if (!hasContent) {
        ctx.addIssue({ code: 'custom', path: ['features'], message: 'contentRequired' })
      }
    })
}

export type LeadFormData = z.infer<ReturnType<typeof makeLeadSchema>>

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
