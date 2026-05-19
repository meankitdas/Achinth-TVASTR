import { Link } from "react-router-dom";
import { useDocumentHead } from "../hooks/useDocumentHead";

export function ResearchPage() {
  useDocumentHead(
    "Research | Tvastr Industrial Intelligence",
    "Explore Tvastr's research in signal-based defect classification, explainable AI, and industrial process intelligence.",
    "https://tvastr.co/research",
  );

  const researchAreas = [
    {
      title: "Signal-Based Defect Classification",
      description:
        "Combining multi-sensor fusion with physics-driven feature extraction for reliable defect detection",
      topics: [
        "Multi-modal sensor fusion (vision, thermal, eddy current, ultrasonic)",
        "Interpretable feature engineering for manufacturing signals",
        "Hard threshold classification vs black-box ML",
        "Signal correlation analysis for root cause attribution",
      ],
    },
    {
      title: "Explainable AI for Manufacturing",
      description:
        "Making AI decisions transparent and auditable for quality engineers",
      topics: [
        "Feature importance visualization for defect classification",
        "Decision tree explanations for rejection reasoning",
        'Counterfactual analysis ("what-if" scenarios)',
        "Compliance with ISO 9001 and IATF 16949 traceability",
      ],
    },
    {
      title: "Process Intelligence & Analytics",
      description:
        "Transforming inspection data into actionable process improvement insights",
      topics: [
        "Statistical Process Control (SPC) for real-time monitoring",
        "Pareto analysis for defect prioritization",
        "Fishbone (Ishikawa) diagrams for root cause investigation",
        "Predictive quality modeling using historical trends",
      ],
    },
    {
      title: "Edge AI Deployment",
      description:
        "Optimizing AI inference for real-time industrial environments",
      topics: [
        "Model quantization and pruning for edge hardware",
        "Sub-200ms inference latency on industrial PCs",
        "Hybrid edge-cloud architecture for scalability",
        "Offline-capable inspection with cloud sync",
      ],
    },
  ];

  const publications = [
    {
      title: "Signal-First Defect Detection in Foundry Casting",
      authors: "Achintharya, et al.",
      venue: "Internal Technical Report",
      year: "2026",
      abstract:
        "We present a signal-based approach to casting defect detection that combines vision, thermal, and electromagnetic sensors with physics-driven classification rules. Unlike pure ML approaches, our system achieves 95%+ accuracy while maintaining full explainability.",
      topics: ["Casting", "Multi-Sensor Fusion", "Explainable AI"],
    },
    {
      title:
        "Energy-Topology Optimization with Lyapunov Stability for Defect Classification",
      authors: "Achintharya",
      venue: "Internal Technical Report",
      year: "2026",
      abstract:
        "We present a physics-inspired classification system that models defect detection as an energy minimization problem using Lyapunov stability functions. The system combines topology reasoning with energy-based force application to achieve guaranteed convergence and 35% higher accuracy than threshold-based approaches.",
      topics: [
        "Energy Optimization",
        "Lyapunov Stability",
        "Topology Reasoning",
        "Physics-Informed AI",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <p
              className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase"
              style={{ color: "var(--signal-glow)" }}
            >
              Research & Innovation
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-[-0.02em] text-txt-primary leading-[1.05]">
              Advancing Industrial AI Through Research
            </h1>
            <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto">
              Exploring signal-based defect detection, explainable AI, and
              process intelligence to transform manufacturing quality control.
            </p>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mb-16">
            <p
              className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase mb-4"
              style={{ color: "var(--signal-glow)" }}
            >
              Focus Areas
            </p>
            <h2 className="text-3xl md:text-5xl font-medium text-txt-primary leading-[1.05] tracking-[-0.02em] mb-4">
              Research Areas
            </h2>
            <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl">
              Our research focuses on making AI practical, explainable, and
              deployment-ready for industrial environments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border-subtle border border-border-subtle">
            {researchAreas.map((area, idx) => (
              <div key={idx} className="p-8 bg-bg-primary">
                <p
                  className="font-mono text-[11px] tracking-[0.24em] uppercase mb-4"
                  style={{ color: "var(--signal-glow)" }}
                >
                  Area {String(idx + 1).padStart(2, "0")}
                </p>
                <h3 className="text-2xl font-medium text-txt-primary leading-tight mb-3">
                  {area.title}
                </h3>
                <p className="text-sm text-txt-secondary leading-relaxed mb-5">
                  {area.description}
                </p>
                <ul className="space-y-2.5">
                  {area.topics.map((topic, tidx) => (
                    <li
                      key={tidx}
                      className="text-sm text-txt-secondary flex items-start gap-2.5"
                    >
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: "var(--process-primary)" }}
                        aria-hidden="true"
                      />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mb-16">
            <p
              className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase mb-4"
              style={{ color: "var(--signal-glow)" }}
            >
              Publications
            </p>
            <h2 className="text-3xl md:text-5xl font-medium text-txt-primary leading-[1.05] tracking-[-0.02em] mb-4">
              Technical Reports
            </h2>
            <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl">
              Internal technical reports documenting our approach and findings.
            </p>
          </div>

          <div className="max-w-5xl space-y-6">
            {publications.map((pub, idx) => (
              <div
                key={idx}
                className="p-8 md:p-10 rounded-lg"
                style={{ background: "var(--bg-panel)" }}
              >
                <p
                  className="font-mono text-[11px] tracking-[0.24em] uppercase mb-3"
                  style={{ color: "var(--signal-glow)" }}
                >
                  Report {String(idx + 1).padStart(2, "0")} · {pub.year}
                </p>
                <h3 className="text-xl md:text-2xl font-medium text-txt-primary leading-tight mb-2">
                  {pub.title}
                </h3>
                <p className="text-sm text-txt-muted mb-4">
                  {pub.authors} · {pub.venue}
                </p>
                <p className="text-sm text-txt-secondary leading-relaxed mb-5">
                  {pub.abstract}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pub.topics.map((topic, tidx) => (
                    <span
                      key={tidx}
                      className="px-2.5 py-1 text-[11px] rounded border"
                      style={{
                        borderColor: "var(--process-primary)",
                        color: "var(--process-primary)",
                        background: "rgba(0,60,51,0.06)",
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div
            className="max-w-4xl mx-auto p-10 md:p-14 rounded-2xl text-center"
            style={{
              background: "var(--process-primary)",
              color: "var(--bg-primary)",
            }}
          >
            <p
              className="font-mono text-[11px] tracking-[0.28em] uppercase mb-6"
              style={{ color: "var(--signal-glow)" }}
            >
              Collaborate
            </p>
            <h2 className="text-3xl md:text-4xl font-medium leading-[1.1] mb-6">
              Collaborate With Us
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-90 mb-10 max-w-2xl mx-auto">
              We're interested in research partnerships with universities,
              manufacturing companies, and quality professionals. If you're
              working on related problems, let's talk.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--process-primary)",
                }}
              >
                Get in Touch
              </Link>
              <Link
                to="/technology"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide border"
                style={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "var(--bg-primary)",
                }}
              >
                Explore Our Technology
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
