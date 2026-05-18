export const platformOverviewContent = {
  id: "platform-overview",
  type: "platform-overview",
  title: "The Tvastr Platform",
  subtitle: "Inspection intelligence and process analytics in a unified manufacturing system.",
  body: "Tvastr operates as two integrated systems: RAS handles perception and defect analysis at inspection stations, while PI provides plant-wide process intelligence and manufacturing analytics.",
  systems: [
    {
      id: "ras",
      name: "Tvastr RAS",
      tagline: "Rejection Analysis System",
      description: "Signal-first inspection intelligence with multi-stage reasoning, automated reporting, and complete traceability.",
      route: "/systems/rejection-analysis-system"
    },
    {
      id: "pi",
      name: "Tvastr PI",
      tagline: "Plant Intelligence",
      description: "Manufacturing analytics and process intelligence that transforms inspection data into operational insights and early warnings.",
      route: "/systems/plant-intelligence"
    }
  ],
  keyMessage: "One system for inspection. One system for process intelligence. Unified traceability and manufacturing memory underneath."
}
