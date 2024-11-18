import { motion } from 'framer-motion';

interface TagCloudProps {
  title: string;
  items: string[];
  selectedItem: string | null;
  onItemSelect: (item: string | null) => void;
}

export function TagCloud({ title, items, selectedItem, onItemSelect }: TagCloudProps) {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="md:sticky md:top-24">
        <div className="relative">
          <div className="hidden md:block absolute -left-2 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent" />
          
          <div className="md:pl-6 space-y-4">
            <h3 className="text-white/80 font-light tracking-wider">
              <span className="text-indigo-400 font-mono mr-2">&gt;</span>
              {title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map(item => (
                <motion.button
                  key={item}
                  onClick={() => onItemSelect(selectedItem === item ? null : item)}
                  className={`px-3 py-1.5 text-xs font-light tracking-wider transition-all duration-300
                    bg-white/[0.02] border backdrop-blur-sm
                    ${selectedItem === item 
                      ? 'border-indigo-500/30 text-white/90 hover:border-indigo-500/50' 
                      : 'border-white/[0.05] text-white/60 hover:text-white/80 hover:border-white/[0.1]'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 