import {
  FileText,
  FolderKanban,
  GraduationCap,
  UserRound,
} from 'lucide-react'

type HomeStatsGridProps = {
  educationCount: number
  projectCount: number
}

function HomeStatsGrid({ educationCount, projectCount }: HomeStatsGridProps) {
  return (
    <div className="stats border border-base-300 w-full mb-6">
      <div className="stat border-r">
        <div className="stat-figure text-primary">
          <UserRound className="h-8 w-8" />
        </div>
        <div className="stat-title">Profile Strength</div>
        <div className="stat-value">88%</div>
        <div className="stat-desc">+4% since last month</div>
      </div>

      <div className="stat border-r">
        <div className="stat-figure text-primary">
          <GraduationCap className="h-8 w-8" />
        </div>
        <div className="stat-title">Education Entries</div>
        <div className="stat-value">{educationCount}</div>
        <div className="stat-desc">From your saved academic history</div>
      </div>

      <div className="stat border-r">
        <div className="stat-figure text-primary">
          <FolderKanban className="h-8 w-8" />
        </div>
        <div className="stat-title">Projects</div>
        <div className="stat-value">{projectCount.toString().padStart(2, '0')}</div>
        <div className="stat-desc">Tracked in your portfolio list</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-primary">
          <FileText className="h-8 w-8" />
        </div>
        <div className="stat-title">Resume Views</div>
        <div className="stat-value">342</div>
        <div className="stat-desc">Top 5% in your field</div>
      </div>
    </div>
  )
}

export default HomeStatsGrid
