// Mock the parseYaml function from obsidian
import * as yaml from "js-yaml";

export const parseYaml = (text: string) => {
	return yaml.load(text);
};
