const avatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBAen8MmbB09SN337HfkaPNlSddEiaNrNGAQCYFGhwlt5Cp_JSA-2mtgzMIrcrMpXbJhVFmKxfTOa2qpQhbkVtg0WG61IM26CFAEyNVyyxTHtnwBpasMMfT2uwD_LhOeC91Cr93dPTKD8RghdCfhHGxRl6kJ3gsQdkGsrBBghCsmT8lbUq4eEaA8OWESlHA6aWDgClS3KDYv3tgsbufJBefUCGWZIoqY21DjMcRwzzrFtzUPOj7oN0lCtqO2AGBNwMXxqtUHcj0eQ',
]

const tags = ['Rust', 'WebAssembly', 'PostgreSQL']

const bullets = [
  'Architected a high-performance computation engine reducing latency by 45% using Rust/WASM hooks.',
  'Implemented a custom DSL for logical branching that supports over 10k concurrent evaluations.',
]

function ProjectPrimaryCard() {
  return (
    <article className="group rounded-xl border border-transparent bg-base-200 p-6 transition-all duration-300 hover:border-(--outline-variant)/10 hover:bg-base-300">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-(--on-surface) transition-colors group-hover:text-primary">
            Quantum Logic Engine
          </h3>
          <p className="text-xs text-(--on-surface-variant)">Jan 2024 - Present</p>
        </div>

        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button type="button" className="btn btn-ghost btn-sm border-0 text-(--on-surface-variant) hover:bg-base-100 hover:text-primary">
            Edit
          </button>
          <button type="button" className="btn btn-ghost btn-sm border-0 text-(--on-surface-variant) hover:bg-base-100 hover:text-error">
            Del
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-base-100 text-(--on-surface-variant)">
            {tag}
          </span>
        ))}
      </div>

      <ul className="mb-6 space-y-3 text-sm text-(--on-surface-variant)">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-(--outline-variant)/10 pt-4">
        <button type="button" className="btn btn-ghost btn-sm border-0 gap-2 px-0 text-xs font-bold uppercase tracking-wide text-primary hover:bg-transparent">
          View Repository
          <span>{'->'}</span>
        </button>

        <div className="avatar-group -space-x-2 rtl:space-x-reverse">
          {avatars.map((avatar) => (
            <div className="avatar" key={avatar}>
              <div className="w-6 border border-base-100">
                <img src={avatar} alt="Contributor" />
              </div>
            </div>
          ))}
          <div className="avatar placeholder">
            <div className="w-6 border border-base-100 bg-primary text-[10px] text-white">+2</div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProjectPrimaryCard
