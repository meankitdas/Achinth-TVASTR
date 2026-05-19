import { Link } from "react-router-dom";
import { useDocumentHead } from "../hooks/useDocumentHead";

export function AboutPage() {
  useDocumentHead(
    "About Tvastr | Industrial Intelligence Platform",
    "Learn about Tvastr - pioneering AI-powered quality inspection and process intelligence for manufacturing industries.",
    "https://tvastr.co/about",
  );

  const values = [
    "Explainability over black-box AI",
    "Engineering rigor in every decision",
    "Customer success through tangible ROI",
    "Continuous innovation backed by research",
  ];

  const techApproach = [
    {
      title: "Signal-First Classification",
      description:
        "We extract interpretable features from vision, thermal, eddy current, and ultrasonic sensors to classify defects based on physical principles.",
    },
    {
      title: "Process Intelligence",
      description:
        "Our PI system transforms rejection data into actionable insights using SPC, Pareto, Fishbone, and correlation analytics.",
    },
    {
      title: "Edge Deployment",
      description:
        "Hybrid edge-cloud architecture enables real-time inspection with <200ms latency while maintaining centralized analytics.",
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
              About Tvastr
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-[-0.02em] text-txt-primary leading-[1.05]">
              Building the Future of Industrial Intelligence
            </h1>
            <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto">
              Empowering manufacturers with explainable AI-driven quality
              inspection and process optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p
                className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase mb-4"
                style={{ color: "var(--signal-glow)" }}
              >
                Mission
              </p>
              <h2 className="text-3xl md:text-5xl font-medium text-txt-primary leading-[1.05] tracking-[-0.02em] mb-6">
                Our Mission
              </h2>
              <p className="text-base md:text-lg text-txt-secondary leading-relaxed mb-4">
                Tvastr is on a mission to transform traditional manufacturing
                quality control through signal-based AI inspection systems that
                are explainable, auditable, and deployment-ready.
              </p>
              <p className="text-base md:text-lg text-txt-secondary leading-relaxed">
                We believe that quality inspection should not be a black box.
                Our technology combines physics-driven signal analysis with
                machine learning to deliver reliable defect detection that
                engineers can trust and understand.
              </p>
            </div>

            <div className="space-y-6">
              {/* Vision card */}
              <div
                className="p-7 rounded-lg"
                style={{ background: "var(--bg-panel)" }}
              >
                <p
                  className="font-mono text-[11px] tracking-[0.24em] uppercase mb-3"
                  style={{ color: "var(--signal-glow)" }}
                >
                  Vision
                </p>
                <p className="text-base text-txt-primary leading-relaxed">
                  To become the global standard for AI-powered quality
                  inspection in precision manufacturing, enabling zero-defect
                  production at scale.
                </p>
              </div>

              {/* Values card */}
              <div
                className="p-7 rounded-lg"
                style={{ background: "var(--bg-panel)" }}
              >
                <p
                  className="font-mono text-[11px] tracking-[0.24em] uppercase mb-4"
                  style={{ color: "var(--signal-glow)" }}
                >
                  Values
                </p>
                <ul className="space-y-3">
                  {values.map((value, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base text-txt-primary"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-1 flex-shrink-0"
                        style={{ color: "var(--signal-glow)" }}
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Approach — deep green band */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div
            className="p-10 md:p-14 rounded-2xl"
            style={{
              background: "var(--process-primary)",
              color: "var(--bg-primary)",
            }}
          >
            <p
              className="font-mono text-[11px] tracking-[0.28em] uppercase mb-6"
              style={{ color: "var(--signal-glow)" }}
            >
              Approach
            </p>
            <h2 className="text-3xl md:text-4xl font-medium leading-[1.1] mb-4">
              Our Technology Approach
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-85 mb-10 max-w-3xl">
              Unlike pure computer vision ML approaches, Tvastr uses
              multi-sensor signal fusion combined with physics-based
              classification rules.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {techApproach.map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <p
                    className="font-mono text-[11px] tracking-[0.24em] uppercase mb-3"
                    style={{ color: "var(--signal-glow)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-lg font-medium leading-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p
              className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase mb-4"
              style={{ color: "var(--signal-glow)" }}
            >
              Team
            </p>
            <h2 className="text-3xl md:text-5xl font-medium text-txt-primary leading-[1.05] tracking-[-0.02em] mb-4">
              Built by Engineers, for Engineers
            </h2>
            <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto">
              Our team combines deep expertise in computer vision, signal
              processing, manufacturing engineering, and industrial AI
              deployment.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div
              className="p-8 md:p-10 rounded-lg text-center"
              style={{ background: "var(--bg-panel)" }}
            >
              <p
                className="font-mono text-[11px] tracking-[0.24em] uppercase mb-6"
                style={{ color: "var(--signal-glow)" }}
              >
                Leadership
              </p>
              <h4 className="text-2xl font-medium text-txt-primary mb-1">
                Achintharya
              </h4>
              <p
                className="text-sm font-medium mb-4"
                style={{ color: "var(--process-primary)" }}
              >
                Founder & CEO
              </p>
              <p className="text-base text-txt-secondary leading-relaxed max-w-lg mx-auto">
                Building AI systems for industrial quality control with focus on
                explainability and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p
              className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase"
              style={{ color: "var(--signal-glow)" }}
            >
              Get Started
            </p>
            <h2 className="text-3xl md:text-5xl font-medium text-txt-primary leading-[1.05] tracking-[-0.02em]">
              Join Us in Transforming Manufacturing Quality
            </h2>
            <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto">
              Whether you're a foundry looking to reduce scrap or a
              manufacturing engineer seeking better process insights, we'd love
              to discuss how Tvastr can help.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                style={{
                  background: "var(--process-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                Schedule Demo
              </Link>
              <Link
                to="/technology"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
              >
                Learn About Our Technology
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
