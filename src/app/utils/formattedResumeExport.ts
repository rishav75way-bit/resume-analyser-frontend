import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, PageBreak, type FileChild } from 'docx';
import type { ResumeTemplateId } from './resumeTemplates';
import {
    getTemplateById,
    parseResumeIntoSections,
    splitSectionContent,
    type ResumeSection,
} from './resumeTemplates';

const PAGE_WIDTH_MM = 210;
const COVER_LETTER_TITLE = 'Cover Letter';

function addResumeToPdf(
    doc: jsPDF,
    sections: ResumeSection[],
    templateId: ResumeTemplateId
): void {
    const config = getTemplateById(templateId);
    const margin = config.margin;
    const maxWidth = PAGE_WIDTH_MM - margin * 2;
    const titleFontSize = config.titleFontSize;
    const bodyFontSize = config.bodyFontSize;
    const lineHeight = config.lineHeight * (bodyFontSize / 2.8);
    const sectionGap = 6;

    let y = margin;

    for (const section of sections) {
        if (y > 270) {
            doc.addPage();
            y = margin;
        }

        doc.setFontSize(titleFontSize);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, margin, y);
        y += lineHeight + 2;

        const parts = splitSectionContent(section.content);
        doc.setFontSize(bodyFontSize);
        doc.setFont('helvetica', 'normal');
        for (const part of parts) {
            if (y > 270) {
                doc.addPage();
                y = margin;
            }
            const lines = doc.splitTextToSize(part, maxWidth);
            for (const line of lines) {
                if (y > 270) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += lineHeight;
            }
            y += lineHeight * 0.5;
        }
        y += sectionGap;
    }
}

export function exportResumeToPdf(
    resumeText: string,
    templateId: ResumeTemplateId,
    coverLetterText?: string
): void {
    const doc = new jsPDF();
    const sections = parseResumeIntoSections(resumeText);
    addResumeToPdf(doc, sections, templateId);

    if (coverLetterText && coverLetterText.trim()) {
        doc.addPage();
        const config = getTemplateById(templateId);
        const margin = config.margin;
        const maxWidth = PAGE_WIDTH_MM - margin * 2;
        const lineHeight = config.lineHeight * (config.bodyFontSize / 2.8);
        let y = margin;

        doc.setFontSize(config.titleFontSize);
        doc.setFont('helvetica', 'bold');
        doc.text(COVER_LETTER_TITLE, margin, y);
        y += lineHeight * 2;

        doc.setFontSize(config.bodyFontSize);
        doc.setFont('helvetica', 'normal');
        const paragraphs = coverLetterText.split(/\n\s*\n/).filter((p) => p.trim());
        for (const p of paragraphs) {
            const lines = doc.splitTextToSize(p.trim(), maxWidth);
            for (const line of lines) {
                if (y > 270) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += lineHeight;
            }
            y += lineHeight;
        }
    }

    const fileName = `resume-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
}

function sectionToDocxChildren(section: ResumeSection): FileChild[] {
    const children: FileChild[] = [
        new Paragraph({
            children: [new TextRun({ text: section.title, bold: true, size: 24 })],
            spacing: { after: 120 },
        }),
    ];
    const parts = splitSectionContent(section.content);
    for (const part of parts) {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: part, size: 22 })],
                spacing: { after: 120 },
            })
        );
    }
    return children;
}

const TWIPS_PER_MM = 56.7; // 1 mm ≈ 56.7 twips (Word)

export async function exportResumeToDocx(
    resumeText: string,
    templateId: ResumeTemplateId,
    coverLetterText?: string
): Promise<void> {
    const config = getTemplateById(templateId);
    const marginTwips = Math.round(config.margin * TWIPS_PER_MM);
    const sections = parseResumeIntoSections(resumeText);
    const children: FileChild[] = [];

    for (const section of sections) {
        children.push(...sectionToDocxChildren(section));
    }

    if (coverLetterText && coverLetterText.trim()) {
        children.push(
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({
                children: [new TextRun({ text: COVER_LETTER_TITLE, bold: true, size: 28 })],
                spacing: { after: 240 },
            })
        );
        const paragraphs = coverLetterText.split(/\n\s*\n/).filter((p) => p.trim());
        for (const p of paragraphs) {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: p.trim(), size: 22 })],
                    spacing: { after: 120 },
                })
            );
        }
    }

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: marginTwips,
                            right: marginTwips,
                            bottom: marginTwips,
                            left: marginTwips,
                        },
                    },
                },
                children,
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${new Date().toISOString().slice(0, 10)}.docx`;
    a.click();
    URL.revokeObjectURL(url);
}
