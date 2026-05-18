import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { useSectionReveal } from "../../hooks/useSectionReveal";

export function ContactSection() {
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: text */}
        <div data-reveal-item className="flex flex-col justify-center">
          <p className="text-base text-txt-secondary leading-relaxed mb-8">
            Ready to bring persistent industrial intelligence to your
            manufacturing environment? Schedule a live demonstration to see how
            Tvastr transforms data into actionable insight.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-txt-secondary">
              <span className="font-semibold text-txt-primary">Email:</span>{" "}
              achintharya@tvastr.co
            </p>
            <p className="text-sm text-txt-secondary">
              <span className="font-semibold text-txt-primary">Location:</span>{" "}
              Bengaluru, India — with global deployment capability
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div
          data-reveal-item
          className="p-5 md:p-8 rounded-lg border"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border-default)",
          }}
        >
          <h3 className="text-xl font-bold text-txt-primary mb-6">
            Request a Demo
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded text-txt-primary focus:outline-none focus:ring-1 focus:ring-telemetry-primary"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded text-txt-primary focus:outline-none focus:ring-1 focus:ring-telemetry-primary"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            />
            <textarea
              placeholder="Tell us about your manufacturing process"
              rows="4"
              className="w-full px-4 py-3 rounded text-txt-primary focus:outline-none focus:ring-1 focus:ring-telemetry-primary"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            />
            <button className="w-full px-8 py-3 bg-telemetry-primary text-bg-primary font-semibold tracking-wider uppercase rounded hover:bg-telemetry-secondary transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
