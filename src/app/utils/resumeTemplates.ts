export type ResumeTemplateId = 'professional' | 'modern';

export interface ResumeTemplateConfig {
    id: ResumeTemplateId;
    name: string;
    description: string;
    margin: number;
    titleFontSize: number;
    bodyFontSize: number;
    lineHeight: number;
}

export const RESUME_TEMPLATES: ResumeTemplateConfig[] = [
    {
        id: 'professional',
        name: 'Professional',
        description: 'Classic layout, clear sections, traditional fonts',
        margin: 20,
        titleFontSize: 12,
        bodyFontSize: 10,
        lineHeight: 1.25,
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean layout with more spacing',
        margin: 25,
        titleFontSize: 11,
        bodyFontSize: 10,
        lineHeight: 1.4,
    },
];

export function getTemplateById(id: ResumeTemplateId): ResumeTemplateConfig {
    const t = RESUME_TEMPLATES.find((x) => x.id === id);
    return t ?? RESUME_TEMPLATES[0];
}

export interface ResumeSection {
    title: string;
    content: string;
}

const MAX_HEADER_LENGTH = 55;
const BULLET_PATTERN = /^[\s]*[•\-*]\s*|\d+\.\s*/;

export function parseResumeIntoSections(resumeText: string): ResumeSection[] {
    const sections: ResumeSection[] = [];
    const blocks = resumeText.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    let pendingContent: string[] = [];

    for (const block of blocks) {
        const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) continue;

        const firstLine = lines[0];
        const restLines = lines.slice(1);
        const rest = restLines.join('\n');

        const looksLikeHeader =
            firstLine.length <= MAX_HEADER_LENGTH &&
            !firstLine.endsWith('.') &&
            (firstLine === firstLine.toUpperCase() || !firstLine.includes('.') && restLines.length > 0);

        if (looksLikeHeader && rest) {
            if (pendingContent.length > 0) {
                sections.push({ title: 'Summary', content: pendingContent.join('\n\n') });
                pendingContent = [];
            }
            sections.push({ title: firstLine, content: rest });
        } else if (looksLikeHeader && !rest) {
            if (pendingContent.length > 0) {
                sections.push({ title: 'Summary', content: pendingContent.join('\n\n') });
                pendingContent = [];
            }
            sections.push({ title: firstLine, content: '' });
        } else {
            pendingContent.push(block);
        }
    }

    if (pendingContent.length > 0) {
        sections.push({ title: sections.length === 0 ? 'Resume' : 'Additional', content: pendingContent.join('\n\n') });
    }

    if (sections.length === 0 && resumeText.trim()) {
        sections.push({ title: 'Resume', content: resumeText.trim() });
    }

    return sections;
}

export function splitSectionContent(content: string): string[] {
    return content.split(/\n/).map((l) => l.replace(BULLET_PATTERN, '').trim()).filter(Boolean);
}
