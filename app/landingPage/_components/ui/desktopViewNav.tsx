import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface LinkItem {
  title: string;
  href: string;
}

interface NavBarProps {
  links: LinkItem[];
}

const NavBar: React.FC<NavBarProps> = ({ links }) => {
const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    // Outer container with a light slate background and some padding.
    <div className="bg-zinc-200 opacity-50 dark:bg-slate-300 p-1 rounded-xl shadow-sm">
      {/* Flex container to arrange items in a row */}
      <ul className="flex flex-row gap-1">
        {links.map((link, index) => (
          <motion.li
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            // When any item is hovered and this is not the hovered one, apply a slight blur and lower opacity.
            className={`transition-all duration-300 p-2 rounded-md cursor-pointer 
              ${hoveredIndex !== null && hoveredIndex !== index
                ? "blur-[2px] opacity-100"
                : "blur-0 opacity-200"
              }`}
          >
            <Link href={link.href}>
              <span className="px-4 py-2  rounded-md transition-colors">
                {link.title}
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default NavBar;
