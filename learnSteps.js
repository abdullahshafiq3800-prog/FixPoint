export const LEARN_STEPS = [
  {
    id: 1,
    title: "Satellites broadcast their identity and clock",
    body: "Each satellite constantly transmits a signal stamped with the exact time it left the spacecraft, plus its own orbital position. Your receiver listens, notes when each signal arrives, and identifies which satellite sent it.",
    math: "signal_i = { position s_i, send time t_i }",
    notice: "Nothing is sent to the satellite. GPS is one-way broadcasting — the receiver does all the work.",
  },
  {
    id: 2,
    title: "Travel time becomes distance",
    body: "Radio waves travel at the speed of light, so the receiver can turn a time delay into a distance. Arrival time minus send time is the travel time; multiply by the speed of light and you have a range. GPS engineers call this a pseudorange.",
    math: "r_i = c · (t_arrive − t_send)",
    notice: "One microsecond of timing error becomes about 300 metres of range error.",
  },
  {
    id: 3,
    title: "One range leaves a circle of possibilities",
    body: "Knowing you are exactly r away from a satellite does not tell you where you are. It only tells you that you sit somewhere on a circle of that radius. In real 3D that circle is a sphere.",
    math: "(x − x_i)² + (y − y_i)² = r_i²",
    notice: "One measurement, infinitely many candidate positions.",
  },
  {
    id: 4,
    title: "Two circles narrow it to two points",
    body: "Add a second satellite and its circle cuts the first at two points. Algebraically, subtracting one circle equation from the other cancels the x² and y² terms and leaves a straight line through both crossings.",
    math: "2(x₂−x₁)x + 2(y₂−y₁)y = r₁² − r₂² + x₂² − x₁² + y₂² − y₁²",
    notice: "Two candidates left. Still ambiguous.",
  },
  {
    id: 5,
    title: "Three circles give one answer",
    body: "The third circle passes through only one of the two candidates. Subtracting its equation from the first gives a second straight line, so the problem collapses into two equations with two unknowns, solved exactly with Cramer's rule.",
    math: "A = [[2(x₂−x₁), 2(y₂−y₁)], [2(x₃−x₁), 2(y₃−y₁)]],  A · [x, y]ᵀ = [b₁, b₂]ᵀ",
    notice: "If the satellites are nearly in a straight line, the determinant approaches zero and the answer explodes.",
  },
  {
    id: 6,
    title: "Real data is noisy, so we use least squares",
    body: "Real ranges are wrong by a few metres, so the circles never meet at a single point. Instead of hunting an exact crossing, we search for the position that makes the total squared range error as small as possible. Gauss-Newton starts from the algebraic guess and repeatedly steps downhill until the error stops improving.",
    math: "min Σ (‖p − s_i‖ − r̂_i)²   →   Δ = (JᵀJ)⁻¹ Jᵀ r",
    notice: "Drag the noise slider and step through the iterations below to watch the solver converge.",
  },
];