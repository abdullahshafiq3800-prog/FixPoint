export const QUIZ = [
  {
    id: "q1",
    prompt: "How does a GPS receiver work out its distance to a satellite?",
    options: [
      "It measures how strong the incoming signal is",
      "It times how long the signal took to arrive and multiplies by the speed of light",
      "It counts how many satellites are above the horizon",
      "It reads the distance from a map database",
    ],
    answer: 1,
    explain:
      "The satellite stamps the exact send time into its signal. Arrival time minus send time, times the speed of light, gives the range. Signal strength is far too unreliable for positioning.",
  },
  {
    id: "q2",
    prompt: "You know you are exactly 20,000 km from one satellite. Where can you be?",
    options: [
      "At exactly one point",
      "Anywhere on a circle of that radius around the satellite",
      "On a straight line through the satellite",
      "Anywhere on the map",
    ],
    answer: 1,
    explain:
      "One range only constrains distance, not direction: every point on the circle of that radius fits. In real 3D that circle becomes a sphere.",
  },
  {
    id: "q3",
    prompt: "Why does real GPS need at least four satellites for a position fix?",
    options: [
      "To make the display look better",
      "Three give 3D position, the fourth corrects the receiver clock error",
      "Because four satellites are always visible",
      "To double-check the speed of light",
    ],
    answer: 1,
    explain:
      "A 3D position has three unknowns. A cheap receiver clock adds a fourth unknown (its offset from GPS time), so a fourth range is needed to solve for it.",
  },
  {
    id: "q4",
    prompt: "In this 2D model with perfect (noise-free) ranges, what do three circles usually give?",
    options: [
      "No intersection at all",
      "Exactly one point",
      "An infinite number of points",
      "Two parallel lines",
    ],
    answer: 1,
    explain:
      "Three circles with consistent radii intersect at a single point. Algebraically, subtracting the first equation from the other two yields a 2×2 linear system with one solution.",
  },
  {
    id: "q5",
    prompt: "With noisy ranges the circles no longer meet at one point. What does the solver do?",
    options: [
      "Picks the largest circle and uses its centre",
      "Finds the position that minimises the total squared range error",
      "Averages the three satellite positions",
      "Refuses to produce a result",
    ],
    answer: 1,
    explain:
      "That is least squares: choose the point p minimising Σ(‖p − sᵢ‖ − r̂ᵢ)². Gauss-Newton iterates towards that minimum instead of solving an exact intersection.",
  },
];