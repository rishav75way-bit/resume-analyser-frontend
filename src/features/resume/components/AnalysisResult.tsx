import type React from 'react';
import { CheckCircle, AlertCircle, Wand2 } from 'lucide-react';
import { Card } from '../../../app/components/Card';
import { LABELS } from '../../../app/utils/constants';

interface AnalysisResultProps {
    result: {
        strengths: string[];
        weaknesses: string[];
        improvementSuggestions: string[];
    };
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
    const sections = [
        {
            title: LABELS.STRENGTHS,
            items: result.strengths,
            color: 'text-green-400',
            icon: CheckCircle,
            bg: 'bg-green-500/10'
        },
        {
            title: LABELS.WEAKNESSES,
            items: result.weaknesses,
            color: 'text-red-400',
            icon: AlertCircle,
            bg: 'bg-red-500/10'
        },
        {
            title: LABELS.SUGGESTIONS,
            items: result.improvementSuggestions,
            color: 'text-primary-400',
            icon: Wand2,
            bg: 'bg-primary-500/10'
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            {sections.map((section, sectionIndex) => (
                <Card key={section.title} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-3 rounded-xl ${section.bg} shadow-lg`}>
                            <section.icon className={section.color} size={26} />
                        </div>
                        <h3 className={`text-2xl font-bold ${section.color}`}>{section.title}</h3>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {section.items.map((item, index) => (
                            <li key={index} className="flex gap-3 group">
                                <div className={`flex-shrink-0 w-1.5 rounded-full mt-2 ${section.bg} group-hover:w-2 transition-all duration-200`} />
                                <p className="text-slate-300 leading-relaxed flex-1 group-hover:text-slate-200 transition-colors duration-200">
                                    {item}
                                </p>
                            </li>
                        ))}
                    </ul>
                </Card>
            ))}
        </div>
    );
};
