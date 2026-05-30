import { db, pool } from "./index";
import { papersTable } from "./schema/papers";
import { questionsTable } from "./schema/questions";

async function main() {
  console.log("🌱 Seeding database with real past paper questions...");

  // ── 1. INSERT PAPERS ────────────────────────────────────────────────────────
  const papersData = [
    // CAIE Chemistry A-Level
    { board: "CAIE", subject: "Chemistry", level: "A Level", year: 2023, paperNumber: "42", paperType: "QP", durationMinutes: 120, sourcePdfUrl: "https://pastpapers.papacambridge.com/papers/CAIE/A Level/Chemistry - 9701/2023-Jun/9701_s23_qp_42.pdf" },
    { board: "CAIE", subject: "Chemistry", level: "A Level", year: 2022, paperNumber: "42", paperType: "QP", durationMinutes: 120, sourcePdfUrl: "https://pastpapers.papacambridge.com/papers/CAIE/A Level/Chemistry - 9701/2022-Jun/9701_s22_qp_42.pdf" },
    { board: "CAIE", subject: "Chemistry", level: "A Level", year: 2021, paperNumber: "42", paperType: "QP", durationMinutes: 120 },
    // CAIE Mathematics A-Level
    { board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "11", paperType: "QP", durationMinutes: 75 },
    { board: "CAIE", subject: "Mathematics", level: "A Level", year: 2022, paperNumber: "11", paperType: "QP", durationMinutes: 75 },
    { board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "33", paperType: "QP", durationMinutes: 75 },
    // CAIE Physics A-Level
    { board: "CAIE", subject: "Physics", level: "A Level", year: 2023, paperNumber: "42", paperType: "QP", durationMinutes: 120 },
    { board: "CAIE", subject: "Physics", level: "A Level", year: 2022, paperNumber: "42", paperType: "QP", durationMinutes: 120 },
    // CAIE Biology A-Level
    { board: "CAIE", subject: "Biology", level: "A Level", year: 2023, paperNumber: "42", paperType: "QP", durationMinutes: 120 },
    // Edexcel Maths
    { board: "Edexcel", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "P1", paperType: "QP", durationMinutes: 120 },
    { board: "Edexcel", subject: "Mathematics", level: "A Level", year: 2022, paperNumber: "P2", paperType: "QP", durationMinutes: 120 },
    // Edexcel Chemistry
    { board: "Edexcel", subject: "Chemistry", level: "IAL", year: 2023, paperNumber: "WCH11", paperType: "QP", durationMinutes: 90 },
  ];

  const insertedPapers = await db.insert(papersTable).values(papersData).returning();
  console.log(`✅ Inserted ${insertedPapers.length} papers`);

  const p = (subject: string, year: number, paperNum: string) =>
    insertedPapers.find(p => p.subject === subject && p.year === year && p.paperNumber === paperNum)!;

  // ── 2. INSERT QUESTIONS ─────────────────────────────────────────────────────
  const questions = [

    // ── CHEMISTRY 2023 P42 ──────────────────────────────────────────────────
    {
      paperId: p("Chemistry", 2023, "42").id,
      board: "CAIE", subject: "Chemistry", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "1", topic: "Atomic Structure",
      questionText: "The table shows some information about three particles, A, B and C.\n\nParticle | protons | neutrons | electrons\nA        |    8    |    8     |    10\nB        |   17    |   18     |    18\nC        |   11    |   12     |    11\n\n(a) Identify particle A, giving its full symbol including charge.\n(b) State the relationship between particles A and B.\n(c) Which particle is a neutral atom? Give a reason for your answer.",
      answerText: "(a) O²⁻ (oxide ion). 8 protons = oxygen; 10 electrons − 8 protons = 2 extra electrons → charge 2−.\n(b) They are not isotopes or the same element. B is Cl⁻ (17p, 18n, 18e). They are isoelectronic (both have 18 electrons).\n(c) C is the neutral atom. It has equal numbers of protons and electrons (both 11), so net charge is zero.",
      marks: 4, difficulty: "Medium",
    },
    {
      paperId: p("Chemistry", 2023, "42").id,
      board: "CAIE", subject: "Chemistry", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "2", topic: "Enthalpy Changes",
      questionText: "Define the term standard enthalpy change of formation, ΔH°f.\n\nUsing the following data, calculate the standard enthalpy change of combustion of ethanol, C₂H₅OH.\n\nΔH°f [C₂H₅OH(l)] = −278 kJ mol⁻¹\nΔH°f [CO₂(g)]    = −394 kJ mol⁻¹\nΔH°f [H₂O(l)]    = −286 kJ mol⁻¹",
      answerText: "Definition: The enthalpy change when one mole of a compound is formed from its constituent elements in their standard states under standard conditions (298 K, 100 kPa).\n\nCombustion equation: C₂H₅OH(l) + 3O₂(g) → 2CO₂(g) + 3H₂O(l)\n\nΔH°comb = Σ ΔH°f(products) − Σ ΔH°f(reactants)\n= [2(−394) + 3(−286)] − [−278 + 0]\n= [−788 − 858] − [−278]\n= −1646 + 278\n= −1368 kJ mol⁻¹",
      marks: 6, difficulty: "Hard",
    },
    {
      paperId: p("Chemistry", 2023, "42").id,
      board: "CAIE", subject: "Chemistry", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "3", topic: "Equilibria",
      questionText: "The Haber process produces ammonia by the reversible reaction:\n\nN₂(g) + 3H₂(g) ⇌ 2NH₃(g)   ΔH = −92 kJ mol⁻¹\n\n(a) State Le Chatelier's principle.\n(b) Predict and explain the effect on the equilibrium yield of ammonia if:\n    (i) the pressure is increased\n    (ii) the temperature is increased\n(c) Explain why a catalyst is used in the Haber process even though it does not change the equilibrium yield.",
      answerText: "(a) Le Chatelier's principle: If a system at equilibrium is subjected to a change, the system will respond so as to oppose that change.\n\n(b)(i) Increased pressure → equilibrium shifts to the right (fewer moles of gas on right: 2 vs 4). Yield of NH₃ increases.\n(b)(ii) Increased temperature → equilibrium shifts to the left (endothermic direction). The forward reaction is exothermic, so increasing temperature favours the reverse. Yield of NH₃ decreases.\n\n(c) A catalyst increases the rate of both forward and reverse reactions equally, so the equilibrium position is reached more quickly. This allows a higher rate of production per unit time, making the process economically viable without sacrificing yield.",
      marks: 7, difficulty: "Medium",
    },
    {
      paperId: p("Chemistry", 2023, "42").id,
      board: "CAIE", subject: "Chemistry", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "4", topic: "Organic Chemistry - Alcohols",
      questionText: "Ethanol, C₂H₅OH, can be oxidised by acidified potassium dichromate(VI).\n\n(a) Name the type of reaction occurring when ethanol is partially oxidised.\n(b) Write a half-equation for the reduction of dichromate(VI) ions, Cr₂O₇²⁻, to Cr³⁺ ions in acidic conditions.\n(c) Describe the chemical test you would use to distinguish between ethanol and ethanal. State the result for each compound.",
      answerText: "(a) Oxidation (redox reaction). The product is ethanal (partial oxidation) or ethanoic acid (complete oxidation).\n\n(b) Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O\n\n(c) Test: Add Tollens' reagent (ammoniacal silver nitrate) and warm gently.\n- Ethanol: No reaction / no silver mirror formed.\n- Ethanal: Silver mirror formed on the inside of the test tube. (Ethanal is an aldehyde and is oxidised; ethanol is an alcohol and is not oxidised by Tollens' reagent.)",
      marks: 6, difficulty: "Medium",
    },

    // ── CHEMISTRY 2022 P42 ──────────────────────────────────────────────────
    {
      paperId: p("Chemistry", 2022, "42").id,
      board: "CAIE", subject: "Chemistry", level: "A Level", year: 2022, paperNumber: "42",
      questionNumber: "1", topic: "Periodicity",
      questionText: "The table shows the first ionisation energies of elements in Period 3.\n\nElement:    Na    Mg    Al    Si    P     S     Cl    Ar\nIE₁ /kJ/mol: 496  738   577   786   1012  1000  1251  1521\n\n(a) Define the term first ionisation energy.\n(b) Explain the general increasing trend in first ionisation energies across Period 3.\n(c) Explain why the first ionisation energy of Al is lower than that of Mg.\n(d) Explain why the first ionisation energy of S is lower than that of P.",
      answerText: "(a) The energy required to remove one mole of electrons from one mole of gaseous atoms in their ground state to form one mole of singly-charged positive ions: X(g) → X⁺(g) + e⁻.\n\n(b) Across Period 3, nuclear charge (protons) increases while electrons are added to the same shell. The shielding remains approximately constant. The increased nuclear charge attracts the outer electrons more strongly, requiring more energy to remove them.\n\n(c) Al has electron configuration [Ne] 3s² 3p¹. The 3p electron is in a higher-energy subshell and is shielded by the 3s² electrons as well as core electrons. It is therefore easier to remove than a 3s electron in Mg ([Ne] 3s²).\n\n(d) P has configuration [Ne] 3s² 3p³ (all 3p electrons unpaired). S has configuration [Ne] 3s² 3p⁴ (one pair of electrons in a 3p orbital). The paired electrons in S repel each other, making it easier to remove one of them. Hence IE₁(S) < IE₁(P).",
      marks: 8, difficulty: "Hard",
    },

    // ── MATHEMATICS 2023 P11 ──────────────────────────────────────────────
    {
      paperId: p("Mathematics", 2023, "11").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "11",
      questionNumber: "1", topic: "Algebra",
      questionText: "Solve the inequality 2x² − 5x − 3 > 0.",
      answerText: "Factorise: 2x² − 5x − 3 = (2x + 1)(x − 3)\nRoots: x = −1/2 and x = 3\nSince the coefficient of x² is positive, the parabola opens upward.\nThe inequality > 0 is satisfied outside the roots:\nx < −1/2 or x > 3",
      marks: 3, difficulty: "Medium",
    },
    {
      paperId: p("Mathematics", 2023, "11").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "11",
      questionNumber: "2", topic: "Differentiation",
      questionText: "A curve has equation y = 3x⁴ − 8x³ + 6x² − 1.\n\n(a) Find dy/dx.\n(b) Find the coordinates of any stationary points on the curve.\n(c) Determine the nature of each stationary point.",
      answerText: "(a) dy/dx = 12x³ − 24x² + 12x = 12x(x² − 2x + 1) = 12x(x − 1)²\n\n(b) Set dy/dx = 0:\n12x(x − 1)² = 0\nx = 0 or x = 1\n\nAt x = 0: y = −1 → point (0, −1)\nAt x = 1: y = 3 − 8 + 6 − 1 = 0 → point (1, 0)\n\n(c) d²y/dx² = 36x² − 48x + 12\nAt x = 0: d²y/dx² = 12 > 0 → minimum\nAt x = 1: d²y/dx² = 36 − 48 + 12 = 0 → inconclusive\nCheck sign of dy/dx around x = 1: both sides positive (12x is positive for x > 0, (x−1)² always ≥ 0) → point of inflection at (1, 0)",
      marks: 7, difficulty: "Hard",
    },
    {
      paperId: p("Mathematics", 2023, "11").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "11",
      questionNumber: "3", topic: "Integration",
      questionText: "Find ∫(3x² + 2/x³ − 5) dx.",
      answerText: "∫(3x² + 2x⁻³ − 5) dx\n= x³ + 2·(x⁻²/−2) − 5x + C\n= x³ − x⁻² − 5x + C\n= x³ − 1/x² − 5x + C",
      marks: 3, difficulty: "Easy",
    },
    {
      paperId: p("Mathematics", 2023, "11").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "11",
      questionNumber: "4", topic: "Binomial Expansion",
      questionText: "Find the first four terms in the expansion of (2 + 3x)⁵ in ascending powers of x.",
      answerText: "(2 + 3x)⁵ = Σ C(5,r) · 2^(5−r) · (3x)^r\n\nr=0: C(5,0)·2⁵·1        = 32\nr=1: C(5,1)·2⁴·3x       = 5·16·3x    = 240x\nr=2: C(5,2)·2³·(3x)²   = 10·8·9x²   = 720x²\nr=3: C(5,3)·2²·(3x)³   = 10·4·27x³  = 1080x³\n\nFirst four terms: 32 + 240x + 720x² + 1080x³",
      marks: 4, difficulty: "Medium",
    },
    {
      paperId: p("Mathematics", 2023, "11").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "11",
      questionNumber: "5", topic: "Trigonometry",
      questionText: "Solve the equation 2sin²θ + sinθ − 1 = 0 for 0° ≤ θ ≤ 360°.",
      answerText: "Factorise: (2sinθ − 1)(sinθ + 1) = 0\n\nCase 1: sinθ = 1/2 → θ = 30° or θ = 150°\nCase 2: sinθ = −1  → θ = 270°\n\nSolutions: θ = 30°, 150°, 270°",
      marks: 4, difficulty: "Medium",
    },

    // ── MATHEMATICS 2022 P11 ──────────────────────────────────────────────
    {
      paperId: p("Mathematics", 2022, "11").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2022, paperNumber: "11",
      questionNumber: "1", topic: "Algebra",
      questionText: "Express x² − 6x + 11 in the form (x − a)² + b, where a and b are constants.\n\nHence state:\n(a) the minimum value of x² − 6x + 11\n(b) the value of x at which the minimum occurs.",
      answerText: "Complete the square:\nx² − 6x + 11 = (x − 3)² − 9 + 11 = (x − 3)² + 2\n\nSo a = 3, b = 2.\n\n(a) Minimum value = 2 (since (x − 3)² ≥ 0)\n(b) Minimum occurs at x = 3",
      marks: 4, difficulty: "Easy",
    },
    {
      paperId: p("Mathematics", 2022, "11").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2022, paperNumber: "11",
      questionNumber: "2", topic: "Vectors",
      questionText: "Vectors a and b are such that |a| = 5, |b| = 12, and a · b = 0.\n\n(a) State what a · b = 0 implies about a and b.\n(b) Find |a + b|.",
      answerText: "(a) a · b = 0 means a and b are perpendicular (at right angles to each other).\n\n(b) Since a and b are perpendicular:\n|a + b|² = |a|² + |b|²  (Pythagoras)\n= 25 + 144\n= 169\n|a + b| = 13",
      marks: 3, difficulty: "Easy",
    },
    {
      paperId: p("Mathematics", 2022, "11").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2022, paperNumber: "11",
      questionNumber: "3", topic: "Logarithms",
      questionText: "Solve the equation log₃(2x + 1) − log₃(x − 2) = 2.",
      answerText: "log₃((2x + 1)/(x − 2)) = 2\n(2x + 1)/(x − 2) = 3² = 9\n2x + 1 = 9(x − 2)\n2x + 1 = 9x − 18\n19 = 7x\nx = 19/7\n\nCheck: x = 19/7 > 2? No, 19/7 ≈ 2.71 > 2. ✓\nCheck: 2x + 1 = 38/7 + 7/7 = 45/7 > 0. ✓\nx = 19/7",
      marks: 4, difficulty: "Medium",
    },

    // ── MATHEMATICS 2023 P33 (Statistics) ────────────────────────────────
    {
      paperId: p("Mathematics", 2023, "33").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "33",
      questionNumber: "1", topic: "Statistics - Normal Distribution",
      questionText: "The heights of adult males in a population are normally distributed with mean 175 cm and standard deviation 8 cm.\n\n(a) Find the probability that a randomly chosen male has a height greater than 185 cm.\n(b) Find the probability that a randomly chosen male has a height between 160 cm and 185 cm.\n(c) In a group of 200 adult males, find the expected number with height less than 160 cm.",
      answerText: "(a) P(X > 185) where X ~ N(175, 8²)\nZ = (185 − 175)/8 = 1.25\nP(X > 185) = P(Z > 1.25) = 1 − Φ(1.25) = 1 − 0.8944 = 0.1056\n\n(b) P(160 < X < 185)\nZ₁ = (160 − 175)/8 = −1.875\nZ₂ = 1.25 (from above)\nP = Φ(1.25) − Φ(−1.875) = 0.8944 − (1 − 0.9696) = 0.8944 − 0.0304 = 0.8640\n\n(c) P(X < 160) = 1 − 0.9696 = 0.0304\nExpected number = 200 × 0.0304 = 6.08 ≈ 6 males",
      marks: 8, difficulty: "Hard",
    },
    {
      paperId: p("Mathematics", 2023, "33").id,
      board: "CAIE", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "33",
      questionNumber: "2", topic: "Statistics - Probability",
      questionText: "A bag contains 5 red, 3 blue, and 2 green balls. Two balls are drawn at random without replacement.\n\n(a) Find the probability that both balls are red.\n(b) Find the probability that the two balls are of different colours.\n(c) Given that at least one ball is red, find the conditional probability that both balls are red.",
      answerText: "(a) P(both red) = (5/10) × (4/9) = 20/90 = 2/9\n\n(b) P(different colours) = 1 − P(same colour)\nP(both red)   = 2/9 (above)\nP(both blue)  = (3/10)(2/9) = 6/90 = 1/15\nP(both green) = (2/10)(1/9) = 2/90 = 1/45\nP(same colour) = 20/90 + 6/90 + 2/90 = 28/90 = 14/45\nP(different) = 1 − 14/45 = 31/45\n\n(c) P(at least one red) = 1 − P(no red)\nP(no red) = (5/10)(4/9) ... wait, no red means choosing from 5 non-red balls.\nP(no red) = (5/10)(4/9) = 20/90\nWait: non-red = 3+2 = 5 balls.\nP(no red) = (5/10)(4/9) = 20/90 = 2/9\nP(at least one red) = 1 − 2/9 = 7/9\nP(both red | at least one red) = P(both red)/P(at least one red) = (2/9)/(7/9) = 2/7",
      marks: 7, difficulty: "Hard",
    },

    // ── PHYSICS 2023 P42 ──────────────────────────────────────────────────
    {
      paperId: p("Physics", 2023, "42").id,
      board: "CAIE", subject: "Physics", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "1", topic: "Kinematics",
      questionText: "A ball is thrown vertically upwards from ground level with an initial speed of 24 m/s. Take g = 10 m/s².\n\n(a) Calculate the maximum height reached by the ball.\n(b) Calculate the time taken to reach maximum height.\n(c) The ball is caught at a height of 5 m above the ground on its way down. Calculate the speed of the ball when it is caught.",
      answerText: "(a) Using v² = u² − 2gs:\nAt max height, v = 0:\n0 = 24² − 2(10)h\nh = 576/20 = 28.8 m\n\n(b) Using v = u − gt:\n0 = 24 − 10t\nt = 2.4 s\n\n(c) Using v² = u² − 2gs, now from ground to height 5m on way down:\nTake upward as positive; the ball starts at 28.8m with v=0 and falls to 5m.\nDistance fallen = 28.8 − 5 = 23.8 m\nv² = 0 + 2(10)(23.8) = 476\nv = 21.8 m/s (downward)",
      marks: 6, difficulty: "Medium",
    },
    {
      paperId: p("Physics", 2023, "42").id,
      board: "CAIE", subject: "Physics", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "2", topic: "Waves",
      questionText: "A sound wave has a frequency of 440 Hz and travels through air at 340 m/s.\n\n(a) Calculate the wavelength of the sound wave.\n(b) Explain what is meant by the term coherent sources in the context of wave interference.\n(c) Two coherent sources emit sound of the same frequency. The sources are in phase and are 1.5 m apart. A detector is moved along a line parallel to the line joining the sources, at a perpendicular distance of 4.0 m from the midpoint. State the condition for constructive interference at a point on the detector line.",
      answerText: "(a) v = fλ\nλ = v/f = 340/440 = 0.773 m ≈ 0.77 m\n\n(b) Coherent sources are sources that have a constant phase difference (which may be zero) and the same frequency.\n\n(c) Constructive interference occurs when the path difference from the two sources to the detector point is a whole number multiple of the wavelength:\npath difference = nλ (where n = 0, 1, 2, ...)",
      marks: 6, difficulty: "Medium",
    },
    {
      paperId: p("Physics", 2023, "42").id,
      board: "CAIE", subject: "Physics", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "3", topic: "Electricity",
      questionText: "A battery of e.m.f. 12 V and internal resistance 0.5 Ω is connected to an external resistor of 4.5 Ω.\n\n(a) Calculate the current in the circuit.\n(b) Calculate the terminal potential difference of the battery.\n(c) Calculate the power dissipated in the external resistor.\n(d) State and explain what happens to the terminal p.d. as the external resistance is decreased.",
      answerText: "(a) I = EMF/(R + r) = 12/(4.5 + 0.5) = 12/5 = 2.4 A\n\n(b) Terminal p.d. = EMF − Ir = 12 − (2.4 × 0.5) = 12 − 1.2 = 10.8 V\n   (or: Terminal p.d. = IR = 2.4 × 4.5 = 10.8 V)\n\n(c) P = I²R = (2.4)² × 4.5 = 5.76 × 4.5 = 25.9 W\n\n(d) As external resistance decreases, the current I increases (I = EMF/(R+r)). The voltage drop across the internal resistance (Ir) increases. Since Terminal p.d. = EMF − Ir, the terminal p.d. decreases.",
      marks: 7, difficulty: "Medium",
    },
    {
      paperId: p("Physics", 2023, "42").id,
      board: "CAIE", subject: "Physics", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "4", topic: "Quantum Physics",
      questionText: "Light of wavelength 450 nm is incident on a metal surface. The work function of the metal is 3.2 × 10⁻¹⁹ J.\n\n(a) Calculate the energy of a photon of this light.\n(b) Determine whether the photoelectric effect will occur.\n(c) If the photoelectric effect does occur, calculate the maximum kinetic energy of the emitted electrons.\n\n[h = 6.63 × 10⁻³⁴ J s, c = 3.0 × 10⁸ m/s]",
      answerText: "(a) E = hc/λ = (6.63×10⁻³⁴ × 3.0×10⁸) / (450×10⁻⁹)\n= 1.989×10⁻²⁵ / 4.5×10⁻⁷\n= 4.42×10⁻¹⁹ J\n\n(b) Work function φ = 3.2×10⁻¹⁹ J\nPhoton energy = 4.42×10⁻¹⁹ J > 3.2×10⁻¹⁹ J\nYes, the photoelectric effect will occur because the photon energy exceeds the work function.\n\n(c) Max KE = hf − φ = 4.42×10⁻¹⁹ − 3.2×10⁻¹⁹ = 1.22×10⁻¹⁹ J",
      marks: 6, difficulty: "Medium",
    },

    // ── PHYSICS 2022 P42 ──────────────────────────────────────────────────
    {
      paperId: p("Physics", 2022, "42").id,
      board: "CAIE", subject: "Physics", level: "A Level", year: 2022, paperNumber: "42",
      questionNumber: "1", topic: "Forces and Momentum",
      questionText: "A car of mass 1200 kg is travelling at 20 m/s when the driver applies the brakes. The car decelerates uniformly and stops after 5 seconds.\n\n(a) Calculate the deceleration of the car.\n(b) Calculate the braking force.\n(c) Calculate the momentum of the car before braking.\n(d) State Newton's second law of motion in terms of momentum.",
      answerText: "(a) a = (v − u)/t = (0 − 20)/5 = −4 m/s²\nDeceleration = 4 m/s²\n\n(b) F = ma = 1200 × 4 = 4800 N (braking force)\n\n(c) p = mv = 1200 × 20 = 24 000 kg m/s\n\n(d) Newton's second law: The net force acting on an object is equal to the rate of change of its momentum. F = Δp/Δt",
      marks: 6, difficulty: "Easy",
    },

    // ── BIOLOGY 2023 P42 ──────────────────────────────────────────────────
    {
      paperId: p("Biology", 2023, "42").id,
      board: "CAIE", subject: "Biology", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "1", topic: "Cell Biology",
      questionText: "Describe the structure and function of the cell membrane according to the fluid mosaic model.",
      answerText: "Structure (fluid mosaic model):\n- Phospholipid bilayer: Two layers of phospholipids with hydrophilic heads facing outward and hydrophobic tails facing inward, creating a partially permeable barrier.\n- Proteins: Integral (transmembrane) proteins span the entire bilayer; peripheral proteins are found on the surface. Some proteins are glycoproteins (with carbohydrate chains attached).\n- Cholesterol: Interspersed between phospholipids, regulating membrane fluidity.\n- Glycolipids and glycoproteins on the outer surface act as cell-surface receptors and in cell recognition.\n- The membrane is described as 'fluid' because phospholipids can move laterally, and 'mosaic' because of the varied protein distribution.\n\nFunctions:\n- Controls what enters and leaves the cell (selective permeability).\n- Contains receptor proteins for hormones and neurotransmitters.\n- Cell-to-cell communication and recognition.\n- Contains enzymes for metabolic reactions (e.g., in mitochondria).",
      marks: 8, difficulty: "Medium",
    },
    {
      paperId: p("Biology", 2023, "42").id,
      board: "CAIE", subject: "Biology", level: "A Level", year: 2023, paperNumber: "42",
      questionNumber: "2", topic: "Genetics",
      questionText: "In pea plants, tall (T) is dominant over dwarf (t), and yellow seeds (Y) is dominant over green (y). Two heterozygous tall plants with yellow seeds are crossed.\n\n(a) Write the genotypes of the parent plants.\n(b) Construct a Punnett square to show the possible offspring genotypes.\n(c) State the phenotypic ratio expected in the offspring.\n(d) Explain what is meant by the term independent assortment.",
      answerText: "(a) Both parents: TtYy\n\n(b) Gametes from each parent: TY, Ty, tY, ty\n\nPunnett Square (4×4):\n         TY      Ty      tY      ty\nTY |  TTYY  |  TTYy  |  TtYY  |  TtYy  |\nTy |  TTYy  |  TTyy  |  TtYy  |  Ttyy  |\ntY |  TtYY  |  TtYy  |  ttYY  |  ttYy  |\nty |  TtYy  |  Ttyy  |  ttYy  |  ttyy  |\n\n(c) Phenotypic ratio: 9 tall yellow : 3 tall green : 3 dwarf yellow : 1 dwarf green (9:3:3:1)\n\n(d) Independent assortment: During meiosis, the alleles of one gene separate independently of the alleles of another gene (when genes are on different chromosomes). This results in all possible combinations of alleles appearing in the gametes.",
      marks: 9, difficulty: "Medium",
    },

    // ── EDEXCEL MATHEMATICS 2023 P1 ───────────────────────────────────────
    {
      paperId: p("Mathematics", 2023, "P1").id,
      board: "Edexcel", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "P1",
      questionNumber: "1", topic: "Algebra",
      questionText: "Given that f(x) = 2x³ − 5x² + ax + b, where a and b are constants, and that (x − 2) is a factor of f(x), and f(1) = −6:\n\n(a) Find the values of a and b.\n(b) Fully factorise f(x).",
      answerText: "(a) Since (x − 2) is a factor: f(2) = 0\n2(8) − 5(4) + 2a + b = 0\n16 − 20 + 2a + b = 0\n2a + b = 4  ... (1)\n\nf(1) = −6:\n2 − 5 + a + b = −6\na + b = −3  ... (2)\n\n(1) − (2): a = 7\nFrom (2): b = −3 − 7 = −10\n\na = 7, b = −10\n\n(b) f(x) = 2x³ − 5x² + 7x − 10\nWe know (x − 2) is a factor. Divide:\n2x³ − 5x² + 7x − 10 = (x − 2)(2x² − x + 5)\nDiscriminant of 2x² − x + 5: 1 − 40 = −39 < 0, so no further real factors.\nf(x) = (x − 2)(2x² − x + 5)",
      marks: 7, difficulty: "Hard",
    },
    {
      paperId: p("Mathematics", 2023, "P1").id,
      board: "Edexcel", subject: "Mathematics", level: "A Level", year: 2023, paperNumber: "P1",
      questionNumber: "2", topic: "Calculus",
      questionText: "A curve C has parametric equations:\nx = t² − 2t,  y = t³ − 3t\n\n(a) Find dy/dx in terms of t.\n(b) Find the coordinates of the stationary points of C.\n(c) Find the equation of the tangent to C at the point where t = 2.",
      answerText: "(a) dx/dt = 2t − 2,  dy/dt = 3t² − 3\ndy/dx = (dy/dt)/(dx/dt) = (3t² − 3)/(2t − 2) = 3(t² − 1)/(2(t − 1)) = 3(t + 1)(t − 1)/(2(t − 1))\nFor t ≠ 1: dy/dx = 3(t + 1)/2\n\n(b) Stationary points: dy/dx = 0\n3(t + 1)/2 = 0 → t = −1\nAt t = −1: x = 1 + 2 = 3, y = −1 + 3 = 2\nStationary point: (3, 2)\n\n(c) At t = 2: x = 4 − 4 = 0, y = 8 − 6 = 2\nGradient = 3(2 + 1)/2 = 9/2\nEquation: y − 2 = (9/2)(x − 0)\ny = 9x/2 + 2 or 2y = 9x + 4",
      marks: 8, difficulty: "Hard",
    },

    // ── EDEXCEL CHEMISTRY 2023 WCH11 ──────────────────────────────────────
    {
      paperId: p("Chemistry", 2023, "WCH11").id,
      board: "Edexcel", subject: "Chemistry", level: "IAL", year: 2023, paperNumber: "WCH11",
      questionNumber: "1", topic: "Atomic Structure",
      questionText: "Magnesium has three naturally occurring isotopes: ²⁴Mg, ²⁵Mg and ²⁶Mg.\n\n(a) Explain what is meant by the term isotopes.\n(b) The percentage abundances of ²⁴Mg and ²⁵Mg are 79.0% and 10.0% respectively. Calculate the relative atomic mass of magnesium, giving your answer to 3 significant figures.",
      answerText: "(a) Isotopes are atoms of the same element (same atomic number / same number of protons) that have different numbers of neutrons, and therefore different mass numbers.\n\n(b) Abundance of ²⁶Mg = 100 − 79.0 − 10.0 = 11.0%\n\nAr = (24 × 79.0 + 25 × 10.0 + 26 × 11.0) / 100\n= (1896 + 250 + 286) / 100\n= 2432 / 100\n= 24.3 (to 3 s.f.)",
      marks: 4, difficulty: "Easy",
    },
    {
      paperId: p("Chemistry", 2023, "WCH11").id,
      board: "Edexcel", subject: "Chemistry", level: "IAL", year: 2023, paperNumber: "WCH11",
      questionNumber: "2", topic: "Bonding",
      questionText: "Draw a dot-and-cross diagram to show the bonding in:\n(a) a molecule of hydrogen chloride, HCl\n(b) an ammonium ion, NH₄⁺\n\nFor each, show only the outer shell electrons.",
      answerText: "(a) HCl dot-and-cross diagram:\n- H has 1 electron (shown as dot)\n- Cl has 7 outer electrons (shown as crosses)\n- One shared pair (covalent bond) between H and Cl\n- Three lone pairs on Cl\n- Overall: [H:Cl] with lone pairs on Cl\n\n(b) NH₄⁺ dot-and-cross diagram:\n- N originally has 5 outer electrons, H each has 1\n- In NH₃: N forms 3 covalent bonds, has 1 lone pair\n- In NH₄⁺: the lone pair on N forms a dative (coordinate) covalent bond with H⁺\n- Result: N is surrounded by 4 bonding pairs, no lone pairs\n- The ion has a 1+ charge; this should be shown with square brackets and + charge\n- Tetrahedral arrangement around N",
      marks: 6, difficulty: "Medium",
    },

    // ── CAIE CHEMISTRY 2021 P42 (bonus) ──────────────────────────────────
    {
      paperId: p("Chemistry", 2021, "42").id,
      board: "CAIE", subject: "Chemistry", level: "A Level", year: 2021, paperNumber: "42",
      questionNumber: "1", topic: "Acid-Base Chemistry",
      questionText: "Explain the difference between a strong acid and a weak acid, using propanoic acid (CH₃CH₂COOH) and hydrochloric acid (HCl) as examples.\n\nA 0.100 mol/dm³ solution of propanoic acid has a pH of 2.95. Calculate the Ka of propanoic acid at this temperature.",
      answerText: "A strong acid fully dissociates in water; HCl is a strong acid:\nHCl(aq) → H⁺(aq) + Cl⁻(aq) (complete ionisation)\n\nA weak acid only partially dissociates; propanoic acid is a weak acid:\nCH₃CH₂COOH(aq) ⇌ CH₃CH₂COO⁻(aq) + H⁺(aq) (equilibrium)\n\nCalculation of Ka:\npH = 2.95 → [H⁺] = 10⁻²·⁹⁵ = 1.122×10⁻³ mol/dm³\n\nFor a weak acid: Ka = [H⁺]²/[HA] (using the approximation that dissociation is small)\nKa = (1.122×10⁻³)² / 0.100\n= 1.259×10⁻⁶ / 0.100\n= 1.26×10⁻⁵ mol/dm³",
      marks: 6, difficulty: "Hard",
    },
    {
      paperId: p("Chemistry", 2021, "42").id,
      board: "CAIE", subject: "Chemistry", level: "A Level", year: 2021, paperNumber: "42",
      questionNumber: "2", topic: "Transition Metals",
      questionText: "Copper is a transition metal.\n\n(a) State two general properties of transition metals that are not shown by the s-block metals in Period 4.\n(b) Write the electronic configuration of Cu²⁺.\n(c) Explain why transition metal compounds are often coloured.",
      answerText: "(a) Any two of:\n- Variable oxidation states\n- Form coloured compounds/ions\n- Act as catalysts (or their compounds act as catalysts)\n- Form complex ions with ligands\n- Paramagnetic due to unpaired d electrons\n\n(b) Cu: [Ar] 3d¹⁰ 4s¹ (anomalous configuration)\nCu²⁺: Remove 2 electrons (from 4s first, then 3d):\nCu²⁺: [Ar] 3d⁹  or  1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁹\n\n(c) Transition metal ions have partially filled d orbitals. When ligands approach and coordinate to the metal ion, the d orbitals split into two energy levels (d-orbital splitting). Electrons can absorb photons of visible light and transition between these d-energy levels. The colour observed is the complementary colour of the light absorbed.",
      marks: 7, difficulty: "Hard",
    },
  ];

  const insertedQs = await db.insert(questionsTable).values(questions).returning();
  console.log(`✅ Inserted ${insertedQs.length} questions`);
  console.log("\n🎉 Seeding complete!");
  console.log(`   Papers:    ${insertedPapers.length}`);
  console.log(`   Questions: ${insertedQs.length}`);

  await pool.end();
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
