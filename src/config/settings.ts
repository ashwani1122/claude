// Settings come from three sources, lowest to highest priority:
// global (~/.claude/settings.json) < project (.claude/settings.json) < env vars.

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Settings } from "./types.js";

export function getGlobalSettingsPath(): string {
	return join(homedir(), ".claude", "settings.json");
}

export function getProjectSettingsPath(): string {
	return join(process.cwd(), ".claude", "settings.json");
}

export async function loadSettings(): Promise<Settings> {
	const global = await readJsonSafe(getGlobalSettingsPath());
	const project = await readJsonSafe(getProjectSettingsPath());
	const merged: Settings = { ...global, ...project };

	if (process.env.claude_PROVIDER) merged.provider = process.env.claude_PROVIDER;
	if (process.env.claude_MODEL) merged.model = process.env.claude_MODEL;

	return merged;
}

export async function saveGlobalSettings(settings: Settings): Promise<void> {
	await mkdir(join(homedir(), ".claude"), { recursive: true });
	await writeFile(getGlobalSettingsPath(), JSON.stringify(settings, null, 2), "utf-8");
}

// Read a JSON file, returning {} if it's missing or unparseable.
async function readJsonSafe(path: string): Promise<Partial<Settings>> {
	if (!existsSync(path)) return {};
	try {
		const raw = await readFile(path, "utf-8");
		return JSON.parse(raw) as Partial<Settings>;
	} catch {
		return {};
	}
}

export { readJsonSafe };
