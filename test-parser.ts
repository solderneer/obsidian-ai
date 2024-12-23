import {
	parseMarkdown,
	createChunkContext,
	smartChunkParagraphs,
} from "./src/utils";

const testText = `
Sep 8, 2021, 9:43:57 PM

4s’s
- signalling
- Subconscious hacking
- Satisfysing
- psycho physics

Opposite of a good idea is also a good idea
You should test un-something ideas because no one else does

People don’t think what they feel
They don’t say what they think 
They don’t do What they say

To try and encourage a rational behaviour don’t restrict yourself to rational cues or methods or arguments. Eg people brush teeth because it feels good rather than to keep dental hygiene. That’s irrational reason. Even though they rationalise it by telling you oh no I do it for hygiene. 

Ability to change perspective is worth 80 IQ points

The way you phrase question matters. Still or sparkling. Would you like 4 or 5 alarms? Anchoring effect. 

Heads you get 50% more. Tails you lose 40%. Mathematical expectation says take this bet. But you shouldn’t. Because even though the average is above 1. It’s because 1 person gets super rich. 1.5 x 1.5, 1 will stay roughly the same. And 2 will lose! => I think this is because it’s percentage based rather than additional. 

Ensemble perspective vs time series perspective. 

When hiring don’t go for fairness. Because then you will always hire the same boring person. 

Generally having more vacancies to fill at same time makes you go for more diverse people whereas one at a time and you play it safe. 

If you wanna be good employee then be good at stuff your boss is bad at

Having a limit like min 2.1 degree is dumb. Talk to the different. 

A cafe that had moveable chairs outside has a signal for being open. It’s advertising. Also shows it’s probably good because someone is invested in putting in the chairs every day. 

A company that has advertising has faith that it’s product is good enough to invest in getting customers. And shows it had money. 

A London cab driver is better because he has invested so much in passing the test that he does not want to risk losing his license by over charging. Uber provides that with its rating system. Lack of an extensive test is why cab drivers in other countries are so bad and rip people off. You also trust London cab driver more because you know he is invested in it for long run. 

Buying house. You should value things that other people might not and is hard to value. Eg architecture. Not as easily measurable but similar to buying art. It’s worth something. 

https://www.goodreads.com/book/show/26210508-alchemy has some comparisons between between what British say and what they actually mean. They are all a bit tongue in cheek, so hoping no one gets offended! 😄

What British person says -> What British person means.

"That's not bad" -> "It's good"
"That's a very brave proposal" -> "You are insane"
"Quite good" -> "Frankly a bit disappointing"
"I would suggest" -> "Do this or be prepared to justify yourself"
"Oh incidentally, by the way" -> "This is now the primary purpose of our discussion".
"I was a bit disappointed that ...." -> "I am pretty annoyed that...".
"I hear what you say" -> "I disagree with what you say and I do not want to discuss it further".
"With all respect" -> "You are an idiot"
"Very interesting" -> "That's clearly nonsense"
"I ll bear it in mind" -> "I have forgotten it already"
"I am sure it's my fault" -> "It's your fault"
"You must come to dinner" -> "I am just being polite"
"I almost agree" -> "I don't agree at all"
"I only have a few minor comments" -> "Please rewrite completely"
"Could we consider some other options" -> "I hate your ideas"

Alchemy: The Surprising Power of Ideas That Don't Make Sense booksummary 

`;

const { content, frontmatter } = parseMarkdown(testText);
const result = smartChunkParagraphs(content, {
	minParagraphSize: 250,
	maxParagraphSize: 1000,
});
const charsFromPreviousParagraph = 150;
for (let i = 0; i < result.length; i++) {
	const section = result[i];
	console.log(section);
	let previousSectionChopped = "";
	if (i > 0 && charsFromPreviousParagraph > 0) {
		const previousSection = result[i - 1];
		if (previousSection.length > charsFromPreviousParagraph) {
			previousSectionChopped = previousSection.slice(
				previousSection.length - charsFromPreviousParagraph,
			);
		}
	}
	const context = createChunkContext(section, {}, "", previousSectionChopped);
	console.log("-----");
	console.log(context);
	console.log("==========");
}
