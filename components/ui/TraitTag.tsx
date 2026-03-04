export default function TraitTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] bg-white/5 border border-white/8 px-2 py-0.5 rounded text-muted">
      {children}
    </span>
  );
}
