-- ============================================================
-- LearnSmart AI – Supabase Schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  icon TEXT
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  explanation TEXT
);

-- Attempts table
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES topics(id),
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  difficulty_stats JSONB DEFAULT '{}',
  responses JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  strengths JSONB DEFAULT '[]',
  weak_areas JSONB DEFAULT '[]',
  concept_gaps JSONB DEFAULT '[]',
  mistake_analysis TEXT,
  learning_insights TEXT,
  recommendations JSONB DEFAULT '[]',
  personalized_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Seed Data – Topics
-- ============================================================
INSERT INTO topics (id, title, description, content, icon) VALUES
(
  'topic-math-001',
  'Mathematics',
  'Algebra, calculus, statistics and problem solving',
  '## Mathematics\n\nMathematics is the foundation of science and technology.\n\n### Algebra\nAlgebra involves working with variables and equations. Key concepts include:\n- Linear equations: ax + b = c\n- Quadratic equations: ax² + bx + c = 0\n- Systems of equations\n\n### Calculus\nCalculus deals with rates of change and accumulation:\n- Derivatives: measure instantaneous rate of change\n- Integrals: measure area under a curve\n- Fundamental theorem of calculus connects the two\n\n### Statistics\nStatistics helps us understand data:\n- Mean, median, mode\n- Standard deviation and variance\n- Probability distributions\n- Hypothesis testing',
  '📐'
),
(
  'topic-physics-001',
  'Physics',
  'Mechanics, thermodynamics, electromagnetism and quantum physics',
  '## Physics\n\nPhysics explains the fundamental laws governing the universe.\n\n### Mechanics\nNewton''s laws of motion:\n1. An object stays at rest or in motion unless acted upon\n2. F = ma (Force equals mass times acceleration)\n3. Every action has an equal and opposite reaction\n\nEnergy: Kinetic (½mv²) and Potential (mgh)\n\n### Thermodynamics\nThe four laws of thermodynamics govern heat and energy:\n- Zeroth law: thermal equilibrium\n- First law: conservation of energy\n- Second law: entropy always increases\n- Third law: absolute zero is unattainable\n\n### Electromagnetism\nMaxwell''s equations describe all electromagnetic phenomena:\n- Electric fields and Coulomb''s law\n- Magnetic fields and Lorentz force\n- Electromagnetic waves travel at speed of light',
  '⚛️'
),
(
  'topic-chemistry-001',
  'Chemistry',
  'Atomic structure, chemical bonding, reactions and organic chemistry',
  '## Chemistry\n\nChemistry is the science of matter and its transformations.\n\n### Atomic Structure\n- Protons, neutrons, electrons\n- Electron configuration and orbitals\n- Periodic table and periodic trends\n\n### Chemical Bonding\n- Ionic bonds: transfer of electrons\n- Covalent bonds: sharing of electrons\n- Metallic bonds: delocalized electrons\n- Hydrogen bonds: weak dipole interactions\n\n### Chemical Reactions\n- Balancing equations (conservation of mass)\n- Types: synthesis, decomposition, displacement\n- Acid-base reactions and pH scale\n- Redox reactions and oxidation states\n\n### Organic Chemistry\n- Carbon-based compounds\n- Functional groups: alcohols, acids, esters\n- Hydrocarbons: alkanes, alkenes, alkynes',
  '🧪'
),
(
  'topic-cs-001',
  'Computer Science',
  'Algorithms, data structures, programming and computer architecture',
  '## Computer Science\n\nComputer science is the study of computation and information.\n\n### Algorithms\nAn algorithm is a step-by-step procedure to solve a problem.\n- Time complexity: O(1), O(log n), O(n), O(n²)\n- Space complexity: memory usage\n- Sorting: bubble, merge, quick sort\n- Searching: linear, binary search\n\n### Data Structures\n- Arrays: fixed-size sequential storage\n- Linked lists: dynamic node-based storage\n- Stacks (LIFO) and Queues (FIFO)\n- Trees: hierarchical structures\n- Hash tables: O(1) average lookup\n- Graphs: vertices and edges\n\n### Programming Paradigms\n- Procedural: sequence of instructions\n- Object-oriented: encapsulation, inheritance, polymorphism\n- Functional: pure functions, immutability\n\n### Computer Architecture\n- CPU, RAM, storage hierarchy\n- Binary and hexadecimal number systems\n- Logic gates and Boolean algebra',
  '💻'
),
(
  'topic-biology-001',
  'Biology',
  'Cell biology, genetics, evolution and human anatomy',
  '## Biology\n\nBiology is the study of living organisms and life processes.\n\n### Cell Biology\n- Cell theory: all life is made of cells\n- Prokaryotic vs eukaryotic cells\n- Cell organelles: nucleus, mitochondria, ribosomes\n- Cell division: mitosis and meiosis\n\n### Genetics\n- DNA structure: double helix, base pairs (A-T, G-C)\n- Gene expression: transcription and translation\n- Mendelian inheritance: dominant and recessive traits\n- Mutations and genetic disorders\n\n### Evolution\n- Natural selection: survival of the fittest\n- Evidence: fossil record, DNA similarity\n- Speciation and biodiversity\n- Darwin''s theory of evolution\n\n### Human Anatomy\n- Organ systems: circulatory, respiratory, nervous\n- Homeostasis: maintaining stable internal conditions\n- Immune system: innate and adaptive immunity',
  '🧬'
);

