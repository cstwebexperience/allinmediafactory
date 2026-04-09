export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      <div className="font-display font-black italic uppercase tracking-widest text-white text-xl leading-none select-none">
        ALL IN<span className="text-[#7B2FFF]"> ·</span>
      </div>
      <ul className="flex gap-10">
        {['Services', 'Portfolio', 'Contact'].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="font-mono text-[10px] text-white/40 hover:text-white tracking-[0.3em] uppercase transition-colors duration-300"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
