import React from 'react';
import { motion } from 'framer-motion';

const codeSnippets = [
  "import { App } from './core';",
  "function optimize(ast) { return ast.tree; }",
  "const SERVER_PORT = 3000;",
  "await connectDatabase(URI);",
  "<h1>System Online</h1>",
  "def recursive_sort(arr):"
];

const DeveloperBackground = () => {
  return (
    <div className="fixed inset-0 bg-[#020617] z-[-1] overflow-hidden">
      {/* Terminal Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50"></div>
      
      <div className="absolute inset-0 flex flex-col justify-between pt-24 pb-24 px-8 opacity-20 pointer-events-none blur-[2px]">
        {codeSnippets.map((code, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0, 1, 1, 0], x: [-20, 0, 0, 20] }}
            transition={{ duration: 10, delay: i * 2, repeat: Infinity, ease: "easeInOut" }}
            className={`font-mono text-xs md:text-sm ${i % 2 === 0 ? 'text-accent-500' : 'text-slate-400'} ml-${(i % 4) * 12}`}
            style={{ marginLeft: `${(i % 4) * 10}%` }}
          >
            {code}
          </motion.div>
        ))}
      </div>
      
      {/* Code Typing overlay Effect Indicator */}
      <div className="absolute bottom-10 left-10 opacity-30 text-accent-500 font-mono text-sm max-w-sm blur-[0.5px]">
         <span className="text-slate-500">root@portfolio:~/$</span> 
         <motion.div 
            animate={{ opacity: [1, 1, 0, 0] }} 
            transition={{ duration: 1, repeat: Infinity }} 
            className="inline-block w-2 h-4 bg-accent-500 align-middle ml-2" 
         />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-[#020617]/50 backdrop-blur-[1px]"></div>
    </div>
  );
};
export default DeveloperBackground;