-- ============================================================
-- Seed Data – Questions (Mathematics)
-- ============================================================
INSERT INTO questions (id, topic_id, question, options, correct_answer, difficulty, explanation) VALUES
('q-math-e-01','topic-math-001','What is the value of 2x + 6 = 14?','["x = 3","x = 4","x = 5","x = 7"]',1,'easy','2x = 14 - 6 = 8, so x = 4'),
('q-math-e-02','topic-math-001','What is the slope of the line y = 3x + 2?','["2","3","5","1"]',1,'easy','In y = mx + b, m is the slope. Here m = 3'),
('q-math-e-03','topic-math-001','What is 15% of 200?','["20","25","30","35"]',2,'easy','15/100 × 200 = 30'),
('q-math-m-01','topic-math-001','Solve the quadratic: x² - 5x + 6 = 0','["x = 2,3","x = 1,6","x = -2,-3","x = 2,4"]',0,'medium','Factor: (x-2)(x-3) = 0, so x = 2 or x = 3'),
('q-math-m-02','topic-math-001','What is the derivative of f(x) = x³ + 2x?','["3x² + 2","3x² + 2x","x² + 2","3x + 2"]',0,'medium','d/dx(x³) = 3x², d/dx(2x) = 2'),
('q-math-m-03','topic-math-001','The mean of 5 numbers is 12. Four of them are 8,10,14,16. What is the fifth?','["10","12","14","12"]',1,'medium','Sum = 5×12 = 60. Known sum = 48. Fifth = 12'),
('q-math-h-01','topic-math-001','What is the integral of 2x dx?','["x²","x² + C","2x² + C","x + C"]',1,'hard','∫2x dx = x² + C'),
('q-math-h-02','topic-math-001','In a normal distribution, what percentage of data falls within 2 standard deviations?','["68%","90%","95%","99.7%"]',2,'hard','The 68-95-99.7 rule: 2σ covers ~95%'),
('q-math-h-03','topic-math-001','What is the limit of (sin x)/x as x → 0?','["0","∞","1","undefined"]',2,'hard','This is a standard limit equal to 1');

