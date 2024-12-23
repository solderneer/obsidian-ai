export interface AIConfig {
	embeddingModel: string;
	chatModel: string;
	minParagraphSize: number;
	maxParagraphSize: number;
	charsFromPreviousParagraph: number;
	minLengthBeforeAutoSearch: number;
}

export const config: AIConfig = {
	embeddingModel: "text-embedding-3-small",
	chatModel: "gpt-4o-mini",
	minParagraphSize: 250,
	maxParagraphSize: 1000,
	charsFromPreviousParagraph: 100,
	minLengthBeforeAutoSearch: 10,
};
