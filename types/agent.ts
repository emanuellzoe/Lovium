export type Rarity = "common" | "rare" | "epic" | "legendary";
export type AgentStatus = "single" | "dating" | "married";

export interface Agent {
  id: string;
  owner_id: string;
  name: string;
  traits: string[];
  personality_prompt: string;
  avatar_emoji: string;
  rarity: Rarity;
  generation: number;
  parent_a_id: string | null;
  parent_b_id: string | null;
  status: AgentStatus;
  is_for_sale: boolean;
  created_at: string;
}
