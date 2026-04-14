const sidebarItems = [
  { label: 'Personal Information', code: 'P', active: true },
  { label: 'Experience', code: 'X', active: false },
  { label: 'Education Settings', code: 'E', active: false },
  { label: 'Security', code: 'S', active: false },
]

const profileAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAl-SLG2lvDzKvrmU9L05pCj6Zeq8Tknvb89WsidPxyqHjxB4m1CWFmVwMrxgJRC2hOTiLZv_92JHgSZvqS0CtKgG1Syf9KoWuyH671gzeagy9rhzR_ogpK-_lEEclpz1eqlvQ-xJ9Q4ckxrD9kGI6qkjrxV0BdVeTy3wnNC7--0bYJo2aSXsns5gZWU7ytMFHOyAyWeuSFg0MEh1Nq5vebM4J6Qc4RRnOcMk6yaDIBvpb6EaMX5rjtzhjYucpv9gaGb-W1rZMhNg'

function ProfileSidebar() {
  return (
    <aside className="space-y-8 lg:col-span-3">
      <div className="rounded-xl bg-base-200 p-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={profileAvatar}
              alt="Profile avatar"
              className="h-24 w-24 rounded-full object-cover shadow-(--ambient-shadow)"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 grid h-8 w-8 place-content-center rounded-full bg-primary text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              E
            </button>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-(--on-surface)">Alex Rivera</h2>
          <p className="text-sm text-(--on-surface-variant)">Full Stack Developer</p>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                item.active
                  ? 'bg-base-300 font-medium text-primary'
                  : 'text-(--on-surface-variant) hover:bg-base-300'
              }`}
            >
              <span className="grid h-5 w-5 place-content-center rounded bg-base-100 text-[10px] font-bold text-primary">
                {item.code}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default ProfileSidebar
