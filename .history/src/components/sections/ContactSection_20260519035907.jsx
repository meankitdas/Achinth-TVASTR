import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { useSectionReveal } from "../../hooks/useSectionReveal";

export function ContactSection() {
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Left: text */}
        <div
          data-reveal-item
          className="lg:col-span-2 flex flex-col justify-center"
        >
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-txt-muted mb-4">
            Contact
          </p>
          <h2 className="text-3xl md:text-5xl font-medium text-txt-primary leading-[1.05] tracking-[-0.02em] mb-6">
            Get in touch
          </h2>
          <p className="text-base md:text-lg text-txt-secondary leading-relaxed mb-10">
            Ready to bring persistent industrial intelligence to your
            manufacturing environment? Schedule a live demonstration to see how
            Tvastr transforms data into actionable insight.
          </p>
          <dl className="space-y-5">
            <div>
              <dt className="font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-1">
                Email
              </dt>
              <dd>
                <a
                  href="mailto:achintharya@tvastr.co"
                  className="text-base text-txt-primary border-b border-txt-primary/30 hover:border-txt-primary pb-0.5 transition-colors focus:outline-none focus-visible:border-process-primary focus-visible:text-process-primary"
                >
                  achintharya@tvastr.co
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-1">
                LinkedIn
              </dt>
              <dd>
                <a
                  href="https://www.linkedin.com/in/achintharya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-txt-primary border-b border-txt-primary/30 hover:border-txt-primary pb-0.5 transition-colors focus:outline-none focus-visible:border-process-primary focus-visible:text-process-primary"
                >
                  linkedin.com/in/achintharya
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-1">
                Location
              </dt>
              <dd className="text-base text-txt-primary">
                Bengaluru, India — global deployment capability
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: form — Cohere contact-form-card */}
        <div
          data-reveal-item
          className="lg:col-span-3 p-6 md:p-10 rounded-2xl"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h3 className="text-2xl font-medium text-txt-primary mb-8 leading-tight">
            Request a demo
          </h3>
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-2"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg text-txt-primary placeholder:text-txt-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-default)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-2"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-lg text-txt-primary placeholder:text-txt-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-default)",
                  }}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-2"
              >
                Manufacturing Context
              </label>
              <textarea
                id="contact-message"
                placeholder="Tell us about your manufacturing process"
                rows="4"
                className="w-full px-4 py-3 rounded-lg text-txt-primary placeholder:text-txt-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-default)",
                }}
              />
            </div>
            <button
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg-primary)",
              }}
            >
              <span>Schedule demo</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
