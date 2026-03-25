import { motion } from 'framer-motion';

const formulas = [
  "f(x) = ∫e^(-x²)dx",
  "∇ × E = -∂B/∂t",
  "E = mc²",
  "iℏ(∂Ψ/∂t) = HΨ",
  "P(A|B) = P(B|A)P(A)/P(B)",
  "O(n log n)",
  "ΔxΔp ≥ ℏ/2",
  "σ = 1 / (1 + e^-x)",
  "e^(iπ) + 1 = 0",
  "F = G(m₁m₂)/r²"
];

const TechMathBackground = () => {
  const lines = Array.from({ length: 15 });
  
  return (
    <div className="fixed inset-0 bg-[#060b14] z-[-1] overflow-hidden">
      {/* Abstract color blobs */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-cyan-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 left-1/2 w-[30vw] h-[30vw] bg-pink-500/20 rounded-full blur-[100px]"></div>

      {/* Floating Formulas */}
      <div className="absolute inset-0 pointer-events-none">
        {formulas.map((math, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: Math.random() * window.innerHeight }}
            animate={{ 
              opacity: [0, 0.8, 0],
              y: [null, Math.random() * window.innerHeight * 1.5]
            }}
            transition={{ duration: 25 + i * 2, delay: i * 3, repeat: Infinity, ease: "linear" }}
            className="absolute font-mono text-sm sm:text-2xl text-accent-500/80 blur-[1px] font-bold"
            style={{ left: `${Math.random() * 80 + 10}%` }}
          >
            {math}
          </motion.div>
        ))}
      </div>

      {/* Intersecting sharp Tech Lines */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        {lines.map((_, i) => (
          <motion.div
            key={`h-${i}`}
            animate={{ translateY: [0, window.innerHeight] }}
            transition={{ duration: 20 + i*5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            style={{ y: Math.random() * window.innerHeight }}
          />
        ))}
        {lines.map((_, i) => (
          <motion.div
            key={`v-${i}`}
            animate={{ translateX: [0, window.innerWidth] }}
            transition={{ duration: 25 + i*5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-transparent via-purple-500 to-transparent"
            style={{ x: Math.random() * window.innerWidth }}
          />
        ))}
      </div>
    </div>
  );
};
export default TechMathBackground;
