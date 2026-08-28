import type {
  ChatChannel,
  ChatMessage,
  DirectMessage,
  FundRequest,
  FundTransaction,
  InboxCategoryItem,
  InboxMessage,
} from "@/types/social";

export const CURRENT_ROUND = 3;
export const PLAYER_TEAM = "The Aces";
export const PLAYER_COINS = 45;

export const inboxCategories: InboxCategoryItem[] = [
  { id: "all", label: "All Messages", icon: "mail", count: 3 },
  // { id: "updates", label: "Game Updates", icon: "trophy", count: 1 },
  // { id: "alerts", label: "Team Alerts", icon: "shield", count: 2 },
  // { id: "system", label: "System Notifications", icon: "settings" },
];

export const inboxMessages: InboxMessage[] = [
  {
    id: "1",
    sender: "Game Master",
    senderTag: "System",
    category: "system",
    subject: "Round 3 Results Posted",
    preview:
      "The answers have been verified. View your updated score and payout multipliers inside...",
    body: "The answers have been verified. View your updated score and payout multipliers inside the dashboard. Round 4 begins shortly.",
    timeAgo: "2m ago",
    unread: true,
    icon: "crown",
  },
  {
    id: "2",
    sender: "Wild Cards",
    senderTag: "#3",
    teamRank: 3,
    category: "alerts",
    subject: "Fund Request from Wild Cards",
    preview:
      "Hey Aces, we need 10 coins for a high stakes Round 4 side bet. Will repay next round with 1.5x interest...",
    body: `Hey Aces,

We are currently tracking behind on raw score this round, but we have high confidence in our prediction on sustainable growth in Question D. 

We need an additional 10 Coins to maximize our side wager. If you accept this lend request, we will authorize a programmatic contract to repay you with 1.5x returns immediately at the start of next round's payment phase.

Appreciate the support, let's keep the table competitive!`,
    timeAgo: "15m ago",
    unread: true,
    selected: true,
    icon: "wallet",
    requestAmount: 10,
    returnAmount: 15,
    returnRound: 4,
  },
  {
    id: "3",
    sender: "System",
    senderTag: "System",
    category: "system",
    subject: "New Side Bet Available",
    preview:
      "Place custom multiplier wagers on specific team performances for Round 3 now active...",
    body: "Place custom multiplier wagers on specific team performances for Round 3. Visit the betting screen to participate.",
    timeAgo: "1h ago",
    unread: true,
    icon: "chip",
  },
  {
    id: "4",
    sender: "Pocket Kings",
    senderTag: "#6",
    teamRank: 6,
    category: "alerts",
    subject: "Great round!",
    preview:
      "That radical transparency play in the third question was legendary. Good luck on the next turn...",
    body: "That radical transparency play in the third question was legendary. Good luck on the next turn!",
    timeAgo: "3h ago",
    unread: false,
    icon: "swords",
  },
  {
    id: "5",
    sender: "Royal Flush",
    senderTag: "#2",
    teamRank: 2,
    category: "updates",
    subject: "Alliance Proposal",
    preview:
      "We should sync bets on question D to corner the current market and maximize out bonuses...",
    body: "We should sync bets on question D to corner the current market and maximize our bonuses this round.",
    timeAgo: "1d ago",
    unread: false,
    icon: "gem",
  },
  {
    id: "6",
    sender: "System",
    senderTag: "System",
    category: "system",
    subject: "Your bet won! +30 coins",
    preview:
      "Congratulations. Your correct guess on Royal Flush's strategy paid off. Coins credited...",
    body: "Congratulations. Your correct guess on Royal Flush's strategy paid off. Coins have been credited to your balance.",
    timeAgo: "2d ago",
    unread: false,
    icon: "coins",
  },
];

export const chatChannels: ChatChannel[] = [
  { id: "general", label: "General Chat (All Teams)", active: true },
  { id: "team", label: "Team Chat (Private)" },
];

export const directMessages: DirectMessage[] = [
  { id: "1", team: "Royal Flush", online: true },
  { id: "2", team: "Wild Cards", online: false },
  { id: "3", team: "Pocket Kings", online: false },
  { id: "4", team: "High Rollers", online: false },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "1",
    team: "Royal Flush",
    rank: 2,
    time: "10:42 AM",
    text: "Bold strategy on C last round, Aces. Thought for sure you'd hedge on B.",
    icon: "gem",
    borderColor: "silver",
  },
  {
    id: "2",
    team: "The Aces",
    rank: 1,
    time: "10:43 AM",
    text: "We had the clues lined up perfectly. Radical Transparency was the only play.",
    icon: "spade",
    borderColor: "gold",
  },
  {
    id: "3",
    team: "Wild Cards",
    rank: 3,
    time: "10:45 AM",
    text: "Anyone willing to lend 10 coins for a side bet? Contract terms are generous.",
    icon: "trophy",
    borderColor: "bronze",
  },
  {
    id: "4",
    team: "Pocket Kings",
    rank: 6,
    time: "10:48 AM",
    text: "Round 4 predictions are going to be wild. Who's locking in early?",
    icon: "swords",
  },
  {
    id: "5",
    team: "High Rollers",
    rank: 5,
    time: "10:52 AM",
    text: "The Aces are looking unstoppable. Might need an alliance to catch up.",
    icon: "target",
  },
];

export const onlineTeams = [
  "The Aces (You)",
  "Royal Flush",
  "Wild Cards",
  "Full House",
  "High Rollers",
  "Pocket Kings",
  "All In",
  "The Bluffers",
  "Card Sharks",
  "Chip Leaders",
  "The Dealers",
  "The Jokers",
  "Straight Shooters",
];

export const fundRequests: FundRequest[] = [
  {
    id: "1",
    team: "Wild Cards",
    amount: 10,
    note: "Need coins for Round 4 side bet",
    contractTerms: "15 Coins next round",
    status: "pending",
    icon: "wallet",
  },
  {
    id: "2",
    team: "Royal Flush",
    amount: 15,
    note: "Hedged bets on Question C",
    contractTerms: "20 Coins next round",
    status: "pending",
    icon: "gem",
  },
  {
    id: "3",
    team: "High Rollers",
    amount: 8,
    note: "Bonus bet multiplier backup",
    contractTerms: "10 Coins next round",
    status: "sent",
    icon: "crown",
  },
];

export const fundTransactions: FundTransaction[] = [
  { id: "1", date: "Oct 24", team: "Pocket Kings", type: "Lent", amount: -10 },
  { id: "2", date: "Oct 23", team: "Wild Cards", type: "Repaid", amount: 15 },
  { id: "3", date: "Oct 22", team: "System", type: "Bonus", amount: 15 },
  { id: "4", date: "Oct 20", team: "Royal Flush", type: "Borrowed", amount: 20 },
  { id: "5", date: "Oct 19", team: "Full House", type: "Repaid", amount: -12 },
];
