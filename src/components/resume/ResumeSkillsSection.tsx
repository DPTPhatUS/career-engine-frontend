export type ResumeSkillsValues = {
  programmingLanguages: string
  frameworksTools: string
  languages: string
}

type ResumeSkillsSectionProps = {
  values: ResumeSkillsValues
  onChange: (field: keyof ResumeSkillsValues, value: string) => void
}

function ResumeSkillsSection({ values, onChange }: ResumeSkillsSectionProps) {
  return (
    <fieldset className="fieldset rounded-box border border-base-300 bg-base-200 p-4 md:p-6">
      <legend className="fieldset-legend">Skills</legend>
      <p className="label">Provide only the three skills groups supported in this screen.</p>

      <div>
        <label className="label" htmlFor="resume-skills-programming-languages">
          Programming Languages
        </label>
        <textarea
          id="resume-skills-programming-languages"
          rows={3}
          className="textarea w-full"
          placeholder="Python, TypeScript"
          value={values.programmingLanguages}
          onChange={(event) => onChange('programmingLanguages', event.target.value)}
        ></textarea>
      </div>

      <div>
        <label className="label" htmlFor="resume-skills-frameworks-tools">
          Frameworks/Tools
        </label>
        <textarea
          id="resume-skills-frameworks-tools"
          rows={3}
          className="textarea w-full"
          placeholder="React, FastAPI, Docker"
          value={values.frameworksTools}
          onChange={(event) => onChange('frameworksTools', event.target.value)}
        ></textarea>
      </div>

      <div>
        <label className="label" htmlFor="resume-skills-languages">
          Languages
        </label>
        <textarea
          id="resume-skills-languages"
          rows={3}
          className="textarea w-full"
          placeholder="English, Vietnamese"
          value={values.languages}
          onChange={(event) => onChange('languages', event.target.value)}
        ></textarea>
      </div>
    </fieldset>
  )
}

export default ResumeSkillsSection
