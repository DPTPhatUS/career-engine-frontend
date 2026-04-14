function ProfileFormActions() {
  return (
    <div className="mt-10 flex justify-end gap-4">
      <button
        type="button"
        className="btn btn-ghost border-0 px-6 font-semibold normal-case text-(--on-surface-variant) hover:bg-base-200"
      >
        Discard Changes
      </button>

      <button type="button" className="btn primary-cta border-0 px-8 font-bold normal-case">
        Save Profile
      </button>
    </div>
  )
}

export default ProfileFormActions
