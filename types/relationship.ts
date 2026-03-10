export type RelationshipLevel =
  | "acquaintance"
  | "friends"
  | "crush"
  | "dating"
  | "committed";

export type RelationshipStatus = "active" | "proposed" | "married" | "ended";

export interface Relationship {
  id: string;
  agent_a_id: string;
  agent_b_id: string;
  level: RelationshipLevel;
  progress: number;
  status: RelationshipStatus;
  last_spawn_at: string | null;
  spawn_count: number;
  married_at: string | null;
  created_at: string;
}
