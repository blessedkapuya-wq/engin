/**
 * TypeScript definitions for BiasharaBase.com
 * "THE QUIET SALES ENGINE" — 5-Part Connected System
 */

export type PostTypeCategory =
  | 'pitfall'
  | 'question'
  | 'process'
  | 'opinion'
  | 'ask'
  | 'followup'
  | 'review';

export type SocialPlatform = 'all' | 'threads' | 'instagram' | 'whatsapp' | 'linkedin' | 'x';

export interface DayPrompt {
  day: number;
  week: number;
  type: PostTypeCategory;
  typeName: string;
  tagCode: 'P' | 'Q' | 'W' | 'O' | 'A' | 'F' | 'R';
  lightTrackAction: 'POST' | 'REPLIES' | 'OFF' | 'SAME';
  template: string;
  example: string;
  noCameraImageIdea: string;
  bestPlatform?: SocialPlatform;
  userNotes?: string;
  isCompleted?: boolean;
}

export interface WeeklyMetricRow {
  week: number;
  posts: number;
  replies: number;
  convos: number;
  asks: number;
  sales: number;
  oneThingToChange: string;
}

export interface BiasharaChapter {
  id: string;
  num: string;
  readTime: string;
  title: string;
  highlightWords: string[];
  subtitle: string;
  endOfChapterOutcome: string;
  corePoints: {
    num: string;
    headline: string;
    body: string;
  }[];
  interactiveToolType?: 'lane_builder' | 'reply_block' | 'weekly_ask_builder' | 'tracker' | 'post_crafter';
  doThisNow: {
    title: string;
    steps: string[];
  };
  founderQuote: {
    text: string;
    author: string;
  };
}

export interface IssuedPasscode {
  id?: string;
  code: string;
  buyerName: string;
  email?: string;
  orderId?: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Revoked';
  paymentMethod?: string;
  amount?: number;
  currency?: string;
  createdAt: string;
  isActive: boolean;
  activated?: boolean;
  activatedAt?: string;
  emailResentAt?: string;
  notes?: string;
  source?: string;
}

export interface EngineOrderRecord {
  id: string;
  buyerName: string;
  email: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  referenceId: string;
  licenseCode: string;
  timestamp: string;
  status: 'Paid' | 'Pending' | 'Revoked';
  source: string;
}

export interface BuyerProofQuote {
  id: string;
  name: string;
  location: string;
  niche: string;
  quote: string;
  result: string;
}

export interface EngineAppSettings {
  id: string;
  priceTZS: number;
  priceUSD: number;
  sellerWhatsApp: string;
  lipaNamba: string;
  lipaName: string;
  selarCheckoutUrl: string;
  makeWebhookUrl: string;
  supabaseProjectUrl: string;
  supabaseAnonKey: string;
  guideTitle: string;
  adminPin?: string;
  buyerReviews?: BuyerProofQuote[];
  updatedAt?: string;
}

export interface OfferWorksheetData {
  who: string;
  problem: string;
  outcome: string;
  deliverable: string;
  without: string;
  priceTZS: string;
  priceUSD: string;
  ctaKeyword: string;
  whatsappHandle: string;
}

export interface BuyerWorkspaceState {
  id: string;
  licenseCode: string;
  onboardingDone: boolean;
  startHereChecklist: Record<string, boolean>;
  completedSprintDays: Record<number, boolean>;
  offerWorksheet: OfferWorksheetData;
  scorecardRows: WeeklyMetricRow[];
  updatedAt: string;
}

export interface StarterProductNiche {
  id: string;
  title: string;
  category: 'templates' | 'guides' | 'services' | 'trackers';
  categoryLabel: string;
  targetBuyer: string;
  problemSolved: string;
  deliveryFormat: string;
  suggestedPriceTZS: number;
  suggestedPriceUSD: number;
  creationTimeHours: string;
  whatToInclude: string[];
  samplePitchHook: string;
}

export type ScriptCategory = 'status' | 'dm' | 'followup' | 'closing' | 'objection';

export interface DMSwipeScript {
  id: string;
  title: string;
  category: ScriptCategory;
  triggerScenario: string;
  script: string;
  proTip: string;
}

export interface LaunchSprintDay {
  day: number;
  title: string;
  focus: string;
  estimatedTime: string;
  checklist: string[];
  keyDeliverable: string;
}

export interface TemplateVaultItem {
  id: string;
  num: string;
  archetype: 'pitfall' | 'question' | 'process' | 'opinion' | 'ask';
  archetypeLabel: string;
  title: string;
  bestFor: string;
  template: string;
  tanzanianExample: string;
}

export interface TanzanianExampleItem {
  id: string;
  businessType: string;
  city: string;
  productSold: string;
  priceTZS: number;
  channel: string;
  postHook: string;
  whatsappConversation: {
    sender: 'Buyer' | 'Seller';
    message: string;
  }[];
  takeaway: string;
}

export interface CaseStudyItem {
  id: string;
  archetype: 'Freelancer' | 'Food Business' | 'Coach';
  name: string;
  location: string;
  beforeState: string;
  changeMade: string;
  outcomeMetric: string;
  timeframe: string;
  weeklyRoutine: string[];
  keyPostUsed: string;
}

export interface ConversationMapStage {
  step: string;
  title: string;
  goal: string;
  action: string;
  exactLine: string;
  mistakeToAvoid: string;
}
