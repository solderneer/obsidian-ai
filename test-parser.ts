import { parseMarkdown, createChunkContext, smartChunkParagraphs } from "./src/utils";


const testText = `
# Trillion Dollar Coach (Bill Campbell), Eric Schmidt, Jonathan Rosenberg, Alan Eagle

Jul 2, 2023, 8:21:59 PM
**Trillion Dollar Coach (Bill Campbell), Eric Schmidt, Jonathan Rosenberg, Alan Eagle**
As a football coach, you need not to worry about people's feelings.
football coach -> ad agency -> head of product -> CEO -> coach. When you start you think you are always have to play catch up in the new role/environment but not the case.

Team should communicate to make sure the tension and disagreement is brought to the surface and addressed.

good teams need strong mechanisms for resolving conflict and making decisions.

Team success:
1. SMART CREATIVEs: someone who combines technical knowledge with business savvy and creative flair. <- google's new breed of employee! Essential for success and to build great product.
2. Teams need to act like communities. Collectively care about the success of the team rather than the individuals.

Lack of community is leading factor in job burnout.
To form a commnity from a team you need a coach.

Most insecure managers are the ones threatened by suggestion from others, e.g. coaching.

Managers used to be responsible only for controlling, supervising, evaluation, rewarding and punishment - Now they need to be coaches: create a climate of communities, respect, feedback and trust. They need to give their team freedom and resources to do great things.

"simple in concept but hard in practice"
you need "a higher level of honesty, and better understanding of people and management.

#hithere #booksummary
`;

const { content, frontmatter } = parseMarkdown(testText);
const result = smartChunkParagraphs(content, {
	minParagraphSize: 200,
	maxParagraphSize: 5000,
});

const context = createChunkContext(result[2], frontmatter, "");

//console.log(content);
//console.log(frontmatter);
console.log(context);