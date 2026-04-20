import { useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { getProfile, upsertProfile } from '../api/profile'
import ProfileAlert from '../components/profile/ProfileAlert'
import ProfileGeneralInfoSection from '../components/profile/ProfileGeneralInfoSection'
import ProfileGithubSection from '../components/profile/ProfileGithubSection'
import ProfileTopNav from '../components/profile/ProfileTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAuth } from '../contexts/AuthContext'

type ProfileFormState = {
  fullName: string
  email: string
  phone: string
  address: string
  githubLabel: string
  githubUsername: string
}

function toGithubUsername(value: string | null) {
  if (!value) {
    return ''
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.hostname.toLowerCase().includes('github.com')) {
      return parsed.pathname.replace(/^\/+/, '').replace(/\/+$/, '')
    }
  } catch {
    // Fallback for username-style values.
  }

  return trimmed.replace(/^https?:\/\/github\.com\//i, '').replace(/^github\.com\//i, '').replace(/^@/, '').replace(/\/+$/, '')
}

function toGithubUrl(username: string) {
  const cleaned = username.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/^github\.com\//i, '').replace(/^@/, '').replace(/\/+$/, '')
  return cleaned ? `https://github.com/${cleaned}` : undefined
}

function mapProfileToFormState(
  profile: {
    full_name: string
    email: string
    phone: string | null
    address: string | null
    github_label: string | null
    github_url: string | null
  },
): ProfileFormState {
  return {
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone ?? '',
    address: profile.address ?? '',
    githubLabel: profile.github_label ?? 'GitHub',
    githubUsername: toGithubUsername(profile.github_url),
  }
}

function createInitialFormState(email = ''): ProfileFormState {
  return {
    fullName: '',
    email,
    phone: '',
    address: '',
    githubLabel: 'GitHub',
    githubUsername: '',
  }
}

function ProfileScreen() {
  const { user } = useAuth()
  const [formState, setFormState] = useState<ProfileFormState>(() => createInitialFormState(user?.email))
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadProfile() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const profile = await getProfile()

        if (!isActive) {
          return
        }

        setFormState(mapProfileToFormState(profile))
      } catch (error) {
        if (!isActive) {
          return
        }

        if (error instanceof ApiError && error.status === 404) {
          setFormState((previous) => ({
            ...previous,
            email: previous.email || user?.email || '',
          }))
        } else {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load profile')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isActive = false
    }
  }, [user?.email])

  function updateField(field: keyof ProfileFormState, value: string) {
    setFormState((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function clearGeneralInfo() {
    setFormState((previous) => ({
      ...previous,
      fullName: '',
      email: user?.email ?? '',
      phone: '',
      address: '',
    }))
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  function clearGithubInfo() {
    setFormState((previous) => ({
      ...previous,
      githubLabel: 'GitHub',
      githubUsername: '',
    }))
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  async function saveProfile() {
    const fullName = formState.fullName.trim()
    const email = formState.email.trim()

    if (!fullName || !email) {
      setErrorMessage('Full name and email are required before saving profile changes.')
      setSuccessMessage(null)
      return
    }

    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const saved = await upsertProfile({
        full_name: fullName,
        email,
        phone: formState.phone.trim() || undefined,
        address: formState.address.trim() || undefined,
        github_label: formState.githubLabel.trim() || 'GitHub',
        github_url: toGithubUrl(formState.githubUsername),
      })

      setFormState(mapProfileToFormState(saved))
      setSuccessMessage('Profile saved successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save profile changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ProfileTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Profile Management"
          description="Manage your public information and developer presence across the Career Engine platform."
        />

        {isLoading ? (
          <div role="status" className="alert alert-info">
            <span>Loading profile...</span>
          </div>
        ) : null}

        {errorMessage ? (
          <div role="alert" className="alert alert-error">
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {successMessage ? (
          <div role="status" className="alert alert-success">
            <span>{successMessage}</span>
          </div>
        ) : null}

        <div className='space-y-8'>
          <ProfileGeneralInfoSection
            values={{
              fullName: formState.fullName,
              email: formState.email,
              phone: formState.phone,
              address: formState.address,
            }}
            disabled={isLoading}
            isSaving={isSaving}
            onChange={updateField}
            onClear={clearGeneralInfo}
            onSave={() => void saveProfile()}
          />
          <ProfileGithubSection
            values={{
              githubLabel: formState.githubLabel,
              githubUsername: formState.githubUsername,
            }}
            disabled={isLoading}
            isSaving={isSaving}
            onChange={updateField}
            onClear={clearGithubInfo}
            onSave={() => void saveProfile()}
          />
          <ProfileAlert />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default ProfileScreen
