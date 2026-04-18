import {
  FileText,
  FolderKanban,
  GraduationCap,
  UserRound,
} from 'lucide-react'

function HomeStatsGrid() {
  return (
    <div className="stats w-full my-8">
      <div className="stat shadow-sm">
        <div className="stat-figure text-primary">
          <UserRound className="h-8 w-8" />
        </div>
        <div className="stat-title">Profile Strength</div>
        <div className="stat-value">88%</div>
        <div className="stat-desc">+4% since last month</div>
      </div>

      <div className="stat shadow-sm">
        <div className="stat-figure text-primary">
          <GraduationCap className="h-8 w-8" />
        </div>
        <div className="stat-title">Education Credits</div>
        <div className="stat-value">124</div>
        <div className="stat-desc">+4 since last month</div>
      </div>

      <div className="stat shadow-sm">
        <div className="stat-figure text-primary">
          <FolderKanban className="h-8 w-8" />
        </div>
        <div className="stat-title">Active Projects</div>
        <div className="stat-value">06</div>
        <div className="stat-desc">2 nearing completion</div>
      </div>

      <div className="stat shadow-sm">
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
