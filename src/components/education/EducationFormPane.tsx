function EducationFormPane() {
  return (
    <div className="lg:sticky lg:top-24 lg:col-span-5">
      <fieldset className="fieldset rounded-box border border-base-300 bg-base-200 p-4">
        <legend className="fieldset-legend">Editor</legend>

        <div>
          <label className="label">University Name</label>
          <input
            type="text"
            placeholder="e.g. Massachusetts Institute of Technology"
            className="input w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Degree</label>
            <input
              type="text"
              placeholder="e.g. Bachelor of Arts"
              className="input w-full"
            />
          </div>

          <div>
            <label className="label">Field of Study</label>
            <input
              type="text"
              placeholder="e.g. Economics"
              className="input w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input
              type="month"
              className="input w-full"
            />
          </div>

          <div>
            <label className="label">End Date</label>
            <input
              type="month"
              className="input w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="label">GPA</label>
            <input
              type="text"
              placeholder="e.g. 3.8 / 4.0"
              className="input w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="label">Location</label>
            <input
              type="text"
              placeholder="e.g. Cambridge, MA"
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label className="label">Coursework</label>
          <textarea
            placeholder="e.g. Data Structures, Algorithms, Computer Networks"
            className="textarea w-full"
          ></textarea>
        </div>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="btn btn-neutral flex-1">
            Save Education
          </button>
          <button type="button" className="btn btn-outline">
            Cancel
          </button>
        </div>
      </fieldset>
    </div>
  )
}

export default EducationFormPane
