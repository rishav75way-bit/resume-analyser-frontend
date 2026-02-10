import { jsPDF } from 'jspdf';
import type { AIResultData } from '../types';
import { LABELS } from './constants';

const MARGIN = 20;
const PAGE_WIDTH = 210;
const MAX_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 6;
const SECTION_GAP = 10;

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, MARGIN, y);
    return y + LINE_HEIGHT;
}

function addListItems(doc: jsPDF, items: string[], startY: number): number {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let y = startY;
    items.forEach((item) => {
        const lines = doc.splitTextToSize(`- ${item}`, MAX_WIDTH);
        lines.forEach((line: string) => {
            if (y > 270) {
                doc.addPage();
                y = MARGIN;
            }
            doc.text(line, MARGIN, y);
            y += LINE_HEIGHT;
        });
        y += 2;
    });
    return y;
}

function addParagraph(doc: jsPDF, text: string, startY: number): number {
    doc.setFontSize(10);
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
    return y + SECTION_GAP;
}

export function exportAnalysisToPdf(result: AIResultData): void {
    const doc = new jsPDF();
    let y = MARGIN;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(LABELS.PAGE_TITLE, MARGIN, y);
    y += LINE_HEIGHT * 2;

    const hasScore = typeof result.resumeScore === 'number' || (result.scoreSummary && result.scoreSummary.length > 0);
    if (hasScore) {
        y = addSectionTitle(doc, LABELS.RESUME_SCORE, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const scoreText = typeof result.resumeScore === 'number' ? `${result.resumeScore} / 10` : '';
        if (scoreText) {
            doc.text(scoreText, MARGIN, y);
            y += LINE_HEIGHT;
        }
        if (result.scoreSummary && result.scoreSummary.length > 0) {
            y = addParagraph(doc, result.scoreSummary, y);
        } else {
            y += SECTION_GAP;
        }
    }

    const keywordsPresent = result.keywordsPresent ?? [];
    if (keywordsPresent.length > 0) {
        y = addSectionTitle(doc, LABELS.KEYWORDS_PRESENT, y);
        y = addListItems(doc, keywordsPresent, y);
        y += SECTION_GAP;
    }

    const keywordsMissing = result.keywordsMissing ?? [];
    if (keywordsMissing.length > 0) {
        y = addSectionTitle(doc, LABELS.KEYWORDS_MISSING, y);
        y = addListItems(doc, keywordsMissing, y);
        y += SECTION_GAP;
    }

    y = addSectionTitle(doc, LABELS.STRENGTHS, y);
    y = addListItems(doc, result.strengths, y);
    y += SECTION_GAP;

    y = addSectionTitle(doc, LABELS.WEAKNESSES, y);
    y = addListItems(doc, result.weaknesses, y);
    y += SECTION_GAP;

    y = addSectionTitle(doc, LABELS.SUGGESTIONS, y);
    y = addListItems(doc, result.improvementSuggestions, y);

    const fileName = `resume-analysis-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
}
