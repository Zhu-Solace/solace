import { useState } from "react";
import Pill from "./Pill";

export default function Specialties({ specialties, uniqueKey }: { specialties: string[], uniqueKey: string }) {
    const [expanded, setExpanded] = useState(false);

    const expandSpecialties = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            {specialties.slice(0, expanded ? specialties.length : 3).map((specialty: string, specialtyIndex: number) => (
                <Pill key={`${uniqueKey}-${specialtyIndex}-specialty`}>
                    {specialty}
                </Pill>
            ))}
            {specialties.length > 3 && !expanded && (
                <span onClick={() => expandSpecialties()} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 cursor-pointer">
                    +{specialties.length - 3} more
                </span>
            )}
            {expanded && (
                <span onClick={() => expandSpecialties()} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 cursor-pointer">
                    Collapse
                </span>
            )}
        </>
    );
}