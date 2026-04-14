function ProfileFormActions() {
  return (
    <div className="flex justify-end gap-4 border-t border-(--outline-variant)/10 pt-8">
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
