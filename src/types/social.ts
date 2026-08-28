export type AppNavTab = "rules" | "inbox" | "chat" | "funds";

export type InboxCategory = "all" | "updates" | "alerts" | "system";

export interface InboxMessage {
  id: string;
  sender: string;
  senderTag?: string;
  teamRank?: number;
  category: InboxCategory;
  subject: string;
  preview: string;
  body: string;
  timeAgo: string;
  unread: boolean;
  selected?: boolean;
  icon: "crown" | "wallet" | "chip" | "swords" | "gem" | "coins" | "trophy" | "shield" | "settings";
  requestAmount?: number;
  returnAmount?: number;
  returnRound?: number;
}

export interface InboxCategoryItem {
  id: InboxCategory;
  label: string;
  icon: "mail" | "trophy" | "shield" | "settings";
  count?: number;
}

export interface ChatMessage {
  id: string;
  team: string;
  rank: number;
  time: string;
  text: string;
  icon: "gem" | "spade" | "trophy" | "swords" | "target";
  borderColor?: "gold" | "silver" | "bronze" | "default";
}

export interface ChatChannel {
  id: string;
  label: string;
  active?: boolean;
}

export interface DirectMessage {
  id: string;
  team: string;
  online: boolean;
}

export interface FundRequest {
  id: string;
  team: string;
  amount: number;
  note: string;
  contractTerms: string;
  status: "pending" | "sent";
  icon: "wallet" | "gem" | "crown";
}

export interface FundTransaction {
  id: string;
  date: string;
  team: string;
  type: "Lent" | "Repaid" | "Bonus" | "Borrowed";
  amount: number;
}