-- ============================================================
-- Seed Data – Questions (Physics)
-- ============================================================
INSERT INTO questions (id, topic_id, question, options, correct_answer, difficulty, explanation) VALUES
('q-phys-e-01','topic-physics-001','What is Newton''s Second Law?','["F = mv","F = ma","F = m/a","F = a/m"]',1,'easy','Force = mass × acceleration'),
('q-phys-e-02','topic-physics-001','What is the unit of electric current?','["Volt","Watt","Ampere","Ohm"]',2,'easy','Electric current is measured in Amperes (A)'),
('q-phys-e-03','topic-physics-001','What is the speed of light in vacuum?','["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","3×10⁴ m/s"]',1,'easy','c ≈ 3×10⁸ m/s'),
('q-phys-m-01','topic-physics-001','A 2 kg object moves at 5 m/s. What is its kinetic energy?','["10 J","25 J","50 J","20 J"]',1,'medium','KE = ½mv² = ½×2×25 = 25 J'),
('q-phys-m-02','topic-physics-001','Which law states entropy of an isolated system always increases?','["First law","Zeroth law","Second law","Third law"]',2,'medium','The Second Law of Thermodynamics'),
('q-phys-m-03','topic-physics-001','What is Ohm''s Law?','["V = IR","I = VR","R = VI","P = VI"]',0,'medium','Voltage = Current × Resistance'),
('q-phys-h-01','topic-physics-001','A photon has energy E = 3.3×10⁻¹⁹ J. What is its frequency? (h = 6.6×10⁻³⁴ Js)','["2×10¹⁴ Hz","5×10¹⁴ Hz","3×10¹⁴ Hz","4×10¹⁴ Hz"]',1,'hard','f = E/h = 3.3e-19/6.6e-34 = 5×10¹⁴ Hz'),
('q-phys-h-02','topic-physics-001','What does Heisenberg''s uncertainty principle state?','["Energy is quantized","Position and momentum cannot both be precisely known","Light has dual nature","Mass and energy are equivalent"]',1,'hard','Δx·Δp ≥ ℏ/2'),
('q-phys-h-03','topic-physics-001','In special relativity, what happens to mass as velocity approaches c?','["Decreases","Stays constant","Approaches zero","Increases toward infinity"]',3,'hard','Relativistic mass increases as v → c');

-- ============================================================
-- Seed Data – Questions (Computer Science)
-- ============================================================
INSERT INTO questions (id, topic_id, question, options, correct_answer, difficulty, explanation) VALUES
('q-cs-e-01','topic-cs-001','What is the time complexity of binary search?','["O(n)","O(log n)","O(n²)","O(1)"]',1,'easy','Binary search halves the search space each step: O(log n)'),
('q-cs-e-02','topic-cs-001','What does LIFO stand for?','["Last In First Out","Last In First Order","Linear Input First Output","Linked Input Fetch Order"]',0,'easy','LIFO = Last In First Out, used in stacks'),
('q-cs-e-03','topic-cs-001','Which data structure uses FIFO ordering?','["Stack","Tree","Queue","Graph"]',2,'easy','Queue uses First In First Out ordering'),
('q-cs-m-01','topic-cs-001','What is the worst-case time complexity of QuickSort?','["O(n log n)","O(n)","O(n²)","O(log n)"]',2,'medium','QuickSort worst case is O(n²) with bad pivot selection'),
('q-cs-m-02','topic-cs-001','In OOP, what is encapsulation?','["Inheriting from parent class","Bundling data and methods together","Overriding methods","Creating multiple objects"]',1,'medium','Encapsulation bundles data and methods into a single unit'),
('q-cs-m-03','topic-cs-001','What does a hash table provide on average?','["O(n) lookup","O(log n) lookup","O(1) lookup","O(n²) lookup"]',2,'medium','Hash tables provide O(1) average case lookup'),
('q-cs-h-01','topic-cs-001','What is the space complexity of merge sort?','["O(1)","O(log n)","O(n)","O(n log n)"]',2,'hard','Merge sort requires O(n) auxiliary space'),
('q-cs-h-02','topic-cs-001','Which problem is NP-complete?','["Binary search","Bubble sort","Travelling Salesman Problem","Linear search"]',2,'hard','TSP is a classic NP-complete problem'),
('q-cs-h-03','topic-cs-001','What is a deadlock in OS?','["CPU overheating","Two processes waiting on each other indefinitely","Memory overflow","Network timeout"]',1,'hard','Deadlock: circular wait between processes');

