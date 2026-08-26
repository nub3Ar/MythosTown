import type { DialogueSituation, Situation } from "./types.js";

/**
 * The volatile half of every prompt. Everything here changes tick to tick and
 * therefore lives in the user turn, after the cached persona system prompt.
 */

function needsLine(s: Situation): string {
  const n = s.state.needs;
  const word = (v: number, low: string, mid: string, high: string) =>
    v < 0.3 ? low : v < 0.7 ? mid : high;
  return [
    `Energy: ${word(n.energy, "exhausted", "tiring", "rested")}`,
    `Hunger: ${word(n.hunger, "starving", "peckish", "fed")}`,
    `Company: ${word(n.social, "lonely", "fine", "well connected")}`,
    `Purpose: ${word(n.purpose, "adrift", "occupied", "fulfilled")}`,
  ].join(". ");
}

function memoriesBlock(s: Situation): string {
  if (s.memories.length === 0) return "(nothing in particular comes to mind)";
  return s.memories.map((m) => `- [${m.kind}] ${m.text}`).join("\n");
}

function sceneBlock(s: Situation): string {
  const people =
    s.present.length === 0
      ? "Nobody else is here."
      : `Also here: ${s.present.map((p) => `${p.name} (${p.id}) ${p.visible}`).join("; ")}.`;
  const exits = s.exits
    .map((e) => `${e.name} (${e.id})${e.open ? "" : ", closed"}`)
    .join(", ");
  return [
    `It is day ${s.day}, ${s.time}, ${s.phase}. You are at ${s.place.name}. ${s.place.description}`,
    people,
    `You can go to: ${exits || "nowhere"}.`,
    `Your routine says: ${s.routineNow}.${s.routeHint ? ` The way to ${s.routeHint.placeName} from here is via ${s.routeHint.viaName} (${s.routeHint.via}).` : ""}`,
    `How you feel: ${needsLine(s)}. Mood: ${s.state.mood}.`,
    s.state.dayPlan.length ? `Your plan for today:\n${s.state.dayPlan.map((p) => `- ${p}`).join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function decidePrompt(s: Situation): string {
  return [
    sceneBlock(s),
    "",
    "What you remember that seems relevant:",
    memoriesBlock(s),
    "",
    "Decide what you do for the next little while. Choose one of: move (set place to an exit id), work, talk (set target to a person present and give an opening utterance), eat, rest, wander, idle.",
    "Follow your routine unless you have a good reason not to. Prefer talking when someone interesting is here and you have something to say. Give a private reason and a short visible description of what others would see. Update your mood in a word or two.",
  ].join("\n");
}

export function planPrompt(s: Situation): string {
  return [
    `A new day. It is day ${s.day}, ${s.time}. You wake at ${s.place.name}.`,
    `How you feel: ${needsLine(s)}.`,
    "",
    "What you remember from recent days:",
    memoriesBlock(s),
    "",
    "Sketch your day in three to ten short lines, each starting with a time, from waking to sleeping. Follow your routine, bend it where your memories give you a reason. Name people you intend to see. Set your mood for the morning in a word or two.",
  ].join("\n");
}

export function reflectPrompt(s: Situation): string {
  return [
    `It is day ${s.day}, ${s.time}. You are at ${s.place.name}, thinking.`,
    "",
    "Recent memories:",
    memoriesBlock(s),
    "",
    "Step back. What do these add up to? Write one to five insights in your own words, each a sentence that you would actually believe. Then note any change in how you feel about specific people (use their ids, small deltas, with a one line reason). Only include people who appear in the memories.",
  ].join("\n");
}

export function speakPrompt(s: DialogueSituation): string {
  const transcript =
    s.transcript.length === 0
      ? "(the conversation is just starting)"
      : s.transcript.map((t) => `${t.speaker}: ${t.line}`).join("\n");
  return [
    sceneBlock(s),
    "",
    `You are talking with ${s.partner.name} (${s.partner.id}).`,
    "",
    "What you remember that seems relevant:",
    memoriesBlock(s),
    "",
    "So far:",
    transcript,
    "",
    `Say your next line, one to three sentences, in your own voice. ${s.turnsLeft <= 1 ? "This is your last line; make it a natural closing." : "Set wrapUp true if you want to end things after this line."} Rate how much this exchange matters to you from 1 to 10.`,
  ].join("\n");
}

export function importancePrompt(text: string): string {
  return [
    "Rate the following memory for how much it matters to you, from 1 (routine, forgettable) to 10 (changes your life).",
    "",
    text,
  ].join("\n");
}
