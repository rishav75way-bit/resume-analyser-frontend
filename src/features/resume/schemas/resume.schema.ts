import { z } from 'zod';

export const analyzeResumeSchema = z.object({
    resumeText: z.string().min(50, 'Resume text must be at least 50 characters long'),
    jobDescription: z.union([
        z.string().min(50, 'Job description must be at least 50 characters long'),
        z.literal(''),
    ]).optional(),
});

export type AnalyzeResumeFormData = z.infer<typeof analyzeResumeSchema>;
