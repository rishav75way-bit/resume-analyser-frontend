import { jsPDF } from 'jspdf';

const MARGIN = 20;
const PAGE_WIDTH = 210;
const MAX_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 6;

function addParagraph(doc: jsPDF, text: string, startY: number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, MAX_WIDTH);
    let y = startY;
    lines.forEach((line: string) => {
        if (y > 270) {
            doc.addPage();
            y = MARGIN;
        }
        doc.text(line, MARGIN, y);
        y += LINE_HEIGHT;
    });
    return y + 8;
}

export function exportCoverLetterToPdf(coverLetter: string): void {
    const doc = new jsPDF();
    let y = MARGIN + 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Cover Letter', MARGIN, y);
    y += LINE_HEIGHT * 2;

    const paragraphs = coverLetter.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    paragraphs.forEach((paragraph) => {
        y = addParagraph(doc, paragraph.trim(), y);
    });

    const fileName = `cover-letter-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
}
