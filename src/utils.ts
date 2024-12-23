// In production, this will be the real Obsidian import
import { parseYaml } from "obsidian";
// import { parseYaml } from "./mocks";

export function truncateString(str: string, maxLength: number): string {
	if (str.length <= maxLength) {
		return str;
	}

	return str.slice(0, maxLength) + "...";
}
export function removeMarkdown(text: string): string {
	// Remove emphasis (e.g., *text*, _text_)
	text = text.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1");

	// Remove headers (e.g., # Header)
	text = text.replace(/#{1,6}\s*(.*)/g, "$1");

	// Remove links (e.g., [Link](url))
	text = text.replace(/\[([^[\]]+)\]\([^()]+\)/g, "$1");

	// Remove images (e.g., ![Alt Text](url))
	text = text.replace(/!\[([^[\]]+)\]\([^()]+\)/g, "");

	// Remove code blocks (e.g., ```code```)
	text = text.replace(/`{3}([^`]+)`{3}/g, "");

	// Remove inline code (e.g., `code`)
	text = text.replace(/`([^`]+)`/g, "$1");

	// Remove lists (e.g., * List Item)
	text = text.replace(/^[\s]*[\-*+]\s+(.*)/gm, "$1");

	// Remove blockquotes (e.g., > Quote)
	text = text.replace(/^>\s+(.*)/gm, "$1");

	// Remove horizontal rules (e.g., ---)
	text = text.replace(/^-{3,}/gm, "");

	// Remove strikethrough (e.g., ~~text~~)
	text = text.replace(/~~([^~]+)~~/g, "$1");

	// Remove wikilinks (e.g., [[Link]])
	text = text.replace(/\[\[([^\]]+)\]\]/g, "$1");

	return text;
}

interface ChunkingOptions {
	minParagraphSize: number;
	maxParagraphSize: number;
}

export function smartChunkParagraphs(
	text: string,
	options: ChunkingOptions,
): string[] {
	const { minParagraphSize = 250, maxParagraphSize = 1000 } = options;

	// Split text by empty lines (keeping your existing logic)
	const paragraphs = text.split(/\r?\n\s*\r?\n/);
	const trimmedParagraphs = paragraphs
		.map((paragraph) => paragraph.trim())
		.filter((paragraph) => paragraph.length > 0); // Remove empty paragraphs

	const chunks: string[] = [];
	let currentChunk: string[] = [];
	let currentSize = 0;

	for (const paragraph of trimmedParagraphs) {
		const paragraphSize = paragraph.length;

		// If adding this paragraph would exceed maxParagraphSize and we have content,
		// save current chunk and start a new one
		if (
			currentSize + paragraphSize > maxParagraphSize &&
			currentChunk.length > 0
		) {
			chunks.push(currentChunk.join("\n\n"));
			currentChunk = [];
			currentSize = 0;
		}

		currentChunk.push(paragraph);
		currentSize += paragraphSize;

		// If we've reached minParagraphSize, this is a good break point
		if (currentSize >= minParagraphSize) {
			chunks.push(currentChunk.join("\n\n"));
			currentChunk = [];
			currentSize = 0;
		}
	}

	// Handle any remaining paragraphs
	if (currentChunk.length > 0) {
		// If the last chunk is too small and we have previous chunks,
		// combine it with the last chunk
		if (chunks.length > 0 && currentSize < minParagraphSize) {
			const lastChunk = chunks.pop()!;
			const combined = `${lastChunk}\n\n${currentChunk.join("\n\n")}`;
			chunks.push(combined);
		} else {
			chunks.push(currentChunk.join("\n\n"));
		}
	}

	return chunks;
}

export function parseMarkdown(markdown: string): {
	content: string;
	frontmatter: Record<string, any>;
} {
	const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/; // Regular expression to match frontmatter
	const match = markdown.match(frontmatterRegex);

	let content = markdown;
	let frontmatter: Record<string, any> = {};

	// Extract existing frontmatter if present
	if (match && match[1]) {
		const frontmatterString = match[1];
		try {
			const parsed = parseYaml(frontmatterString);
			if (parsed && typeof parsed === "object") {
				frontmatter = parsed as Record<string, any>;
			}
			content = content.replace(match[0], ""); // Remove frontmatter from content
		} catch (error) {
			console.error(`Error parsing frontmatter: ${error}`);
		}
	}

	// Extract title from first header if not in frontmatter
	if (!frontmatter.title) {
		const titleMatch = content.match(/^#\s+(.+)$/m);
		if (titleMatch) {
			frontmatter.title = titleMatch[1].trim();
		}
	}

	// Extract date if present at the top of the document
	const dateRegex =
		/(?:^|\n)([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+(?:AM|PM))/;
	const dateMatch = content.match(dateRegex);
	if (dateMatch && !frontmatter.date) {
		try {
			const parsedDate = new Date(dateMatch[1]);
			if (!isNaN(parsedDate.getTime())) {
				frontmatter.date = parsedDate.toISOString();
			}
		} catch (error) {
			console.error(`Error parsing date: ${error}`);
		}
	}

	// Extract hashtags from content
	const hashtagRegex = /#([a-zA-Z]\w+)/g;
	const hashtagMatches = content.matchAll(hashtagRegex);
	const hashtags = Array.from(hashtagMatches, (match) =>
		match[1].toLowerCase(),
	);

	// Add hashtags to frontmatter tags
	if (hashtags.length > 0) {
		const existingTags = Array.isArray(frontmatter.tags)
			? frontmatter.tags
			: [];
		const uniqueTags = [...new Set([...existingTags, ...hashtags])];
		frontmatter.tags = uniqueTags;
	}

	return { content, frontmatter };
}

export function createChunkContext(
	section: string,
	metadata: object,
	path: string,
	prevContext?: string,
): string {
	// combine previous context + content with no additional markers:
	let content = "";
	if (prevContext) {
		content = `${prevContext}\n\n${section}`;
	} else {
		content = section;
	}

	// Extract title and tags from metadata
	const anyMetadata = metadata as any;
	const title = anyMetadata.title
		? `Title: ${anyMetadata.title}`
		: `Title: ${path}`;
	const tags = anyMetadata.tags ? `Tags: ${anyMetadata.tags.join(", ")}` : "";

	// Combine everything into a structured format
	return [
		title,
		tags,
		// OpenAI recommends replacing newlines with spaces for best results (specific to embeddings)
		`Content: ${content.replace(/\n/g, " ")}`,
	]
		.filter(Boolean)
		.join("\n");
}
