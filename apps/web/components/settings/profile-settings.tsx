"use client"

import { useEffect, useMemo } from "react"
import { useClerk } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  RiExternalLinkLine,
  RiLoader4Line,
  RiMapPinLine,
  RiTimeLine,
  RiUser3Line,
} from "@remixicon/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useDashboardUser } from "@/components/dashboard/dashboard-user-provider"
import { useCurrentUserProfile } from "@/hooks/api/use-current-user-profile"
import { useUpdateCurrentUserProfile } from "@/hooks/api/use-update-current-user-profile"
import {
  profileSettingsSchema,
  type ProfileSettingsFormValues,
} from "@/lib/validations/profile-settings"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

function ProfileSettings() {
  const clerk = useClerk()
  const router = useRouter()
  const dashboardUser = useDashboardUser()
  const { data: profile, error, isPending } = useCurrentUserProfile()
  const updateProfileMutation = useUpdateCurrentUserProfile()
  const initials = useMemo(
    () => getInitials(dashboardUser.name, dashboardUser.email),
    [dashboardUser.email, dashboardUser.name]
  )

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: dashboardUser.name,
      timezone: "",
      defaultLocation: "",
    },
  })

  useEffect(() => {
    if (!profile) {
      return
    }

    reset({
      displayName: profile.name,
      timezone: profile.timezone ?? "",
      defaultLocation: profile.defaultLocation ?? "",
    })
  }, [profile, reset])

  async function onSubmit(values: ProfileSettingsFormValues) {
    const updatedProfile = await updateProfileMutation.mutateAsync({
      displayName: values.displayName,
      timezone: values.timezone?.trim() || null,
      defaultLocation: values.defaultLocation?.trim() || null,
    })

    reset({
      displayName: updatedProfile.name,
      timezone: updatedProfile.timezone ?? "",
      defaultLocation: updatedProfile.defaultLocation ?? "",
    })
    toast.success("Profile updated")
    router.refresh()
  }

  function handleOpenUserProfile() {
    clerk.openUserProfile()
  }

  if (isPending && !profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Loading your account details.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
          <RiLoader4Line className="size-4 animate-spin" />
          Syncing your current account details…
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load your profile</AlertTitle>
            <AlertDescription>
              We could not sync your current account details. You can still try
              again or manage your account directly in Clerk.
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Profile information</CardTitle>
            <CardDescription>
              Update the name and default app preferences you use around the
              workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16" size="lg">
                    {dashboardUser.imageUrl ? (
                      <AvatarImage
                        alt={dashboardUser.name}
                        src={dashboardUser.imageUrl}
                      />
                    ) : null}
                    <AvatarFallback className="text-lg font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Managed by Clerk</p>
                    <p className="text-muted-foreground text-sm">
                      Photo, email, password, and security settings live in your
                      account portal.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleOpenUserProfile}
                >
                  <RiExternalLinkLine />
                  Edit profile
                </Button>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="settings-display-name">
                    Display name
                  </FieldLabel>
                  <Input
                    id="settings-display-name"
                    placeholder="Your name"
                    {...register("displayName")}
                  />
                  <FieldError errors={[errors.displayName]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="settings-email">
                    Email address
                  </FieldLabel>
                  <Input
                    id="settings-email"
                    type="email"
                    value={profile?.email ?? dashboardUser.email}
                    readOnly
                  />
                  <FieldDescription>
                    Email changes are handled through your Clerk account.
                  </FieldDescription>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="settings-timezone">
                      Timezone
                    </FieldLabel>
                    <Input
                      id="settings-timezone"
                      placeholder="e.g. Asia/Singapore"
                      {...register("timezone")}
                    />
                    <FieldDescription>
                      Used for timestamps, summaries, and future reminders.
                    </FieldDescription>
                    <FieldError errors={[errors.timezone]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="settings-default-location">
                      Default location
                    </FieldLabel>
                    <Input
                      id="settings-default-location"
                      placeholder="e.g. Main warehouse"
                      {...register("defaultLocation")}
                    />
                    <FieldDescription>
                      Helps prefill operational flows as the app grows.
                    </FieldDescription>
                    <FieldError errors={[errors.defaultLocation]} />
                  </Field>
                </div>
              </FieldGroup>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending || !isDirty}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <RiLoader4Line className="size-4 animate-spin" />
                      Saving profile
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account ownership</CardTitle>
            <CardDescription>
              Keep identity and security in Clerk, while Atlas stores app-level
              preferences for daily work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileOwnershipRow
              description="Name shown around the workspace shell and records."
              icon={RiUser3Line}
              label="Display name"
            />
            <ProfileOwnershipRow
              description="Email address, profile photo, password, and sign-in methods."
              icon={RiExternalLinkLine}
              label="Account details"
            />
            <ProfileOwnershipRow
              description="Local preference for how Atlas shows time-based activity."
              icon={RiTimeLine}
              label="Timezone"
            />
            <ProfileOwnershipRow
              description="Default branch, warehouse, farm, or operational location."
              icon={RiMapPinLine}
              label="Default location"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProfileOwnershipRow({
  description,
  icon: Icon,
  label,
}: {
  description: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <div className="bg-background flex items-start gap-3 rounded-lg border p-4">
      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg border">
        <Icon className="text-muted-foreground size-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}

function getInitials(name: string, email: string) {
  const nameInitials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  if (nameInitials) {
    return nameInitials
  }

  return email[0]?.toUpperCase() ?? "N"
}

export { ProfileSettings }
