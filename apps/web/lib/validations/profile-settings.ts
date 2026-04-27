import { z } from "zod/v3"

const profileSettingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(120, "Display name must be 120 characters or fewer"),
  timezone: z
    .string()
    .trim()
    .max(120, "Timezone must be 120 characters or fewer")
    .optional()
    .or(z.literal("")),
  defaultLocation: z
    .string()
    .trim()
    .max(120, "Default location must be 120 characters or fewer")
    .optional()
    .or(z.literal("")),
})

type ProfileSettingsFormValues = z.input<typeof profileSettingsSchema>

export { profileSettingsSchema }
export type { ProfileSettingsFormValues }