-- ============================================================
-- Seed Data – Questions (Chemistry)
-- ============================================================
INSERT INTO questions (id, topic_id, question, options, correct_answer, difficulty, explanation) VALUES
('q-chem-e-01','topic-chemistry-001','How many electrons does Carbon have?','["4","6","8","12"]',1,'easy','Carbon has atomic number 6, so 6 electrons'),
('q-chem-e-02','topic-chemistry-001','What is the pH of pure water?','["0","7","14","5"]',1,'easy','Pure water has pH = 7 (neutral)'),
('q-chem-e-03','topic-chemistry-001','What type of bond involves electron transfer?','["Covalent","Metallic","Ionic","Hydrogen"]',2,'easy','Ionic bonds involve transfer of electrons between atoms'),
('q-chem-m-01','topic-chemistry-001','Balance: H₂ + O₂ → H₂O. What are the coefficients?','["1,1,1","2,1,2","1,2,2","2,2,1"]',1,'medium','2H₂ + O₂ → 2H₂O'),
('q-chem-m-02','topic-chemistry-001','What is the oxidation state of Mn in KMnO₄?','["+3","+5","+7","+4"]',2,'medium','K is +1, O is -2 (×4=-8), so Mn = +7'),
('q-chem-m-03','topic-chemistry-001','What functional group do alcohols contain?','["-COOH","-OH","-NH₂","-CHO"]',1,'medium','Alcohols contain the hydroxyl (-OH) group'),
('q-chem-h-01','topic-chemistry-001','What is the hybridization of carbon in benzene?','["sp","sp²","sp³","sp³d"]',1,'hard','Benzene carbons are sp² hybridized with delocalized π electrons'),
('q-chem-h-02','topic-chemistry-001','Which law states that gases at same T and P have equal volumes with equal moles?','["Boyle''s","Charles''","Avogadro''s","Dalton''s"]',2,'hard','Avogadro''s law: equal volumes contain equal number of molecules'),
('q-chem-h-03','topic-chemistry-001','What is Le Chatelier''s principle about?','["Energy conservation","Rate of reaction","Equilibrium shift under stress","Electron configuration"]',2,'hard','Le Chatelier: system shifts to counteract applied stress');

-- ============================================================
-- Seed Data – Questions (Biology)
-- ============================================================
INSERT INTO questions (id, topic_id, question, options, correct_answer, difficulty, explanation) VALUES
('q-bio-e-01','topic-biology-001','What is the powerhouse of the cell?','["Nucleus","Ribosome","Mitochondria","Golgi apparatus"]',2,'easy','Mitochondria produce ATP through cellular respiration'),
('q-bio-e-02','topic-biology-001','What are the base pairs in DNA?','["A-G and T-C","A-T and G-C","A-C and G-T","A-U and G-C"]',1,'easy','DNA base pairs: Adenine-Thymine and Guanine-Cytosine'),
('q-bio-e-03','topic-biology-001','What process do plants use to make food?','["Respiration","Fermentation","Photosynthesis","Digestion"]',2,'easy','Photosynthesis converts light energy into glucose'),
('q-bio-m-01','topic-biology-001','What is the difference between mitosis and meiosis?','["Mitosis produces 4 cells, meiosis 2","Mitosis for sex cells, meiosis for body cells","Mitosis produces 2 identical cells, meiosis 4 genetically diverse","No difference"]',2,'medium','Mitosis: 2 identical diploid cells; Meiosis: 4 haploid cells'),
('q-bio-m-02','topic-biology-001','In Mendelian genetics, if Aa × Aa, what ratio of offspring show dominant phenotype?','["1:2:1","1:3","3:1","1:1"]',2,'medium','3 dominant (AA, Aa, Aa) : 1 recessive (aa)'),
('q-bio-m-03','topic-biology-001','What drives natural selection?','["Random mutation only","Genetic drift","Differential reproductive success","Migration"]',2,'medium','Natural selection = variation + differential survival/reproduction'),
('q-bio-h-01','topic-biology-001','What is the role of tRNA in translation?','["Carries genetic code from DNA","Carries amino acids to ribosome","Forms the ribosome","Processes mRNA"]',1,'hard','tRNA carries specific amino acids to the ribosome during translation'),
('q-bio-h-02','topic-biology-001','What is the lac operon an example of?','["Transcriptional activation only","Post-translational modification","Inducible gene regulation","Constitutive expression"]',2,'hard','lac operon: inducible system turned on by lactose'),
('q-bio-h-03','topic-biology-001','Which immune cells directly kill virus-infected cells?','["B cells","Cytotoxic T cells","Helper T cells","Neutrophils"]',1,'hard','CD8+ cytotoxic T cells kill infected cells via perforin/granzyme');
