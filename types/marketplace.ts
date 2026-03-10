export type ListingStatus = "active" | "sold" | "cancelled";

export interface MarketplaceListing {
  id: string;
  agent_id: string;
  seller_id: string;
  price_diamond: number;
  status: ListingStatus;
  buyer_id: string | null;
  sold_at: string | null;
  created_at: string;
}
