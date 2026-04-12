"use client";

import { useEffect, useRef, useState } from "react";
import type { ResumeDraft } from "@/lib/api";

const PAGE_WIDTH_PX = 816; // 8.5in at 96dpi
const PAGE_MIN_HEIGHT_IN = 11;

function SpacerLine() {
  return <div style={{ minHeight: "10pt", fontSize: "10pt", lineHeight: "10pt" }}>&nbsp;</div>;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p
      style={{
        fontSize: "12pt",
        fontWeight: 700,
        borderBottom: "1pt solid #000",
        paddingBottom: "1pt",
        margin: 0,
      }}
    >
      {title}
    </p>
  );
}

type ResumePreviewProps = {
  draft: ResumeDraft;
};

export function ResumePreview({ draft }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(11 * 96);

  useEffect(() => {
    function recalculateScale() {
      if (!containerRef.current) return;

      const availableWidth = containerRef.current.clientWidth;
      const nextScale = Math.min(1, availableWidth / PAGE_WIDTH_PX);
      setScale(nextScale);

      if (pageRef.current) {
        setScaledHeight(pageRef.current.offsetHeight * nextScale);
      }
    }

    recalculateScale();

    const observer = new ResizeObserver(() => {
      recalculateScale();
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [draft]);

  const personal = draft.payload.personal_info;
  const githubLabel = personal.github_label || "GitHub";
  const hasGithub = Boolean(personal.github_url);

  return (
    <section className="ce-card sticky top-6 rounded-xl p-4 lg:top-8">
      <header className="mb-3">
        <p className="font-heading text-xl font-semibold tracking-tight text-primary">Live Preview</p>
        <p className="text-xs text-muted-foreground">Mirrors backend Google Docs formatting rules.</p>
      </header>

      <div
        ref={containerRef}
        className="max-h-[calc(100vh-11rem)] overflow-auto rounded-xl border border-border/70 bg-[#f1f3f4] p-3"
      >
        <div
          className="mx-auto"
          style={{
            width: `${PAGE_WIDTH_PX * scale}px`,
            minHeight: `${scaledHeight}px`,
          }}
        >
          <div
            ref={pageRef}
            style={{
              width: `${PAGE_WIDTH_PX}px`,
              minHeight: `${PAGE_MIN_HEIGHT_IN}in`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              backgroundColor: "#fff",
              color: "#000",
              padding: "32pt 36pt",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.22)",
              fontFamily: 'Garamond, "Times New Roman", serif',
              fontSize: "12pt",
              lineHeight: 1.2,
            }}
          >
            <p style={{ margin: 0, fontSize: "24pt", fontWeight: 700 }}>{personal.full_name || " "}</p>

            <p
              style={{
                margin: 0,
                fontSize: "16pt",
                borderBottom: "1pt solid #000",
                paddingBottom: "1pt",
              }}
            >
              {personal.email || " "} | {personal.phone || " "} | {personal.address || " "}
              {hasGithub ? " | " : ""}
              {hasGithub ? (
                <a
                  href={personal.github_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#000", textDecoration: "underline" }}
                >
                  {githubLabel}
                </a>
              ) : null}
            </p>

            <SpacerLine />

            <SectionHeader title="EDUCATION" />
            {draft.payload.education.map((item, index) => (
              <div key={`${item.university}-${index}`}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {item.university} | {item.time_period}
                </p>
                <p style={{ margin: 0, fontStyle: "italic" }}>
                  {item.degree}, {item.field}
                  {item.location ? ` | ${item.location}` : ""}
                </p>

                {item.gpa || item.relevant_coursework ? (
                  <ul style={{ margin: 0, paddingLeft: "18pt", listStyleType: "disc" }}>
                    {item.gpa ? <li style={{ fontWeight: 700 }}>GPA: {item.gpa}</li> : null}
                    {item.relevant_coursework ? (
                      <li>
                        <strong>Relevant Coursework:</strong> {item.relevant_coursework}
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </div>
            ))}

            <SpacerLine />

            <SectionHeader title="TECHNICAL PROJECTS" />
            {draft.payload.projects.map((project, index) => (
              <div key={`${project.title}-${index}`}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#000", textDecoration: "underline" }}
                    >
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                  {" | "}
                  {project.date_range}
                </p>

                {project.tech_stack ? <p style={{ margin: 0 }}>Tech Stack: {project.tech_stack}</p> : null}

                {project.bullets.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "18pt", listStyleType: "disc" }}>
                    {project.bullets.map((bullet, bulletIndex) => (
                      <li key={`${project.title}-bullet-${bulletIndex}`}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                <SpacerLine />
              </div>
            ))}

            <SectionHeader title="SKILLS" />
            {draft.payload.skills.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "18pt", listStyleType: "disc" }}>
                {draft.payload.skills.map((item, index) => (
                  <li key={`${item.label}-${index}`}>
                    <strong>{item.label}:</strong> {item.values}
                  </li>
                ))}
              </ul>
            ) : null}

            <SpacerLine />
          </div>
        </div>
      </div>
    </section>
  );
}
