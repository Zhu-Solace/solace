export default function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap">
            {children}
        </span>
    );
}