import { 
  BiasharaChapter, 
  DayPrompt, 
  WeeklyMetricRow, 
  StarterProductNiche, 
  DMSwipeScript, 
  LaunchSprintDay,
  TemplateVaultItem,
  TanzanianExampleItem,
  CaseStudyItem,
  ConversationMapStage,
  OfferWorksheetData
} from '../types/biashara';

export const BIASHARA_META = {
  brand: 'BiasharaBase',
  domain: 'biasharabase.com',
  handle: '@biasharabase',
  title: 'THE QUIET SALES ENGINE',
  kitTitle: 'THE QUIET SALES ENGINE',
  frameworkName: 'The Text-to-Transaction (T3) Framework',
  subtitle: 'THE NO-REELS TEXT & DM SYSTEM FOR SELLING DIGITAL PRODUCTS',
  tagline: 'How to sell digital products, Notion templates, checklists, guides & freelance services using text-only posts, genuine direct messages, and zero video.',
  stats: '8 Core Chapters · 45-Day Multi-Platform Plan · 12 Ready-to-Launch Niches · 10 DM Swipe Files · 4 Interactive Tools',
  disclaimer: 'Zero videos, dancing, or studio cameras required.',
  readTonightText: 'Read it in 25 minutes tonight. Post your first offer tomorrow.',
  readTonightDesc: 'This playbook is intentionally dense and fast-reading. You can finish the curriculum in about 25 minutes.\n\nNo video recording. No dancing. No showing your face on camera if you prefer privacy. Just sharp text posts, high-trust replies, and a weekly offer cadence that brings qualified buyers straight into your DMs (IG, X, LinkedIn, Threads & WhatsApp).\n\nIncludes two execution tracks: The 25-Minute Daily Sprint, or The 2-Hour Weekend Batch for busy founders.',
  founderQuote: 'Built on a clear operational principle: serious buyers prioritize clarity and direct conversation over algorithmic video trends. When independent creators focus on high-trust text breakdowns and direct customer messaging, they create a predictable sales pipeline without studio cameras.',
  founderName: 'BiasharaBase Publishing'
};

export const BIASHARA_CHAPTERS: BiasharaChapter[] = [
  {
    id: 'ch01',
    num: '01',
    readTime: 'ABOUT 4 MIN',
    title: 'The Attention Trap: Why broadcasting fails and',
    highlightWords: ['conversations win.'],
    subtitle: "Posting links to empty rooms gets zero sales. Here is how modern algorithms actually treat text, and why intentional replies are your fastest route to qualified buyers.",
    endOfChapterOutcome: 'Leave one value-packed reply under a respected account in your niche.',
    corePoints: [
      {
        num: '01',
        headline: 'Conversations Beat Broadcast Announcements',
        body: 'Beginners make the mistake of shouting broadcast announcements: "New guide released!" or "Check out my link!" Nobody owes an announcement a response. A conversation hook gives your reader a low-barrier reason to stop, think, and reply.'
      },
      {
        num: '02',
        headline: 'The Reply Multiplier: Conversation Threads Drive Discovery',
        body: 'Platform distribution algorithms consistently favor active discussion threads over passive standalone broadcasts. Participating constructively in comments under established industry voices introduces your profile to targeted readers who are already actively engaged in your topic.'
      },
      {
        num: '03',
        headline: 'Keep Sales Links Out of the Main Post',
        body: 'Platform algorithms ruthlessly downrank posts containing external links. Post your full insight as high-value text first, and place your purchase link in your bio or as the first reply once engagement begins.'
      },
      {
        num: '04',
        headline: 'Static Text & Screenshots Beat Video Hype for Digital Products',
        body: 'Buyers looking for Notion templates, checklists, or professional consulting want fast clarity. A clean screenshot of a workflow or a simple text breakdown converts at a higher rate than a 15-second dancing reel.'
      },
      {
        num: '05',
        headline: 'Community Relevance Over Vanity Follower Counts',
        body: 'You do not need 10,000 followers to make a great living. You need 50 to 100 engaged buyers who understand your exact value. 5 real conversations a week beat 10,000 passive scrollers every time.'
      }
    ],
    interactiveToolType: 'reply_block',
    doThisNow: {
      title: 'Execute your first value reply today.',
      steps: [
        'Open Threads, X, or LinkedIn and locate a respected voice discussing digital tools or small business.',
        'Find a post with an active discussion. Add a genuine observation, a personal lesson learned, or a clarifying question.',
        'Never drop your sales link in the comment. Let the quality of your insight drive people to tap your bio.'
      ]
    },
    founderQuote: {
      text: 'Public comment sections function as an open portfolio of your thinking. When your contributions consistently solve micro-problems for others, prospective buyers will naturally visit your profile to explore your comprehensive offerings.',
      author: 'BiasharaBase'
    }
  },
  {
    id: 'ch02',
    num: '02',
    readTime: 'ABOUT 4 MIN',
    title: 'The Positioning Formula: How to write a bio that',
    highlightWords: ['converts strangers.'],
    subtitle: 'When a new visitor taps your profile, you have exactly 3 seconds to prove you solve their problem. Here is the single-sentence positioning formula that turns visits into followers and buyers.',
    endOfChapterOutcome: 'Your single-sentence positioning hook written and updated on your profiles.',
    corePoints: [
      {
        num: '01',
        headline: 'Target One Exact Problem for One Exact Person',
        body: 'Generalists struggle to sell. When your profile claims to help "everyone achieve success", it resonates with nobody. When you help "freelancers close retainers" or "digital sellers organize templates", buying intent skyrockets.'
      },
      {
        num: '02',
        headline: 'Define the Tangible Result They Wake Up Wanting',
        body: 'People do not buy ebooks or spreadsheets; they buy hours saved, stress eliminated, or money earned. State the exact tangible transformation in plain words.'
      },
      {
        num: '03',
        headline: 'Remove the Barrier They Dread the Most',
        body: 'Every industry has a major friction point that causes buyers to hesitate. State explicitly that your system bypasses that pain point (e.g., without complex coding, without dancing on video, without paid ads).'
      }
    ],
    interactiveToolType: 'lane_builder',
    doThisNow: {
      title: 'Deploy your clarity hook tonight.',
      steps: [
        'Use the T3 Formula: I help [EXACT WHO] achieve [TANGIBLE WIN] without [THE DREADED OBSTACLE].',
        'Read it aloud. If it sounds like corporate jargon, simplify it into casual conversational English.',
        'Update your WhatsApp Business description, Threads bio, and Instagram header before tomorrow morning.'
      ]
    },
    founderQuote: {
      text: 'Narrowing your offer feels terrifying at first. But the moment strangers can tell within 3 seconds that your guide was built specifically for their situation, they stop debating price and buy immediately.',
      author: 'BiasharaBase'
    }
  },
  {
    id: 'ch03',
    num: '03',
    readTime: 'ABOUT 6 MIN',
    title: 'The 5 Text Archetypes: Posts that naturally trigger',
    highlightWords: ['buying conversations.'],
    subtitle: 'Stop staring at a blank screen wondering what to write. Every high-converting text post falls into one of these 5 psychological archetypes that move readers toward a sale.',
    endOfChapterOutcome: 'Your first Hard-Learned Lesson post drafted and queued.',
    corePoints: [
      {
        num: '01',
        headline: 'Archetype 1: The Hard-Learned Lesson (Mistake → Insight → Question)',
        body: 'Share an early failure from your work. Readers connect deeply with authentic vulnerability: "In 2023 I spent 3 weeks building a product nobody wanted. Here is what I do differently now: [Lesson]. Have you made this mistake?"'
      },
      {
        num: '02',
        headline: 'Archetype 2: The Workflow Proof (Behind-The-Scenes Process)',
        body: 'Show the actual mechanics of how you create your digital products, organize spreadsheets, or solve client headaches. Authentic process builds 10x more trust than fake income claims.'
      },
      {
        num: '03',
        headline: 'Archetype 3: The Contrarian Truth (Challenging Bad Industry Advice)',
        body: 'Call out a toxic or outdated belief in your space that normal people secretly hate: "The advice to post 5 video reels a day is burning out creators. Here is why high-trust text posts close 3x more sales."'
      },
      {
        num: '04',
        headline: 'Archetype 4: The Low-Friction Question (Easy Comment Triggers)',
        body: 'Ask an open-ended question that takes less than 10 seconds to answer: "Digital sellers: do you prefer Notion or Google Sheets for managing customer orders? Tell me why below."'
      },
      {
        num: '05',
        headline: 'Archetype 5: The Direct Weekly Offer (Clear Invitation to Buy)',
        body: 'Once a week, invite your audience to purchase directly. State plainly who it is for, the exact problem it solves, the price, and where to order. Zero pressure, total clarity.'
      },
      {
        num: '06',
        headline: 'The Multi-Platform Rule: One Core Insight, Four Formats',
        body: 'Adapt each post natively: (1) Threads/X: single punchy post with link in the 1st reply. (2) WhatsApp Status: 3-slide story sequence that drives direct replies. (3) Instagram: 3-slide text carousel. (4) LinkedIn: double-spaced professional story.'
      }
    ],
    interactiveToolType: 'post_crafter',
    doThisNow: {
      title: 'Write tomorrow morning\'s Lesson post.',
      steps: [
        'Recall a mistake that cost you time or money when starting your digital product journey.',
        'Structure it using Archetype 1: What I did wrong → What I do today → What about you?',
        'Publish it tomorrow at 8:00 AM, then immediately spend 15 minutes replying to people.'
      ]
    },
    founderQuote: {
      text: 'People do not buy from anonymous corporate logos. They buy from creators whose thinking, lessons, and processes they respect. The 5 archetypes build that trust systematically.',
      author: 'BiasharaBase'
    }
  },
  {
    id: 'ch04',
    num: '04',
    readTime: 'ABOUT 4 MIN',
    title: 'The 15-Minute Daily Rhythm: Generating warm leads',
    highlightWords: ['without burnout.'],
    subtitle: 'You do not need to spend 6 hours a day on your phone. A disciplined 15-minute daily engagement block consistently generates more qualified leads than endless scrolling.',
    endOfChapterOutcome: 'Your first 15-minute focused engagement session completed.',
    corePoints: [
      {
        num: '01',
        headline: 'Set a Strict 15-Minute Countdown Timer',
        body: 'Treat engagement like a high-intensity workout. When the timer starts, your phone is a business tool. When it rings, you close the app. This prevents procrastination and social media fatigue.'
      },
      {
        num: '02',
        headline: 'The 5-5-5 Rule for Focused Outreach',
        body: 'Spend 5 minutes answering every reply on your own posts, 5 minutes leaving thoughtful comments on peer creators, and 5 minutes responding to targeted questions in your niche communities.'
      },
      {
        num: '03',
        headline: 'Never Pitch in Public Comment Sections',
        body: 'Comment sections are for demonstrating insight, not dropping affiliate links or spamming prices. When someone asks a deeper question, provide a generous answer and invite them to message you privately.'
      },
      {
        num: '04',
        headline: 'The Transition from Public Comment to Private DM',
        body: 'When a public conversation reveals a genuine customer pain point, send a simple direct message: "Hey, saw your question about managing client orders. Sent you a quick tip here if helpful." No pitch, pure service.'
      }
    ],
    interactiveToolType: 'reply_block',
    doThisNow: {
      title: 'Start a 15-minute timer right now.',
      steps: [
        'Click the 15-Minute Timer tool inside this app.',
        'Find 3 active posts where small business owners or digital creators are asking questions.',
        'Provide helpful, experience-based answers without pitching anything.'
      ]
    },
    founderQuote: {
      text: 'Consistency beats intensity. 15 minutes of disciplined, helpful interaction every single day will out-perform an exhausting 8-hour weekend marketing marathon every time.',
      author: 'BiasharaBase'
    }
  },
  {
    id: 'ch05',
    num: '05',
    readTime: 'ABOUT 5 MIN',
    title: 'The Conversation-to-Cash Protocol: Turning direct messages into',
    highlightWords: ['completed sales.'],
    subtitle: 'How to handle inquiries on WhatsApp and Instagram DMs with genuine respect, zero sleazy pressure, and frictionless checkout that closes orders smoothly.',
    endOfChapterOutcome: 'Save your 3 core WhatsApp quick-reply closing scripts.',
    corePoints: [
      {
        num: '01',
        headline: 'The 4-Step T3 Conversational Sequence',
        body: 'Follow this proven framework: (1) Acknowledge their message warmly, (2) Diagnose their exact bottleneck, (3) Confirm if your product solves it, (4) Provide direct payment instructions.'
      },
      {
        num: '02',
        headline: 'Answering "How Much Does This Cost?" Without Losing the Sale',
        body: 'Never respond with just a bare number. Answer with context: "The No-Reels System is TSh 25,000 ($10). That includes the complete 8-chapter guide, the 30-day template matrix, and our 3 interactive tools. Would you like me to send the M-Pesa / checkout link?"'
      },
      {
        num: '03',
        headline: 'Minimizing Checkout Friction Across Local Payment Rails',
        body: 'Multi-step checkouts and unfamiliar payment gateways often increase purchase drop-off. Providing immediate, familiar payment channels—such as direct M-Pesa / Tigo Pesa numbers or one-click WhatsApp order links—ensures buyers can complete transactions seamlessly on mobile.'
      },
      {
        num: '04',
        headline: 'The Respectful 24-Hour Follow-Up',
        body: 'Life gets busy. If a buyer asked for payment instructions but did not complete the order, send one polite note the next morning: "Hey [Name], just checking if you were able to access the link, or if you had any questions on the guide?" Never send more than one follow-up.'
      }
    ],
    interactiveToolType: 'weekly_ask_builder',
    doThisNow: {
      title: 'Save your checkout scripts to your phone.',
      steps: [
        'Open your WhatsApp Business settings and set up your Quick Replies.',
        'Save shortcut /order: includes your product title, price, M-Pesa number, and instant unlock instructions.',
        'Test your payment link to confirm it works in under 30 seconds.'
      ]
    },
    founderQuote: {
      text: 'Selling in the DMs is not about persuasion or tricks; it is about diagnosing a genuine problem and providing the easiest possible path for the customer to get the solution.',
      author: 'BiasharaBase'
    }
  },
  {
    id: 'ch06',
    num: '06',
    readTime: 'ABOUT 4 MIN',
    title: 'Zero-Camera Visual Proof: The graphics that',
    highlightWords: ['build instant trust.'],
    subtitle: 'You do not need professional lighting or a video camera to sell digital products. These 4 static visual assets generate higher conversion rates than influencer videos.',
    endOfChapterOutcome: 'Prepare a 3-slide text carousel or workflow screenshot.',
    corePoints: [
      {
        num: '01',
        headline: 'The Clean Text Slide (High-Contrast Neo-Brutalist Graphics)',
        body: 'A dark charcoal square with bold white text and neon highlighter accents stops scrollers immediately. It feels authoritative, easy to read, and takes under 3 minutes to produce.'
      },
      {
        num: '02',
        headline: 'The Unedited Workflow Screenshot',
        body: 'Take a direct screenshot of your Notion dashboard, spreadsheet formulas, or prompt bank. Showing real work in progress proves you actually build the tools you sell.'
      },
      {
        num: '03',
        headline: 'The Customer Message Snippet',
        body: 'A cropped screenshot of a genuine customer WhatsApp reply saying "Your template saved me 3 hours today" carries 10x more weight than any claims you can write about yourself.'
      },
      {
        num: '04',
        headline: 'The Physical Deliverable Stack Mockup',
        body: 'Digital products feel intangible. Presenting your curriculum, daily matrix, and toolkits as a visual 3D bundle mockup gives the buyer immediate clarity on the immense value included.'
      }
    ],
    interactiveToolType: 'post_crafter',
    doThisNow: {
      title: 'Create one workflow proof asset.',
      steps: [
        'Take a screenshot of a template, guide outline, or customer message on your screen.',
        'Pair it with an Archetype 2 post: "Behind the scenes of how we built this week\'s tool."',
        'Attach it to your next scheduled text post.'
      ]
    },
    founderQuote: {
      text: 'Slick studio cameras make people skeptical because they look like paid advertisements. A genuine screenshot of a helpful spreadsheet or text conversation looks like authentic truth.',
      author: 'BiasharaBase'
    }
  },
  {
    id: 'ch07',
    num: '07',
    readTime: 'ABOUT 4 MIN',
    title: 'The Dual-Track Matrix: Consistent execution',
    highlightWords: ['without creator burnout.'],
    subtitle: 'Choose between the high-momentum Daily Sprint (25 minutes/day) or the sustainable Light Pace (2 hours/week). Both lead to steady sales when executed with discipline.',
    endOfChapterOutcome: 'Select your track and complete your Day 1 post.',
    corePoints: [
      {
        num: '01',
        headline: 'Track A: The 25-Minute Daily Sprint (Fastest Traction)',
        body: 'Ideal when launching a new digital product or looking to rapidly build customer momentum. One high-value post published every morning, followed immediately by 15 minutes of replies.'
      },
      {
        num: '02',
        headline: 'Track B: The Light Pace (For Busy Founders & Side-Hustlers)',
        body: 'If you have a demanding full-time job, do not burn out trying to post daily. Post 3 high-impact posts a week (Tuesday, Thursday, Sunday), and use the remaining days exclusively for 10-minute reply blocks.'
      },
      {
        num: '03',
        headline: 'Batching Your Content in 60 Minutes',
        body: 'Never write under pressure 10 minutes before posting. Spend 60 minutes on Sunday afternoon using the 5 Archetypes to write your entire week\'s content, saving them directly in your notes app.'
      },
      {
        num: '04',
        headline: 'The Power of the 30-Day Checkbox Streak',
        body: 'Momentum is psychological. Marking each day complete on your 30-day dashboard reinforces consistency until social selling becomes an automatic daily routine.'
      }
    ],
    interactiveToolType: 'tracker',
    doThisNow: {
      title: 'Pick your track on the calendar tab.',
      steps: [
        'Open the 30-Day Plan tab in this app.',
        'Toggle between Daily Track or Light Track based on your schedule this week.',
        'Review Day 1 prompt and queue it for tomorrow.'
      ]
    },
    founderQuote: {
      text: 'The biggest reason digital creators fail is not lack of talent; it is burning out after two weeks of frantic, unstructured posting. A predictable system protects your energy and your revenue.',
      author: 'BiasharaBase'
    }
  },
  {
    id: 'ch08',
    num: '08',
    readTime: 'ABOUT 4 MIN',
    title: 'The 4 True Metrics: Ignore vanity likes and',
    highlightWords: ['track real commerce.'],
    subtitle: 'Follower counts and viral views do not pay your living expenses. These four operational metrics give you total clarity and control over your monthly digital revenue.',
    endOfChapterOutcome: 'Log your baseline numbers in the 4-Number Weekly Scorecard.',
    corePoints: [
      {
        num: '01',
        headline: 'Metric 1: High-Value Posts Published',
        body: 'The only input you have 100% control over. Target 3 to 5 structured posts per week using the 5 Archetypes.'
      },
      {
        num: '02',
        headline: 'Metric 2: Meaningful Replies Left',
        body: 'Track how many thoughtful, value-first comments you leave on peer accounts and prospective customer threads. Aim for 30 to 50 genuine replies per week.'
      },
      {
        num: '03',
        headline: 'Metric 3: Active DM & WhatsApp Conversations',
        body: 'The leading indicator of future revenue. How many private conversations did your posts spark this week? More conversations equal more sales.'
      },
      {
        num: '04',
        headline: 'Metric 4: Direct Purchase Inquiries (Asks)',
        body: 'How many times did you clearly ask for the sale, and how many people asked for payment details? If this number is zero, you cannot expect revenue.'
      }
    ],
    interactiveToolType: 'tracker',
    doThisNow: {
      title: 'Set up your Sunday accountability review.',
      steps: [
        'Open the 4-Numbers Weekly Tracker tab in this app.',
        'Log your targets for Posts, Replies, Convos, and Asks for the coming week.',
        'Set a recurring calendar reminder every Sunday evening to review your real numbers.'
      ]
    },
    founderQuote: {
      text: 'Focusing on controllable daily actions—publishing clear posts, answering inquiries, and issuing direct weekly offers—creates commercial consistency that vanity follower counts can never replicate.',
      author: 'BiasharaBase'
    }
  }
];

export const BIASHARA_30_DAY_PLAN: DayPrompt[] = [
  // WEEK 1: ESTABLISHING YOUR LANE & SHARING INITIAL VALUE
  {
    day: 1,
    week: 1,
    type: 'pitfall',
    typeName: 'The Costly Mistake',
    tagCode: 'P',
    lightTrackAction: 'POST',
    template: 'The biggest mistake I made when launching my first digital product:\n\n[MISTAKE YOU MADE]\n\nI thought it would save time, but it actually cost me [TIME OR MONEY].\n\nWhat I do now instead: [YOUR SIMPLE FIX].\n\nHave you fallen into this trap? Tell me below.',
    example: 'The biggest mistake I made when launching my first digital product:\n\nspending 3 weeks building a complex 80-page guide before asking anyone if they wanted it.\n\nWhat I do now instead: I validate with a simple 5-page checklist and 3 WhatsApp conversations first.\n\nHave you fallen into this trap? Tell me below.',
    noCameraImageIdea: 'Screenshot of a blank document vs completed 5-page outline side-by-side.'
  },
  {
    day: 2,
    week: 1,
    type: 'question',
    typeName: 'The Low-Friction Question',
    tagCode: 'Q',
    lightTrackAction: 'REPLIES',
    template: 'Quick question for [YOUR SPECIFIC AUDIENCE]:\n\nWhen trying to [DESIRED OUTCOME], what is the single biggest bottleneck slowing you down right now?\n\n[OPTION A] or [OPTION B]?\n\nDrop your answer below. Replying to every comment today.',
    example: 'Quick question for digital sellers and freelancers:\n\nWhen trying to get clients from social media, what is the single biggest bottleneck slowing you down?\n\n[A] Not knowing what to write, or [B] Not knowing how to close in the DMs?\n\nDrop your answer below. Replying to every comment today.',
    noCameraImageIdea: 'A plain solid black card with yellow text: "[A] or [B]?"'
  },
  {
    day: 3,
    week: 1,
    type: 'process',
    typeName: 'Behind-The-Scenes Workflow',
    tagCode: 'W',
    lightTrackAction: 'POST',
    template: 'A look behind the scenes of how we organize [CORE WORKFLOW]:\n\n1. [STEP 1]\n2. [STEP 2]\n3. [STEP 3]\n\nZero fancy software. Just clean execution.\n\nWould a free template of this workflow be useful? Let me know below.',
    example: 'A look behind the scenes of how we organize our customer order tracking on WhatsApp:\n\n1. Star the payment confirmation message immediately\n2. Tag the chat with the product name label\n3. Send the instant access link with quick reply shortcut\n\nZero fancy software. Just clean execution.\n\nWould a free template of this workflow be useful? Let me know below.',
    noCameraImageIdea: 'Screenshot of organized WhatsApp labels or a clean spreadsheet table.'
  },
  {
    day: 4,
    week: 1,
    type: 'opinion',
    typeName: 'The Contrarian Truth',
    tagCode: 'O',
    lightTrackAction: 'OFF',
    template: 'Unpopular truth about [YOUR INDUSTRY]:\n\n[EXPENSIVE OR EXHAUSTING MYTH] is completely unnecessary.\n\nHere is what actually works: [PRACTICAL TRUTH].\n\nAgree or disagree? Drop your thoughts.',
    example: 'Unpopular truth about selling digital products:\n\nPosting 5 video reels a day with trending audio is completely unnecessary.\n\nHere is what actually works: writing 3 clear text posts that solve real problems, and having genuine conversations in your DMs.\n\nAgree or disagree? Drop your thoughts.',
    noCameraImageIdea: 'Screenshot of a simple notes app quote with your handle.'
  },
  {
    day: 5,
    week: 1,
    type: 'ask',
    typeName: 'The Direct Weekly Offer',
    tagCode: 'A',
    lightTrackAction: 'POST',
    template: 'Weekly Offer:\n\nIf you want to [SOLVE BIG PROBLEM] without [COMMON PAIN], we built [PRODUCT NAME].\n\nInside you get:\n• [FEATURE 1]\n• [FEATURE 2]\n• [FEATURE 3]\n\nOnly [PRICE]. Message me with "[KEYWORD]" or tap the link in my bio to get instant access.',
    example: 'Weekly Offer:\n\nIf you want to sell your digital products and templates on social media without filming videos or dancing on camera, we built THE QUIET SALES ENGINE.\n\nInside you get:\n• Complete 8-Chapter T3 Playbook\n• 45-Day Multi-Platform Matrix\n• Built-in Interactive Toolkits\n\nOnly TSh 25,000 ($10). Message me with "QUIET" or tap the link in my bio to get instant access.',
    noCameraImageIdea: 'The 3D digital book and tools stack mockup graphic.'
  },
  {
    day: 6,
    week: 1,
    type: 'followup',
    typeName: 'Customer Conversation Proof',
    tagCode: 'F',
    lightTrackAction: 'REPLIES',
    template: 'A message we received yesterday that made our week:\n\n"[CUSTOMER QUOTE OR FEEDBACK]"\n\nThis is why we built [PRODUCT NAME]. When you solve real problems, business becomes fun again.',
    example: 'A message we received yesterday that made our week:\n\n"I used Day 1\'s pitfall template on my WhatsApp status and closed 2 template orders within 45 minutes!"\n\nThis is why we built The No-Reels System. When you solve real problems, business becomes fun again.',
    noCameraImageIdea: 'Cropped screenshot of a real customer message with their name blurred for privacy.'
  },
  {
    day: 7,
    week: 1,
    type: 'review',
    typeName: 'Weekly Metrics Review',
    tagCode: 'R',
    lightTrackAction: 'SAME',
    template: 'Sunday Reflection:\n\nThis week we published [NUMBER] posts, had [NUMBER] conversations in DMs, and closed [NUMBER] new orders.\n\nThe single biggest lesson learned this week: [LESSON].\n\nWhat was your #1 business win this week?',
    example: 'Sunday Reflection:\n\nThis week we published 4 text posts, had 14 conversations in DMs, and closed 6 guide orders.\n\nThe single biggest lesson learned: asking simple questions in comments consistently starts more genuine conversations than broadcasting links.\n\nWhat was your #1 business win this week?',
    noCameraImageIdea: 'Screenshot of the completed 4-Number weekly scorecard.'
  },

  // WEEKS 2 - 4 PROMPTS (STRUCTURED & ORIGINAL)
  {
    day: 8,
    week: 2,
    type: 'pitfall',
    typeName: 'Pricing Pitfall',
    tagCode: 'P',
    lightTrackAction: 'POST',
    template: 'The trap of undercharging:\n\nWhen I started selling [PRODUCT/SERVICE], I charged [VERY LOW PRICE] because I lacked confidence.\n\nWhat happened: [EXHAUSTION / DIFFICULT BUYERS].\n\nWhen I raised my price to [FAIR PRICE] and added [CLEAR PROMISE], sales actually increased.\n\nAre you undercharging for your knowledge?',
    example: 'The trap of undercharging:\n\nSetting an unsustainably low price often signals low perceived value and attracts high-friction support requests. Packaging your knowledge as a complete, structured toolkit at a fair commercial price establishes professional trust and attracts serious implementers.',
    noCameraImageIdea: 'Price comparison breakdown graphic on dark background.'
  },
  {
    day: 9,
    week: 2,
    type: 'question',
    typeName: 'Audience Pain Check',
    tagCode: 'Q',
    lightTrackAction: 'REPLIES',
    template: 'Be honest:\n\nHow much time did you spend creating content this week vs how many actual customer sales did you make?\n\nIf the ratio feels completely broken, drop an emoji below. I want to share something helpful.',
    example: 'Be honest:\n\nHow much time did you spend creating video reels this week vs how many actual customer orders did you get?\n\nIf the ratio feels completely broken, drop an emoji below. I want to share something helpful.',
    noCameraImageIdea: 'Bold text slide: "Time Spent Creating vs Sales Made".'
  },
  {
    day: 10,
    week: 2,
    type: 'process',
    typeName: 'The 3-Step Solution',
    tagCode: 'W',
    lightTrackAction: 'POST',
    template: 'How we turn a 1-sentence customer question into a complete digital product in 48 hours:\n\n1. [PHASE 1]\n2. [PHASE 2]\n3. [PHASE 3]\n\nNo overthinking. Speed is your biggest advantage as a creator.',
    example: 'How we turn a 1-sentence customer question into a complete digital product in 48 hours:\n\n1. Outline the 5 steps to solve it on a blank notepad\n2. Add the exact templates and copy-paste formulas\n3. Package it into a clean web guide with WhatsApp checkout\n\nNo overthinking. Speed is your biggest advantage as a creator.',
    noCameraImageIdea: 'Photo of a clean desk with notebook outline and laptop.'
  },
  {
    day: 11,
    week: 2,
    type: 'opinion',
    typeName: 'Algorithm Mythbusting',
    tagCode: 'O',
    lightTrackAction: 'OFF',
    template: 'The algorithm does not hate you. Your posts are just giving people nothing to respond to.\n\nAnnouncements get ignored.\nConversations get replies.\n\nStart your next post with [STRONG CONVERSATION HOOK] and watch the difference.',
    example: 'The algorithm does not hate you. Your posts are just giving people nothing to respond to.\n\nAnnouncements get ignored.\nConversations get replies.\n\nStart your next post with a real mistake or a polarizing question and watch the difference.',
    noCameraImageIdea: 'Two columns: "What Gets Ignored" vs "What Gets Replies".'
  },
  {
    day: 12,
    week: 2,
    type: 'ask',
    typeName: 'The Pain-to-Solution Ask',
    tagCode: 'A',
    lightTrackAction: 'POST',
    template: 'Tired of [EXHAUSTING ROUTINE]?\n\nOur [PRODUCT NAME] teaches you how to [DESIRED RESULT] using only [SIMPLE METHOD].\n\n• Instant download\n• Works on WhatsApp, Threads & Instagram\n• Only [PRICE]\n\nSend me a message with "[WORD]" and I\'ll send your instant access link.',
    example: 'Tired of editing videos for 3 hours to get 14 views?\n\nOur Quiet Sales Engine teaches you how to sell your digital products using simple text posts and warm direct messages.\n\n• Instant download\n• Works on WhatsApp, Threads & Instagram\n• Only TSh 25,000 ($10)\n\nSend me a message with "ENGINE" and I\'ll send your instant access link.',
    noCameraImageIdea: 'Product bundle mockup card with green highlighter badge.'
  },
  {
    day: 13,
    week: 2,
    type: 'followup',
    typeName: 'Transformation Story',
    tagCode: 'F',
    lightTrackAction: 'REPLIES',
    template: 'Before using [SYSTEM]:\n[OLD STRUGGLE]\n\nAfter using [SYSTEM]:\n[NEW RESULT]\n\nThe difference was not working harder. It was [KEY SHIFT].',
    example: 'Before using The Quiet Sales Engine:\nSpending 4 hours filming TikToks that brought zero buying inquiries.\n\nAfter using The Quiet Sales Engine:\nPosting one 50-word text post on WhatsApp status and closing 3 orders in the DMs.\n\nThe difference was not working harder. It was shifting from entertaining strangers to solving problems.',
    noCameraImageIdea: 'Before and After text comparison slide.'
  },
  {
    day: 14,
    week: 2,
    type: 'review',
    typeName: 'Mid-Month Review',
    tagCode: 'R',
    lightTrackAction: 'SAME',
    template: 'Week 2 Checkpoint:\n\nPosts: [NUM] | Replies: [NUM] | DMs: [NUM] | Orders: [NUM]\n\nThe biggest takeaway: consistency in the DMs pays faster than viral feed reach.\n\nWhat was your biggest lesson this week?',
    example: 'Week 2 Checkpoint:\n\nPosts: 5 | Replies: 28 | DMs: 11 | Orders: 4\n\nThe biggest takeaway: consistency in the DMs pays faster than viral feed reach.\n\nWhat was your biggest lesson this week?',
    noCameraImageIdea: 'Weekly tracker table snippet.'
  },

  // WEEKS 3 & 4 (DAYS 15 - 30)
  {
    day: 15, week: 3, type: 'pitfall', typeName: 'The Perfectionism Trap', tagCode: 'P', lightTrackAction: 'POST',
    template: 'Perfectionism is just fear in a suit.\n\nI delayed launching [PRODUCT] for [MONTHS] because [EXCUSE].\n\nWhen I finally shipped it, nobody cared about the tiny flaws—they only cared that it solved their problem.\n\nShip the v1 today.',
    example: 'Perfectionism is just fear in a suit.\n\nI delayed launching my first template for 2 months because I thought the colors weren\'t perfect.\n\nWhen I finally shipped it, buyers loved it and didn\'t care about the colors. Ship the v1 today.',
    noCameraImageIdea: 'Sticky note on laptop: "Done is better than perfect."'
  },
  {
    day: 16, week: 3, type: 'question', typeName: 'Tool Preference Question', tagCode: 'Q', lightTrackAction: 'REPLIES',
    template: 'What tool can you not run your business without?\n\n1. [TOOL 1]\n2. [TOOL 2]\n3. [TOOL 3]\n\nDrop your #1 below. Looking for hidden gems.',
    example: 'What tool can you not run your digital business without?\n\n1. WhatsApp Business\n2. Notion\n3. Google Sheets\n\nDrop your #1 below. Looking for hidden gems.',
    noCameraImageIdea: 'Solid black background with neon tool names.'
  },
  {
    day: 17, week: 3, type: 'process', typeName: 'Daily Checklist Breakdown', tagCode: 'W', lightTrackAction: 'POST',
    template: 'My exact 25-minute morning routine as a digital seller:\n\n• 5 mins: Check DMs and WhatsApp orders\n• 5 mins: Publish 1 conversational text post\n• 15 mins: Complete focused reply block\n\nThat\'s it. Done for the day.',
    example: 'My exact 25-minute morning routine as a digital seller:\n\n• 5 mins: Check DMs and WhatsApp orders\n• 5 mins: Publish 1 conversational text post\n• 15 mins: Complete focused reply block\n\nThat\'s it. Done for the day.',
    noCameraImageIdea: 'Clean digital clock graphic showing 25:00.'
  },
  {
    day: 18, week: 3, type: 'opinion', typeName: 'Audience Size Truth', tagCode: 'O', lightTrackAction: 'OFF',
    template: 'You do not need 50,000 followers to make [INCOME GOAL].\n\nYou need 100 people who trust your advice, an offer that solves a real headache, and a frictionless way for them to pay you.',
    example: 'You do not need 50,000 followers to make TSh 2,500,000 a month.\n\nYou need 100 people who trust your advice, an offer that solves a real headache, and a frictionless way for them to pay you.',
    noCameraImageIdea: 'Math graphic: 100 buyers × TSh 25,000 = TSh 2,500,000.'
  },
  {
    day: 19, week: 3, type: 'ask', typeName: 'Weekend Access Offer', tagCode: 'A', lightTrackAction: 'POST',
    template: 'Weekend Special:\n\nIf you want to spend your weekend learning how to build and sell digital products without filming reels, grab [PRODUCT NAME] today.\n\nInstant unlock for [PRICE]. Link in bio or message "[WORD]".',
    example: 'Weekend Special:\n\nIf you want to spend your weekend learning how to build and sell digital products without filming reels, grab THE QUIET SALES ENGINE today.\n\nInstant unlock for TSh 25,000 ($10). Link in bio or message "WEEKEND".',
    noCameraImageIdea: 'Weekend special badge mockup.'
  },
  {
    day: 20, week: 3, type: 'followup', typeName: 'Case Study Snippet', tagCode: 'F', lightTrackAction: 'REPLIES',
    template: 'Real case study:\n\nHow [STUDENT / USER] went from [STARTING POINT] to [WINNING RESULT] in 14 days by applying [CORE LESSON].',
    example: 'Real case study:\n\nHow a freelance accountant went from 0 inquiries to 4 paid consulting bookings in 14 days by switching from boring announcements to low-friction questions on WhatsApp.',
    noCameraImageIdea: 'Case study card with bulleted wins.'
  },
  {
    day: 21, week: 3, type: 'review', typeName: 'Week 3 Scorecard', tagCode: 'R', lightTrackAction: 'SAME',
    template: 'Week 3 is in the books.\n\nLessons learned: consistency compounds. Days that felt quiet on the feed turned into sales in the DMs 48 hours later.',
    example: 'Week 3 is in the books.\n\nLessons learned: consistency compounds. Days that felt quiet on the feed turned into sales in the DMs 48 hours later.',
    noCameraImageIdea: 'Week 3 review summary table.'
  },

  // FINAL STRETCH: DAYS 22 - 30
  {
    day: 22, week: 4, type: 'pitfall', typeName: 'The Shiny Object Trap', tagCode: 'P', lightTrackAction: 'POST',
    template: 'Stop buying new software tools when you haven\'t mastered the fundamentals.\n\nA simple text post, a Google Doc or PDF, and a WhatsApp number can generate your first [INCOME TARGET]. Keep it simple.',
    example: 'Stop buying new software tools when you haven\'t mastered the fundamentals.\n\nA simple text post, a clean guide, and a WhatsApp number can generate your first TSh 1,000,000. Keep it simple.',
    noCameraImageIdea: 'Simplicity checklist graphic.'
  },
  {
    day: 23, week: 4, type: 'question', typeName: 'Goals Check-In', tagCode: 'Q', lightTrackAction: 'REPLIES',
    template: 'What is one digital product you have been wanting to launch this year?\n\nDrop it below. I\'ll give you one free pricing and positioning tip for it.',
    example: 'What is one digital product you have been wanting to launch this year?\n\nDrop it below. I\'ll give you one free pricing and positioning tip for it.',
    noCameraImageIdea: 'Clean question graphic with neon accent.'
  },
  {
    day: 24, week: 4, type: 'process', typeName: 'Delivery Automation Proof', tagCode: 'W', lightTrackAction: 'POST',
    template: 'How customer delivery works when you sell digital products:\n\n1. Buyer sends M-Pesa\n2. Automated link delivered via WhatsApp\n3. Instant unlock with permanent access\n\nZero manual email attachments.',
    example: 'How customer delivery works when you sell digital products:\n\n1. Buyer sends M-Pesa\n2. Automated link delivered via WhatsApp\n3. Instant unlock with permanent access\n\nZero manual email attachments.',
    noCameraImageIdea: 'Diagram showing 3-step delivery flow.'
  },
  {
    day: 25, week: 4, type: 'opinion', typeName: 'The Real Meaning of Freedom', tagCode: 'O', lightTrackAction: 'OFF',
    template: 'Financial freedom isn\'t about private jets. It is having digital products selling while you sleep, giving you time to spend with your family and zero debt.',
    example: 'Financial freedom isn\'t about private jets. It is having digital products selling while you sleep, giving you time to spend with your family and zero debt.',
    noCameraImageIdea: 'Inspirational quote slide.'
  },
  {
    day: 26, week: 4, type: 'ask', typeName: 'The Final Month-End Ask', tagCode: 'A', lightTrackAction: 'POST',
    template: 'Ready to stop scrolling and start selling?\n\nGet [PRODUCT NAME] today:\n• 8 Complete Playbook Chapters\n• 30-Day Plug-and-Play Matrix\n• 3 Interactive Software Toolkits\n\nOnly [PRICE]. Message me "[WORD]" to begin.',
    example: 'Ready to stop scrolling and start selling?\n\nGet THE QUIET SALES ENGINE today:\n• 8 Complete Playbook Chapters\n• 45-Day Multi-Platform Matrix\n• 4 Interactive Software Toolkits\n\nOnly TSh 25,000 ($10). Message me "ACCESS" to begin.',
    noCameraImageIdea: 'Final offer badge graphic.'
  },
  {
    day: 27, week: 4, type: 'followup', typeName: 'Customer FAQ Answer', tagCode: 'F', lightTrackAction: 'REPLIES',
    template: 'Top question we get asked: "Can this work if I have zero followers?"\n\nAnswer: Yes. You don\'t rely on an existing audience; you use the 15-minute reply block to build relationships with strangers every day.',
    example: 'Top question we get asked: "Can this work if I have zero followers?"\n\nAnswer: Yes. You don\'t rely on an existing audience; you use the 15-minute reply block to build relationships with strangers every day.',
    noCameraImageIdea: 'FAQ card with question and answer.'
  },
  {
    day: 28, week: 4, type: 'process', typeName: 'The 4-Number Sunday Audit', tagCode: 'W', lightTrackAction: 'POST',
    template: 'How to audit your business in 10 minutes every Sunday:\n\n1. Count your total posts\n2. Count your meaningful replies\n3. Count your direct message convos\n4. Count your direct asks\n\nThe numbers never lie.',
    example: 'How to audit your business in 10 minutes every Sunday:\n\n1. Count your total posts\n2. Count your meaningful replies\n3. Count your direct message convos\n4. Count your direct asks\n\nThe numbers never lie.',
    noCameraImageIdea: 'Audit scorecard graphic.'
  },
  {
    day: 29, week: 4, type: 'opinion', typeName: 'Looking Ahead', tagCode: 'O', lightTrackAction: 'OFF',
    template: 'The next 30 days are going to pass anyway. You can either spend them consuming other people\'s content, or building an income-producing digital asset for yourself.',
    example: 'The next 30 days are going to pass anyway. You can either spend them consuming other people\'s content, or building an income-producing digital asset for yourself.',
    noCameraImageIdea: 'Calendar graphic showing 30 days.'
  },
  {
    day: 30, week: 4, type: 'review', typeName: 'Day 30 Milestone & Celebration', tagCode: 'R', lightTrackAction: 'POST',
    bestPlatform: 'threads',
    template: 'Day 30 Milestone Complete!\n\n30 days of consistent, high-trust text selling. If you completed this sprint, your confidence and pipeline are completely transformed. Now repeat the cycle next month.',
    example: 'Day 30 Milestone Complete!\n\n30 days of consistent, high-trust text selling. If you completed this sprint, your confidence and pipeline are completely transformed. Now repeat the cycle next month.',
    noCameraImageIdea: 'Trophy / Milestone badge graphic.'
  },
  {
    day: 31, week: 5, type: 'process', typeName: 'Multi-Platform Repurposing', tagCode: 'W', lightTrackAction: 'POST',
    bestPlatform: 'linkedin',
    template: 'How to take 1 text insight and publish it across 3 platforms in 7 minutes:\n\n1. Post as short conversational update on Threads/X\n2. Turn the 3 key points into a text carousel slide on Instagram\n3. Post with professional context on LinkedIn\n\nCreate once, distribute everywhere without filming.',
    example: 'How to take 1 text insight and publish it across 3 platforms in 7 minutes:\n\n1. Post as short conversational update on Threads/X\n2. Turn the 3 key points into a text carousel slide on Instagram\n3. Post with professional context on LinkedIn\n\nCreate once, distribute everywhere without filming.',
    noCameraImageIdea: 'Clean diagram showing 1 post branching into 3 social channels.'
  },
  {
    day: 32, week: 5, type: 'pitfall', typeName: 'The Over-Complication Trap', tagCode: 'P', lightTrackAction: 'REPLIES',
    bestPlatform: 'instagram',
    template: 'Mistake beginners make: spending 3 weeks designing a logo and choosing fancy software before making their first sale.\n\nWhat actually works: a clear Google Sheet or PDF, a direct WhatsApp link, and 1 honest post solving a real problem.',
    example: 'Mistake beginners make: spending 3 weeks designing a logo and choosing fancy software before making their first sale.\n\nWhat actually works: a clear Google Sheet or PDF, a direct WhatsApp link, and 1 honest post solving a real problem.',
    noCameraImageIdea: 'Two-column checklist: "What feels like work" vs "What actually brings sales".'
  },
  {
    day: 33, week: 5, type: 'question', typeName: 'WhatsApp Status Conversation Starter', tagCode: 'Q', lightTrackAction: 'POST',
    bestPlatform: 'whatsapp',
    template: 'Quick question for fellow small business owners and creators: What is the single biggest bottleneck in your business right now?\n\n[A] Finding qualified buyers\n[B] Pricing your offerings\n[C] Consistent daily content\n\nReply directly with your letter.',
    example: 'Quick question for fellow small business owners and creators: What is the single biggest bottleneck in your business right now?\n\n[A] Finding qualified buyers\n[B] Pricing your offerings\n[C] Consistent daily content\n\nReply directly with your letter.',
    noCameraImageIdea: 'High-contrast black-and-yellow poll card for WhatsApp status.'
  },
  {
    day: 34, week: 5, type: 'opinion', typeName: 'Why Quiet Businesses Win', tagCode: 'O', lightTrackAction: 'OFF',
    bestPlatform: 'threads',
    template: 'Unpopular truth: The loudest accounts online rarely have the highest profit margins.\n\nYou do not need viral fame or millions of views to make a great living. A quiet, focused text pipeline that solves specific problems creates sustainable recurring income.',
    example: 'Unpopular truth: The loudest accounts online rarely have the highest profit margins.\n\nYou do not need viral fame or millions of views to make a great living. A quiet, focused text pipeline that solves specific problems creates sustainable recurring income.',
    noCameraImageIdea: 'Minimalist quote card with bold typography on dark background.'
  },
  {
    day: 35, week: 5, type: 'ask', typeName: 'The "Weekend Starter" Weekly Offer', tagCode: 'A', lightTrackAction: 'POST',
    bestPlatform: 'whatsapp',
    template: 'If you want to spend this weekend setting up your first digital product without recording a single reel:\n\nOur full DIGITAL PRODUCT STARTER KIT is available now with the complete playbook, 45-day posting calendar, and plug-and-play DM scripts.\n\nSend me a DM or WhatsApp message with "STARTER" for instant access details.',
    example: 'If you want to spend this weekend setting up your first digital product without recording a single reel:\n\nOur full DIGITAL PRODUCT STARTER KIT is available now with the complete playbook, 45-day posting calendar, and plug-and-play DM scripts.\n\nSend me a DM or WhatsApp message with "STARTER" for instant access details.',
    noCameraImageIdea: 'Clean product mock preview card with clear value bullets.'
  },
  {
    day: 36, week: 6, type: 'followup', typeName: 'The Buyer FAQ Breakdown', tagCode: 'F', lightTrackAction: 'REPLIES',
    bestPlatform: 'threads',
    template: 'Top questions from buyers this week:\n\nQ: "How do I deliver the digital product to my customer after they pay?"\nA: A simple private Google Drive link or WhatsApp document download works seamlessly for 95% of digital buyers.',
    example: 'Top questions from buyers this week:\n\nQ: "How do I deliver the digital product to my customer after they pay?"\nA: A simple private Google Drive link or WhatsApp document download works seamlessly for 95% of digital buyers.',
    noCameraImageIdea: 'Simple Q&A callout card.'
  },
  {
    day: 37, week: 6, type: 'process', typeName: 'The 3-Step WhatsApp Checkout Flow', tagCode: 'W', lightTrackAction: 'POST',
    bestPlatform: 'whatsapp',
    template: 'How to close sales cleanly on WhatsApp without being pushy:\n\nStep 1: Confirm their exact goal.\nStep 2: Share the single best solution and clear payment options (M-Pesa / Tigo Pesa / Card).\nStep 3: Send instant delivery immediately upon receipt.\n\nSimple, transparent, respectful.',
    example: 'How to close sales cleanly on WhatsApp without being pushy:\n\nStep 1: Confirm their exact goal.\nStep 2: Share the single best solution and clear payment options (M-Pesa / Tigo Pesa / Card).\nStep 3: Send instant delivery immediately upon receipt.\n\nSimple, transparent, respectful.',
    noCameraImageIdea: 'Step-by-step chat preview screenshot.'
  },
  {
    day: 38, week: 6, type: 'pitfall', typeName: 'The Discounting Danger', tagCode: 'P', lightTrackAction: 'OFF',
    bestPlatform: 'linkedin',
    template: 'Never discount your digital product out of fear that people will not buy. When you drop your price too low, people perceive low value.\n\nInstead of lowering the price, increase the clarity: explain the exact problem it solves and what painful friction it eliminates.',
    example: 'Never discount your digital product out of fear that people will not buy. When you drop your price too low, people perceive low value.\n\nInstead of lowering the price, increase the clarity: explain the exact problem it solves and what painful friction it eliminates.',
    noCameraImageIdea: 'Text card: "Clarity creates value, not discounts".'
  },
  {
    day: 39, week: 6, type: 'question', typeName: 'Audience Insight Poll', tagCode: 'Q', lightTrackAction: 'REPLIES',
    bestPlatform: 'threads',
    template: 'If you had an extra 5 hours free every week, where would you invest it in your business?\n\n1. Creating a new digital guide\n2. Reaching out to new potential clients\n3. Streamlining your operations and sleep\n\nTell me your pick.',
    example: 'If you had an extra 5 hours free every week, where would you invest it in your business?\n\n1. Creating a new digital guide\n2. Reaching out to new potential clients\n3. Streamlining your operations and sleep\n\nTell me your pick.',
    noCameraImageIdea: 'Interactive choice graphic 1, 2, 3.'
  },
  {
    day: 40, week: 6, type: 'opinion', typeName: 'The Digital Asset Advantage', tagCode: 'O', lightTrackAction: 'POST',
    bestPlatform: 'instagram',
    template: 'Trading hours for money has a strict ceiling. Creating a digital product means you solve a problem once, and sell that exact solution 100 times without shipping costs or inventory.\n\nThat is the fundamental shift of a digital commerce business.',
    example: 'Trading hours for money has a strict ceiling. Creating a digital product means you solve a problem once, and sell that exact solution 100 times without shipping costs or inventory.\n\nThat is the fundamental shift of a digital commerce business.',
    noCameraImageIdea: 'Comparison infographic: Physical Inventory vs Digital Products.'
  },
  {
    day: 41, week: 6, type: 'process', typeName: 'The Objection-Busting Post', tagCode: 'W', lightTrackAction: 'REPLIES',
    bestPlatform: 'threads',
    template: '"I do not have time to create a 100-page book."\n\nGood. Your buyers do not have time to read a 100-page book either. A 5-page checklist or a clear 1-page template that solves their exact friction in 10 minutes is worth far more to a busy person.',
    example: '"I do not have time to create a 100-page book."\n\nGood. Your buyers do not have time to read a 100-page book either. A 5-page checklist or a clear 1-page template that solves their exact friction in 10 minutes is worth far more to a busy person.',
    noCameraImageIdea: 'Checklist graphic comparing bloated manuals vs fast sprint tools.'
  },
  {
    day: 42, week: 6, type: 'ask', typeName: 'The Monthly Recap & Direct Offer', tagCode: 'A', lightTrackAction: 'POST',
    bestPlatform: 'linkedin',
    template: 'Heading into the new month: If your goal is to build an independent digital revenue stream without dancing on video, our complete QUIET SALES ENGINE provides the exact 8-chapter curriculum and daily playbooks.\n\nTap the link in bio or DM "GUIDE" to get started.',
    example: 'Heading into the new month: If your goal is to build an independent digital revenue stream without dancing on video, our complete QUIET SALES ENGINE provides the exact 8-chapter curriculum and daily playbooks.\n\nTap the link in bio or DM "GUIDE" to get started.',
    noCameraImageIdea: 'Product bundle display with phone & tablet mockups.'
  },
  {
    day: 43, week: 7, type: 'followup', typeName: 'The Client Breakthrough Spotlight', tagCode: 'F', lightTrackAction: 'REPLIES',
    bestPlatform: 'whatsapp',
    template: 'A great message from a beginner entrepreneur this week: "I used your Day 5 pitch template and closed my first consulting booking this morning without feeling salesy."\n\nSystems beat guesswork every single time.',
    example: 'A great message from a beginner entrepreneur this week: "I used your Day 5 pitch template and closed my first consulting booking this morning without feeling salesy."\n\nSystems beat guesswork every single time.',
    noCameraImageIdea: 'Clean testimonial quote card with verified check badge.'
  },
  {
    day: 44, week: 7, type: 'opinion', typeName: 'The Compounding Rule', tagCode: 'O', lightTrackAction: 'OFF',
    bestPlatform: 'threads',
    template: 'Social media sales do not happen in 24 hours. They compound quietly over weeks of showing up, leaving smart replies, and maintaining clear positioning.\n\nTrust the system, keep the daily discipline, and let momentum do the heavy lifting.',
    example: 'Social media sales do not happen in 24 hours. They compound quietly over weeks of showing up, leaving smart replies, and maintaining clear positioning.\n\nTrust the system, keep the daily discipline, and let momentum do the heavy lifting.',
    noCameraImageIdea: 'Geometric upward compounding curve diagram.'
  },
  {
    day: 45, week: 7, type: 'review', typeName: 'The 45-Day Mastery Milestone', tagCode: 'R', lightTrackAction: 'POST',
    bestPlatform: 'all',
    template: '45-Day Mastery Milestone Complete!\n\nYou have built an operational habit of clarity, genuine conversation, and consistent commercial offers. You now own a digital distribution engine that you control completely.\n\nKeep iterating, keep serving, and keep building your assets.',
    example: '45-Day Mastery Milestone Complete!\n\nYou have built an operational habit of clarity, genuine conversation, and consistent commercial offers. You now own a digital distribution engine that you control completely.\n\nKeep iterating, keep serving, and keep building your assets.',
    noCameraImageIdea: 'Official 45-Day Mastery Certificate & Milestone graphic.'
  }
];

// Alias for backwards compatibility
export const DAY_PROMPTS = BIASHARA_30_DAY_PLAN;

export const PROMPT_BANK_EXTRAS = [
  {
    id: 'extra_01',
    category: 'Hard Truth',
    prompt: 'The reason most digital products don\'t sell has nothing to do with price. It is because the creator didn\'t make the customer feel understood in the first 3 lines of copy.',
    whyItWorks: 'Positions you as an experienced operator and sparks immediate agreement.'
  },
  {
    id: 'extra_02',
    category: 'Zero-Cost Tool',
    prompt: 'You do not need a $100/mo email software to start. A free Google Sheet, a clean PDF, and WhatsApp Business will easily take you to your first 50 sales.',
    whyItWorks: 'Removes financial intimidation for beginners.'
  },
  {
    id: 'extra_03',
    category: 'Question Hook',
    prompt: 'If you had an extra 2 hours free every single day, what is the #1 project you would build for your business?',
    whyItWorks: 'Generates high comment volume and reveals real audience aspirations.'
  },
  {
    id: 'extra_04',
    category: 'Process Proof',
    prompt: 'How we draft a high-converting digital guide in 3 days: Day 1: Outline the 5 pain points. Day 2: Write the exact solutions and templates. Day 3: Format and launch.',
    whyItWorks: 'Demystifies product creation and proves competence.'
  },
  {
    id: 'extra_05',
    category: 'Direct Offer',
    prompt: 'Ready to stop guessing on social media? THE QUIET SALES ENGINE gives you 8 actionable chapters, 45 days of plug-and-play prompts, and 4 software tools. Tap bio for instant access.',
    whyItWorks: 'Clear, direct, and zero-fluff invitation to purchase.'
  },
  {
    id: 'extra_06',
    category: 'Pitfall Story',
    prompt: 'Early on, I thought "professional" meant using big complicated words. Sales exploded only when I started writing like I talk to a friend over coffee.',
    whyItWorks: 'Relatable lesson on copywriting clarity.'
  },
  {
    id: 'extra_07',
    category: 'Contrarian',
    prompt: 'Followers are vanity, replies are sanity, and DMs are reality. Stop obsessing over followers and start counting your direct conversations.',
    whyItWorks: 'Memorable aphorism that challenges vanity metrics.'
  },
  {
    id: 'extra_08',
    category: 'Interactive Poll',
    prompt: 'Which would help you more right now: [A] A step-by-step 30-day posting calendar, or [B] A 1-click WhatsApp customer reply template pack? Tell me below.',
    whyItWorks: 'Directly validates future product demand in comments.'
  },
  {
    id: 'extra_09',
    category: 'Behind-The-Scenes',
    prompt: 'Here is the exact unglamorous desk setup where we run BiasharaBase: laptop, notebook, coffee. You don\'t need a movie studio to build wealth.',
    whyItWorks: 'Grounds your brand in authentic reality.'
  },
  {
    id: 'extra_10',
    category: 'Client Win',
    prompt: 'Huge shoutout to one of our readers who just closed their first 3 template sales on WhatsApp using Day 1\'s framework! Execution is everything.',
    whyItWorks: 'Provides social proof without making unrealistic promises.'
  },
  {
    id: 'extra_11',
    category: 'Time Management',
    prompt: 'Set a 15-minute timer before opening your social media app. When the timer rings, close it. Watch your productivity double this week.',
    whyItWorks: 'Actionable productivity hack that followers appreciate.'
  },
  {
    id: 'extra_12',
    category: 'The Reality Check',
    prompt: 'No course or software can save you if you refuse to talk to your customers. Business is human-to-human, even on the internet.',
    whyItWorks: 'High-integrity advice that builds deep respect.'
  },
  {
    id: 'extra_13',
    category: 'Weekend Routine',
    prompt: 'Spend 45 minutes this Sunday writing your 3 core posts for the week. Your Monday morning self will thank you immensely.',
    whyItWorks: 'Practical advice that encourages batching.'
  },
  {
    id: 'extra_14',
    category: 'Offer Reminder',
    prompt: 'Reminder: THE QUIET SALES ENGINE is available for instant unlock. No video editing, no camera required. TSh 25,000 ($10) lifetime access. Link in bio.',
    whyItWorks: 'Short, clean commercial reminder.'
  },
  {
    id: 'extra_15',
    category: 'Sunday Accountability',
    prompt: 'Sunday audit time: How many posts did you publish, how many people did you reply to, and how many times did you ask for the sale this week?',
    whyItWorks: 'Encourages weekly operational accountability.'
  }
];

export const INITIAL_METRIC_ROWS: WeeklyMetricRow[] = [
  { week: 1, posts: 4, replies: 32, convos: 8, asks: 2, sales: 1, oneThingToChange: 'Leave more replies on peer accounts in my lane' },
  { week: 2, posts: 5, replies: 45, convos: 14, asks: 4, sales: 2, oneThingToChange: 'Make my weekly ask clearer and test WhatsApp link' },
  { week: 3, posts: 4, replies: 50, convos: 19, asks: 5, sales: 3, oneThingToChange: 'Follow up within 24 hours when buyers ask for details' },
  { week: 4, posts: 5, replies: 60, convos: 25, asks: 7, sales: 5, oneThingToChange: 'Double down on the 3-slide WhatsApp status format' }
];

export const STARTER_PRODUCT_NICHES: StarterProductNiche[] = [
  {
    id: 'niche_01',
    title: 'Freelancer Client Proposal & Retainer Agreement Pack',
    category: 'templates',
    categoryLabel: 'Document Template',
    targetBuyer: 'Graphic designers, copywriters, web developers, social media managers',
    problemSolved: 'Losing clients or getting underpaid due to unprofessional verbal agreements and vague scopes.',
    deliveryFormat: 'Google Docs / Notion Link + Exportable PDF',
    suggestedPriceTZS: 25000,
    suggestedPriceUSD: 10,
    creationTimeHours: '3 hours',
    whatToInclude: [
      '1-Page Clean Scope-of-Work Project Proposal template',
      'Simple Payment Terms & Milestone Invoice breakdown',
      'Client Onboarding Questionnaire (Google Form or Doc)',
      'WhatsApp Kickoff Message template'
    ],
    samplePitchHook: 'Freelancers: Stop pitching clients in messy WhatsApp voice notes. Here is the exact 1-page proposal pack that locks in 50% deposits before you start work.'
  },
  {
    id: 'niche_02',
    title: 'Personal Budget & 50/30/20 Savings Tracker',
    category: 'trackers',
    categoryLabel: 'Spreadsheet Tracker',
    targetBuyer: 'Young professionals, salary earners, remote workers',
    problemSolved: 'Money running out before the 20th of the month with zero idea where salary vanished.',
    deliveryFormat: 'Google Sheets (Automated formulas) + 2-min setup video walkthrough',
    suggestedPriceTZS: 15000,
    suggestedPriceUSD: 7,
    creationTimeHours: '2 hours',
    whatToInclude: [
      'Automated Monthly Income & Expense breakdown tabs',
      'Color-coded category buckets (Needs, Wants, Emergency Fund)',
      'Visual progress bar toward savings milestones',
      'Mobile-optimized view for quick daily data entry on phone'
    ],
    samplePitchHook: 'If you earn a decent salary but have zero savings at the end of every month, this simple Google Sheet tracks every shilling in under 60 seconds a day.'
  },
  {
    id: 'niche_03',
    title: 'WhatsApp Micro-Course: "High-Ticket Freelance Pitching"',
    category: 'guides',
    categoryLabel: 'Micro-Course',
    targetBuyer: 'Freelance copywriters, web developers, graphic designers, virtual assistants',
    problemSolved: 'Getting ghosted after sending quotes or having clients demand 80% discounts.',
    deliveryFormat: '5 Audio Lessons + PDF Cheatsheet delivered inside private WhatsApp Group/Chat',
    suggestedPriceTZS: 30000,
    suggestedPriceUSD: 12,
    creationTimeHours: '4 hours',
    whatToInclude: [
      'Lesson 1: Optimizing WhatsApp Business Catalog & Labels',
      'Lesson 2: The 3-Slide WhatsApp Status Story Framework',
      'Lesson 3: Converting Inquiries into Same-Day Orders',
      'Lesson 4: Re-activating Past Customers with a Polite Check-in',
      'Lesson 5: Printable Local Referral Card template'
    ],
    samplePitchHook: 'Freelancers: Stop pitching clients in messy WhatsApp voice notes. This 5-lesson micro-course shows you how to close 50% deposits before starting any project.'
  },
  {
    id: 'niche_04',
    title: 'Content Creator 90-Day Text-Only Idea Vault',
    category: 'templates',
    categoryLabel: 'Content Vault',
    targetBuyer: 'Busy founders, solopreneurs, educators, consultants',
    problemSolved: 'Staring at a blank screen for 45 minutes every morning wondering what to post.',
    deliveryFormat: 'Notion Database / Google Sheet with copyable templates',
    suggestedPriceTZS: 25000,
    suggestedPriceUSD: 10,
    creationTimeHours: '3 hours',
    whatToInclude: [
      '90 Plug-and-play hook formulas categorized by goal',
      '25 Contrarian opinion templates that drive thoughtful debate',
      '20 Step-by-step process breakdown blueprints',
      '15 Direct weekly offer formulas that convert without being spammy'
    ],
    samplePitchHook: 'Never stare at a blank screen again. 90 proven text post frameworks for Threads, LinkedIn, and Instagram Carousels that you can customize in 5 minutes flat.'
  },
  {
    id: 'niche_05',
    title: 'Notion Solopreneur OS & Client Project Tracker',
    category: 'trackers',
    categoryLabel: 'Notion / Spreadsheet System',
    targetBuyer: 'Digital creators, freelance designers, web developers, consultants',
    problemSolved: 'Disorganized client files, missed project deadlines, and unpaid milestone invoices.',
    deliveryFormat: 'Notion Template Link (1-click duplicate) + Setup Walkthrough',
    suggestedPriceTZS: 25000,
    suggestedPriceUSD: 10,
    creationTimeHours: '3 hours',
    whatToInclude: [
      'Client CRM with milestone payment statuses',
      'Project Delivery Kanban board',
      'Invoice & Receipt generation tracker',
      'Meeting Notes & Briefing questionnaire'
    ],
    samplePitchHook: 'Freelancers & solopreneurs: Stop tracking client projects in WhatsApp chats and notes. This 1-page Notion OS organizes every client, invoice, and deadline in 60 seconds.'
  },
  {
    id: 'niche_06',
    title: 'Digital Marketing Agency Client Onboarding & Retainer Dashboard',
    category: 'trackers',
    categoryLabel: 'Client Management Dashboard',
    targetBuyer: 'Social media managers, media buyers, SEO specialists, virtual assistants',
    problemSolved: 'Scope creep, client micromanagement, and endless revision demands.',
    deliveryFormat: 'Google Sheets / Notion Template + Welcome Email Scripts',
    suggestedPriceTZS: 30000,
    suggestedPriceUSD: 12,
    creationTimeHours: '3 hours',
    whatToInclude: [
      'Client Asset & Password intake checklist',
      'Monthly Deliverables & Milestone tracking tab',
      'Weekly Client KPI Reporting template',
      'Scope Boundary & Revision Limit agreement'
    ],
    samplePitchHook: 'Agencies & freelancers: Stop letting clients text you at midnight asking for endless revisions. This onboarding dashboard locks in boundaries and weekly KPIs.'
  },
  {
    id: 'niche_07',
    title: 'The 1-Hour Digital Product Launch Checklist',
    category: 'guides',
    categoryLabel: 'Action Checklist',
    targetBuyer: 'First-time digital sellers, coaches, students, side-hustlers',
    problemSolved: 'Overwhelmed by tech tools, hosting platforms, and complex payment gateways.',
    deliveryFormat: 'Clean 6-Page Action PDF + Notion checklist',
    suggestedPriceTZS: 15000,
    suggestedPriceUSD: 6,
    creationTimeHours: '2 hours',
    whatToInclude: [
      '15-Minute Product Package setup (PDF or Drive link)',
      '10-Minute WhatsApp Link & Payment details configuration',
      '20-Minute Bio & Positioning rewrite',
      '15-Minute Launch Announcement post template'
    ],
    samplePitchHook: 'You don\'t need 3 months to launch a digital product. Follow this step-by-step 1-hour checklist to package your knowledge and open for orders tonight.'
  },
  {
    id: 'niche_08',
    title: 'Solopreneur 1-on-1 Strategy Sprint Retainer Template',
    category: 'services',
    categoryLabel: 'Service Retainer Blueprint',
    targetBuyer: 'Consultants, marketing advisors, business coaches, accountants',
    problemSolved: 'Selling low-priced single hours instead of high-value packaged monthly advisory retainers.',
    deliveryFormat: 'Google Docs Package + Intake Form + Agreement Template',
    suggestedPriceTZS: 50000,
    suggestedPriceUSD: 20,
    creationTimeHours: '4 hours',
    whatToInclude: [
      'Monthly Advisory Scope & Boundaries document',
      'Client Pre-Call Audit Questionnaire',
      'Action Item & Meeting Summary template',
      'Pricing & Retainer Renewal proposal template'
    ],
    samplePitchHook: 'Consultants: Stop trading $20 hours. Package your expertise into a 4-week advisory sprint that clients gladly pay premium retainers for.'
  },
  {
    id: 'niche_09',
    title: 'Digital E-Book & Notion Template Fast-Launch Blueprint',
    category: 'guides',
    categoryLabel: 'Digital Creator Guide',
    targetBuyer: 'Writers, digital educators, coaches, and knowledge creators',
    problemSolved: 'Overwhelmed by complex tech, spending 6 months writing without selling anything.',
    deliveryFormat: 'Clean 8-Page Action PDF + Notion Workbook',
    suggestedPriceTZS: 20000,
    suggestedPriceUSD: 8,
    creationTimeHours: '2.5 hours',
    whatToInclude: [
      'The 48-Hour Weekend Curriculum Outline formula',
      'Digital PDF Export & Google Drive delivery guide',
      'Social Media Teaser & Hook formulas',
      'Zero-Code Mobile Money & Card Payment setup'
    ],
    samplePitchHook: 'You don\'t need 6 months to publish an e-book. Use this 48-hour blueprint to package your expertise into a high-value guide and start selling this weekend.'
  },
  {
    id: 'niche_10',
    title: 'Remote Job Application & CV Rewrite Toolkit',
    category: 'templates',
    categoryLabel: 'Career Toolkit',
    targetBuyer: 'Job seekers, remote workers, university graduates',
    problemSolved: 'Sending 50 CVs and getting zero interview callbacks from international or remote companies.',
    deliveryFormat: 'Google Docs ATS-friendly CV templates + Cold Outreach script pack',
    suggestedPriceTZS: 25000,
    suggestedPriceUSD: 10,
    creationTimeHours: '3 hours',
    whatToInclude: [
      '2 Clean ATS-friendly Resume / CV Google Doc templates',
      'Modern 1-Page Cover Letter framework',
      'LinkedIn Profile Optimization Checklist',
      '5 Direct LinkedIn Messages to hiring managers that actually get answered'
    ],
    samplePitchHook: 'Stop getting ghosted by remote employers. These 2 ATS-compliant resume templates and outreach messages put you directly into the interview round.'
  },
  {
    id: 'niche_11',
    title: 'Small Business Daily Cash Flow & Petty Cash Voucher Sheet',
    category: 'trackers',
    categoryLabel: 'Accounting Template',
    targetBuyer: 'Retail shops, cafes, kiosks, mini-supermarkets, pharmacy owners',
    problemSolved: 'Daily cash leaks, missing receipts, and untracked small expenses eating all profits.',
    deliveryFormat: 'Google Sheets / Excel + Printable Daily Till Balancing Slips',
    suggestedPriceTZS: 20000,
    suggestedPriceUSD: 8,
    creationTimeHours: '2 hours',
    whatToInclude: [
      'Daily Cash In vs Cash Out Till Balancing tab',
      'Petty Cash Expense categorization & voucher log',
      'Weekly Profit Summary & Bank Deposit reconciliation',
      'Printable A5 Petty Cash Slip for employees'
    ],
    samplePitchHook: 'Where does your shop\'s cash disappear every evening? This automated daily cash-flow tracker records every penny and balances your till in 5 minutes flat.'
  },
  {
    id: 'niche_12',
    title: 'Real Estate & Rental Property Tenancy Agreement & Rent Tracker',
    category: 'templates',
    categoryLabel: 'Legal & Property Template',
    targetBuyer: 'Landlords, property managers, apartment owners, Airbnb hosts',
    problemSolved: 'Tenants delaying rent, damaged property disputes, and unrecorded maintenance costs.',
    deliveryFormat: 'Editable Word / Google Doc Agreement + Automated Rent Payment Ledger',
    suggestedPriceTZS: 35000,
    suggestedPriceUSD: 15,
    creationTimeHours: '3.5 hours',
    whatToInclude: [
      'Standard Residential Tenancy Agreement with tenant obligations',
      'Move-in & Move-out Condition Inspection Checklist',
      'Automated Rent Ledger (tracks payments, balances, and arrears)',
      'Polite Rent Due Reminder message for WhatsApp'
    ],
    samplePitchHook: 'Landlords: Protect your property investment. Get a legally sound tenancy agreement and automated rent collection tracker that eliminates tenant disputes.'
  }
];

export const DM_SWIPE_FILES: DMSwipeScript[] = [
  {
    id: 'swipe_01',
    title: 'When They Ask: "How do I pay with M-Pesa / Tigo Pesa?"',
    category: 'closing',
    triggerScenario: 'Buyer is interested and asks for local mobile money payment instructions.',
    script: 'Hi [Name]! To get instant access to the digital starter kit:\n\n1. Send [Amount, e.g. TSh 25,000] via M-Pesa to Lipa Namba: [Your Till/Phone Number] (Name: [Your Business Name]).\n2. Once sent, reply here with your M-Pesa confirmation code or a screenshot.\n3. I will immediately send you your personal access key and direct download link.\n\nLet me know if you need any assistance!',
    proTip: 'Always state the recipient name clearly so the buyer feels 100% secure before hitting send on their mobile money app.'
  },
  {
    id: 'swipe_02',
    title: 'When They Ask: "Is this suitable for a complete beginner?"',
    category: 'objection',
    triggerScenario: 'Buyer has never made or sold a digital product before and doubts their ability.',
    script: 'Great question [Name]! Yes, it was specifically engineered for beginners. You do not need any coding, video editing, or paid ads experience.\n\nThe kit walks you through choosing your first 1-page template, setting up your WhatsApp Business link, and using our 45-day fill-in-the-blank text prompts.\n\nMost readers set up their first offer within 48 hours of reading.',
    proTip: 'Validate their hesitation immediately, then point to the structured daily templates that eliminate guesswork.'
  },
  {
    id: 'swipe_03',
    title: 'When They Ask: "Do I need to show my face or record videos?"',
    category: 'objection',
    triggerScenario: 'Buyer is camera-shy or wants privacy.',
    script: 'Not at all! In fact, the entire system is built specifically around ZERO video and ZERO dancing on camera.\n\nYou sell using clear text insights, simple screenshots of your spreadsheets or templates, and respectful direct messages on WhatsApp and Threads.\n\nClarity and problem-solving beat video hype every single time.',
    proTip: 'Emphasize that serious buyers looking for professional templates care about clear answers, not video theatrics.'
  },
  {
    id: 'swipe_04',
    title: 'When They Ask: "How will I receive the files?"',
    category: 'dm',
    triggerScenario: 'Buyer wants to understand the exact delivery format.',
    script: 'Immediately upon payment confirmation, you receive:\n\n1. Instant digital unlock code for the web application & interactive toolkits.\n2. Direct Google Drive & WhatsApp file links to your templates and swipe files.\n3. Printable PDF version for offline reading and paper printing.\n\nYou get lifetime access and can open everything directly on your phone or computer.',
    proTip: 'Highlight that they can access everything on mobile without requiring a laptop.'
  },
  {
    id: 'swipe_05',
    title: 'When They Ask: "What if I have zero followers right now?"',
    category: 'objection',
    triggerScenario: 'Buyer believes you need 10,000 followers to make money online.',
    script: 'That is actually the biggest myth in digital commerce!\n\nBroadcasting to empty rooms does not work. That is why Chapter 1 teaches the "Reply Multiplier": you leave 15 minutes of thoughtful insights under existing active discussions in your niche.\n\nThat brings targeted people directly to your profile bio, where your weekly offer is waiting.',
    proTip: 'Shift their focus from passive waiting to proactive, respectful daily networking.'
  },
  {
    id: 'swipe_06',
    title: 'The 24-Hour Gentle Follow-Up',
    category: 'followup',
    triggerScenario: 'Buyer asked for payment details yesterday but didn\'t complete checkout.',
    script: 'Hey [Name]! Just checking in to see if you had any questions about setting up your digital product with the starter kit?\n\nIf you\'re ready to get started today, let me know and I\'ll issue your access key right away. No pressure at all!',
    proTip: 'Always end with "No pressure at all"—it removes sales tension and often prompts an immediate reply.'
  },
  {
    id: 'swipe_07',
    title: 'When They Ask: "Can I preview a sample first?"',
    category: 'dm',
    triggerScenario: 'Buyer wants proof of quality before committing.',
    script: 'Absolutely! Transparency is our priority. You can read the complete Chapter 1 sample for free on our website: [Insert Link].\n\nTake 4 minutes to read it tonight, and if the framework makes sense for your business, you can unlock the full 45-day system whenever you\'re ready.',
    proTip: 'Offering the sample freely builds immense trust and demonstrates supreme confidence in your product.'
  },
  {
    id: 'swipe_08',
    title: 'The Weekend Action Call',
    category: 'closing',
    triggerScenario: 'Engaging leads on Friday or Saturday looking for a productive weekend project.',
    script: 'Hey [Name]! Are you planning to work on your digital product project this weekend?\n\nIf you want to have your template, pricing, and first offer ready to post by Sunday night, grab the starter kit today and follow the 7-day sprint itinerary. You\'ll be amazed at what gets done in 48 hours.',
    proTip: 'Position the weekend as a dedicated sprint window where they can make concrete progress.'
  },
  {
    id: 'swipe_09',
    title: 'When They Say: "The price is a bit high for me right now"',
    category: 'objection',
    triggerScenario: 'Price resistance or budget constraints.',
    script: 'I completely understand [Name]! We intentionally priced this at [TSh 25,000 / $10] so that closing just 1 single template sale or service client pays back 100% of your investment.\n\nYou\'re not buying reading material; you\'re acquiring an asset that generates revenue every month. Take your time, and when you\'re ready, we\'re here for you.',
    proTip: 'Frame the price in terms of return on investment (ROI): 1 customer sale recoups the entire cost.'
  },
  {
    id: 'swipe_10',
    title: 'Post-Purchase Delivery & Onboarding Message',
    category: 'closing',
    triggerScenario: 'Immediately after the buyer completes payment.',
    script: 'Welcome [Name]! Your payment of [Amount] has been verified.\n\nHere are your access credentials:\n🔑 Personal Access Key: [LICENSE_KEY]\n🔗 App Access URL: [URL]?code=[LICENSE_KEY]\n\nRecommended first step: Spend 25 minutes reading Chapter 1 & 2 tonight. Then open the "Starter Niches" tab and pick your product concept.\n\nI am right here if you have any questions along the way. Let\'s build your business!',
    proTip: 'Give them ONE clear immediate action step so they do not feel overwhelmed after purchasing.'
  }
];

export const LAUNCH_SPRINT_DAYS: LaunchSprintDay[] = [
  {
    day: 1,
    title: 'Select Your Niche & Define Your Single-Sentence Promise',
    focus: 'Clarity & Positioning',
    estimatedTime: '45 minutes',
    checklist: [
      'Browse the 12 Ready-to-Launch Niches and pick ONE that matches your skills',
      'Use the Chapter 2 T3 formula: I help [WHO] achieve [WIN] without [OBSTACLE]',
      'Confirm your target price (e.g., TSh 15,000 to TSh 35,000 / $7 to $15)',
      'Write down the single painful problem your product eliminates'
    ],
    keyDeliverable: 'Your single-sentence bio hook and selected product concept.'
  },
  {
    day: 2,
    title: 'Assemble Your 1-Page Digital Asset (Keep It Fast)',
    focus: 'Product Creation',
    estimatedTime: '90 minutes',
    checklist: [
      'Open a clean Google Sheet, Google Doc, or Notion page',
      'Input the essential formulas, checklist steps, or curated templates',
      'Write a 1-paragraph "How to use this asset" guide at the very top',
      'Set sharing permission to "Anyone with the link can view / copy"'
    ],
    keyDeliverable: 'A complete, working Google Sheet or PDF document ready for delivery.'
  },
  {
    day: 3,
    title: 'Set Up Your Direct WhatsApp Checkout Link',
    focus: 'Payment Rails & Conversion',
    estimatedTime: '30 minutes',
    checklist: [
      'Generate your pre-filled WhatsApp link with your order message',
      'Verify your mobile money receiving details (M-Pesa / Tigo Pesa Lipa Namba)',
      'Save the 10 WhatsApp DM Swipe Scripts in your phone notes for instant replies',
      'Update your social media bio (Threads, Instagram, WhatsApp Business) with your hook'
    ],
    keyDeliverable: 'A live WhatsApp order link placed in your bio.'
  },
  {
    day: 4,
    title: 'Post Your First "Problem Teaser" Text Breakdown',
    focus: 'Social Discovery',
    estimatedTime: '25 minutes',
    checklist: [
      'Select the Day 1 Pitfall prompt from the 45-day matrix',
      'Highlight the expensive mistake beginners make when trying to solve this problem',
      'Do NOT drop your purchase link in the post; encourage thoughtful discussion',
      'Spend 15 minutes leaving 5 genuine replies under active discussions in your lane'
    ],
    keyDeliverable: '1 published discussion post + 5 targeted comments.'
  },
  {
    day: 5,
    title: 'Publish the High-Value Process Breakdown',
    focus: 'Authority Building',
    estimatedTime: '30 minutes',
    checklist: [
      'Select a Day 3 or Day 10 Process prompt from the matrix',
      'Break down your exact 3-step solution to the problem in clear plain text',
      'Include a simple screenshot of your template or checklist as visual proof',
      'Prompt: "If you want this exact template pre-built, check the link in my bio"'
    ],
    keyDeliverable: '1 high-authority breakdown post showing proof of work.'
  },
  {
    day: 6,
    title: 'Address Objections & Answer Frequently Asked Questions',
    focus: 'Trust & De-risking',
    estimatedTime: '20 minutes',
    checklist: [
      'Publish an FAQ text post answering: "Who is this for?" and "How does it work?"',
      'Post a 3-slide breakdown on your WhatsApp Status and Instagram Story',
      'Respond immediately to any incoming DMs using your swipe scripts',
      'Keep interactions warm, personal, and zero-pressure'
    ],
    keyDeliverable: 'Overcome hesitation across public posts and private DMs.'
  },
  {
    day: 7,
    title: 'The Direct Weekly Offer & Weekend Close',
    focus: 'Direct Commercial Ask',
    estimatedTime: '20 minutes',
    checklist: [
      'Post the Day 7 Weekly Ask template directly stating what the product is and who it helps',
      'Include clear pricing and the direct WhatsApp trigger keyword (e.g., text "STARTER")',
      'Send instant delivery and personal access keys to buyers within 10 minutes of payment',
      'Record your weekly scorecard numbers (Posts, Replies, Convos, Asks)'
    ],
    keyDeliverable: 'Your first official commercial launch sprint completed and sales secured.'
  }
];

export const DAILY_ROUTINE_STEPS = [
  {
    phase: 'Phase 1: Discovery & Networking',
    time: '5 Minutes',
    action: 'Leave 3 to 5 value-adding comments on active discussions in your niche. Never paste links; solve micro-problems.'
  },
  {
    phase: 'Phase 2: Distribution',
    time: '5 Minutes',
    action: 'Publish your daily text prompt from the 45-day matrix. Ensure your positioning hook in bio is up-to-date.'
  },
  {
    phase: 'Phase 3: Conversation Triage',
    time: '5 Minutes',
    action: 'Reply to comments on your post, answer incoming WhatsApp inquiries, and send instant keys to new buyers.'
  },
  {
    phase: 'Phase 4: Relationship Compounding',
    time: '5 Minutes',
    action: 'Follow up with past buyers to ask for feedback, review your weekly numbers, and close open inquiries politely.'
  }
];

export const DEFAULT_OFFER_WORKSHEET: OfferWorksheetData = {
  who: 'freelancers and digital creators in East Africa',
  problem: 'posting links that nobody clicks and struggling to close inquiries on WhatsApp',
  outcome: 'turn quiet text posts into daily paying customers',
  deliverable: 'a ready-to-use PDF guide + 20 text templates + WhatsApp closing scripts',
  without: 'filming Reels, dancing on camera, or paying for ads',
  priceTZS: '25,000',
  priceUSD: '10',
  ctaKeyword: 'ENGINE',
  whatsappHandle: '+255757895896'
};

export const START_HERE_CHECKLIST = [
  {
    id: 'step_1',
    title: 'Save your personal access code & magic link',
    detail: 'Bookmark your ?key=... link or save your code in WhatsApp Saved Messages so you can reopen the app on any phone or laptop.'
  },
  {
    id: 'step_2',
    title: 'Complete your 1-Page Offer Worksheet (Build My Offer)',
    detail: 'Fill in who you help, the problem, your deliverable, and your TSh / USD price. The workspace automatically customizes your scripts and posts.'
  },
  {
    id: 'step_3',
    title: 'Pick your first 3 posts from the 20-Template Vault',
    detail: 'Choose 1 Pitfall post, 1 Question post, and 1 Weekly Offer post so you never stare at a blank screen this week.'
  },
  {
    id: 'step_4',
    title: 'Save your DM closing & payment quick replies',
    detail: 'Copy your DM closing scripts from the DM Scripts tab into your saved replies (Instagram, X, LinkedIn, or WhatsApp Business).'
  },
  {
    id: 'step_5',
    title: 'Publish Day 1 of the 7-Day Launch Plan tonight',
    detail: 'Post your positioning hook and leave 5 helpful comments in your niche—zero video required.'
  }
];

export const TEMPLATE_VAULT_20: TemplateVaultItem[] = [
  {
    id: 'tpl_01',
    num: '01',
    archetype: 'pitfall',
    archetypeLabel: 'Costly Mistake',
    title: 'The Expensive Beginner Trap',
    bestFor: 'Threads, X, LinkedIn',
    template: 'The biggest mistake I made when trying to solve [PROBLEM]:\n\nI spent weeks doing [WASTED EFFORT] before checking if [WHO] actually wanted it.\n\nWhat actually works: [OUTCOME] using [DELIVERABLE].\n\nHave you made this mistake too? Tell me below.',
    tanzanianExample: 'The biggest mistake I made at the start: spending 3 weeks building a massive guide before asking customers if they needed it. Now I launch with a focused 1-page checklist for TSh 15,000 ($6) first.'
  },
  {
    id: 'tpl_02',
    num: '02',
    archetype: 'pitfall',
    archetypeLabel: 'Costly Mistake',
    title: 'Why Most Offers Get Ghosted',
    bestFor: 'Stories, DMs, Threads',
    template: 'Why [WHO] keep getting "I\'ll get back to you" in the DMs:\n\n1. Replying with only the price and zero context\n2. Sending 5-minute voice notes instead of clear bullet points\n3. Making checkout take 6 steps\n\nFix those 3 and your close rate changes immediately.',
    tanzanianExample: '3 reasons buyers say "I\'ll get back to you" in your DMs: dropping only the price without showing the outcome, sending long voice notes, and lacking a 1-step payment instruction.'
  },
  {
    id: 'tpl_03',
    num: '03',
    archetype: 'pitfall',
    archetypeLabel: 'Costly Mistake',
    title: 'Stop Chasing Empty Views',
    bestFor: 'Threads, Instagram Carousel',
    template: '10,000 views from random scrollers pays TSh 0.\n\n12 replies from [WHO] dealing with [PROBLEM] pays your bills.\n\nStop building for viral views. Start writing for buyers who already need [OUTCOME].',
    tanzanianExample: '10,000 views from people who never buy pays $0. Just 12 people who urgently need your budget or workflow template can pay you TSh 240,000 ($100+) this week.'
  },
  {
    id: 'tpl_04',
    num: '04',
    archetype: 'pitfall',
    archetypeLabel: 'Costly Mistake',
    title: 'The Link-in-Main-Post Penalty',
    bestFor: 'Threads, X, LinkedIn',
    template: 'Quick reminder if you sell online:\n\nNever paste your checkout link in the main post. Algorithms bury external links.\n\nDeliver the full lesson in text first. Drop your DM keyword or link only in the first reply.',
    tanzanianExample: 'When you paste a checkout link inside the main post, platforms bury your reach. Write the full lesson first, then place your DM keyword or link in the first comment.'
  },
  {
    id: 'tpl_05',
    num: '05',
    archetype: 'question',
    archetypeLabel: 'Conversation Trigger',
    title: 'A or B Bottleneck Poll',
    bestFor: 'Threads, X, Stories',
    template: 'Quick question for [WHO]:\n\nWhat slows you down more right now?\n\n[A] [PROBLEM]\n[B] Turning inquiries into paid orders\n\nReply A or B below — I\'ll reply with a practical fix to every answer.',
    tanzanianExample: 'Question for small business owners: What is slowing you down more this week — [A] Getting new leads into your DMs, or [B] Closing the sale once they ask the price? Reply A or B.'
  },
  {
    id: 'tpl_06',
    num: '06',
    archetype: 'question',
    archetypeLabel: 'Conversation Trigger',
    title: 'The 10-Second Tool Check',
    bestFor: 'Threads, LinkedIn',
    template: '[WHO] — honest question:\n\nWhat single tool, template, or system saves you at least 3 hours every week?\n\nShare yours below so others can learn.',
    tanzanianExample: 'Quick question: Which simple system (Google Sheets, saved DM replies, or Notion) saves you the most hours in your business every week?'
  },
  {
    id: 'tpl_07',
    num: '07',
    archetype: 'question',
    archetypeLabel: 'Conversation Trigger',
    title: 'What Nobody Tells Beginners',
    bestFor: 'Threads, X',
    template: 'If someone you respect was starting from zero as [WHO] today, what is the ONE piece of advice you would give them about [PROBLEM]?\n\nDrop one honest sentence below.',
    tanzanianExample: 'If you had to start your digital service business today with $0 for paid ads, what is the one piece of advice you would give a beginner?'
  },
  {
    id: 'tpl_08',
    num: '08',
    archetype: 'question',
    archetypeLabel: 'Conversation Trigger',
    title: 'Would You Use This?',
    bestFor: 'Stories, Threads, LinkedIn',
    template: 'I am putting together [DELIVERABLE] to help [WHO] [OUTCOME] without [WITHOUT].\n\nBefore I finalize it: what is the #1 question you wish it answered inside?\n\nReply below or DM me.',
    tanzanianExample: 'I am putting together a short DM + Mobile Checkout playbook for small business owners. Before I finalize it, what is the #1 question you want answered inside?'
  },
  {
    id: 'tpl_09',
    num: '09',
    archetype: 'process',
    archetypeLabel: 'Workflow Proof',
    title: '3-Step Behind-The-Scenes',
    bestFor: 'Threads, LinkedIn, Instagram',
    template: 'How we achieve [OUTCOME] in 3 unglamorous steps (without [WITHOUT]):\n\n1. Identify the exact bottleneck ([PROBLEM])\n2. Use [DELIVERABLE] instead of guessing\n3. Close via clear DM / Card instructions\n\nReply "[KEYWORD]" if you want the exact checklist.',
    tanzanianExample: 'How we organize weekly meal-prep orders in 15 minutes with zero chaos: 1. Share PDF menu on Sunday, 2. Collect 50% deposit via M-Pesa/Card, 3. Send clear delivery time confirmation in DMs.'
  },
  {
    id: 'tpl_10',
    num: '10',
    archetype: 'process',
    archetypeLabel: 'Workflow Proof',
    title: 'My 20-Minute Daily Routine',
    bestFor: 'LinkedIn, Threads',
    template: 'How I market my digital product in 20 minutes a day:\n\n• 05 min: Publish 1 clear text insight\n• 05 min: Reply to every comment\n• 05 min: Leave 3 helpful notes on peer posts\n• 05 min: Answer private DMs\n\nThen close the phone and focus on real work.',
    tanzanianExample: 'My 20-minute morning marketing block: 5 minutes to publish one clear text insight, 10 minutes replying to comments, 5 minutes closing orders in DMs. Then I put the phone away and build.'
  },
  {
    id: 'tpl_11',
    num: '11',
    archetype: 'process',
    archetypeLabel: 'Workflow Proof',
    title: 'How a Customer Gets Delivered in 60 Seconds',
    bestFor: 'Stories, Instagram, Threads',
    template: 'Here is what happens right after a customer pays TSh [PRICE_TZS] ($[PRICE_USD]):\n\n1. Payment confirmed (Mobile Money / Card)\n2. Personal access code issued automatically\n3. Immediate link to [DELIVERABLE] + offline PDF\n\nSimple, fast, and respectful of the buyer\'s time.',
    tanzanianExample: 'Right after a customer pays TSh 25,000 ($10) by mobile money or card: they immediately receive their Access Code, workspace link, and offline PDF without waiting hours.'
  },
  {
    id: 'tpl_12',
    num: '12',
    archetype: 'process',
    archetypeLabel: 'Workflow Proof',
    title: 'Real Client Conversation Breakdown',
    bestFor: 'Threads, LinkedIn',
    template: 'Earlier today someone asked: "Does this actually work without [WITHOUT]?"\n\nHere was my answer:\nSerious buyers want clarity, not noise. Show them you understand [PROBLEM], give them [DELIVERABLE], and make payment effortless.\n\nClarity closes.',
    tanzanianExample: 'Someone asked me today: "Can I really sell digital products without filming Reels?" Yes. Paying customers care whether you solve their problem with clarity and respect.'
  },
  {
    id: 'tpl_13',
    num: '13',
    archetype: 'opinion',
    archetypeLabel: 'Contrarian Truth',
    title: 'The Quiet Sales Principle',
    bestFor: 'Threads, X, LinkedIn',
    template: 'Unpopular opinion:\n\nYou do not need a studio camera, ring light, or daily Reels to sell [DELIVERABLE].\n\nYou need to solve [PROBLEM] clearly in plain words so [WHO] trust you enough to pay.',
    tanzanianExample: 'Unspoken truth: You do not need an expensive camera or TikTok dances to monetize your skills. You need clear writing with real proof and respectful DM conversations.'
  },
  {
    id: 'tpl_14',
    num: '14',
    archetype: 'opinion',
    archetypeLabel: 'Contrarian Truth',
    title: 'Small Price, Real Proof',
    bestFor: 'Threads, X',
    template: 'People overcomplicate digital products.\n\nA clear TSh [PRICE_TZS] ($[PRICE_USD]) system that solves ONE real problem beats a bloated 40-hour video course nobody finishes.',
    tanzanianExample: 'A practical TSh 25,000 ($10) toolkit that solves one specific problem in 25 minutes beats a bloated 30-hour video course that buyers never finish watching.'
  },
  {
    id: 'tpl_15',
    num: '15',
    archetype: 'opinion',
    archetypeLabel: 'Contrarian Truth',
    title: 'Consistency Beats Intensity',
    bestFor: 'LinkedIn, Threads',
    template: 'Posting 12 times in 3 days then disappearing for a month kills trust.\n\nPublishing 3 thoughtful posts a week for 90 days makes [WHO] remember your name the moment [PROBLEM] hits.',
    tanzanianExample: 'Publishing 3 thoughtful posts a week for 90 days builds far stronger buyer trust than posting 10 times in two days and disappearing.'
  },
  {
    id: 'tpl_16',
    num: '16',
    archetype: 'opinion',
    archetypeLabel: 'Contrarian Truth',
    title: 'DMs Are Not Spam When Earned',
    bestFor: 'LinkedIn, Threads',
    template: 'Cold-spamming links to strangers is annoying.\n\nFollowing up privately with someone who commented on your post about [PROBLEM] is good customer service.\n\nNever confuse the two.',
    tanzanianExample: 'Sending unsolicited links to strangers is spam. Following up in DMs with someone who asked a genuine question on your post is great customer service.'
  },
  {
    id: 'tpl_17',
    num: '17',
    archetype: 'ask',
    archetypeLabel: 'Direct Weekly Offer',
    title: 'The Plain-English Weekly Offer',
    bestFor: 'All Platforms',
    template: 'This week\'s offer for [WHO]:\n\nIf you are tired of [PROBLEM] and want to [OUTCOME] without [WITHOUT], grab [DELIVERABLE].\n\n• Price: TSh [PRICE_TZS] ($[PRICE_USD])\n• Instant access code + offline PDF included\n\nSend "[KEYWORD]" to my DMs and I will send the link.',
    tanzanianExample: 'This week\'s offer: For anyone ready to sell digital products and services through text posts and DMs without filming Reels. Price: TSh 25,000 ($10). DM the word "ENGINE" to get the link.'
  },
  {
    id: 'tpl_18',
    num: '18',
    archetype: 'ask',
    archetypeLabel: 'Direct Weekly Offer',
    title: '3-Slide Story / Status Offer',
    bestFor: 'IG Stories, WhatsApp Status',
    template: '[Slide 1] Are you struggling with [PROBLEM]?\n[Slide 2] You don\'t need to do it the hard way (no [WITHOUT]). Here is [DELIVERABLE] that helps [WHO] [OUTCOME].\n[Slide 3] Available now for TSh [PRICE_TZS] ($[PRICE_USD]). Reply "[KEYWORD]" in DMs for instant checkout details.',
    tanzanianExample: 'Slide 1: Struggling to turn DM questions into paid orders? Slide 2: Use The Quiet Sales Engine — 20 post templates + closing scripts. Slide 3: TSh 25,000 ($10). Reply "ENGINE" in DMs for the link.'
  },
  {
    id: 'tpl_19',
    num: '19',
    archetype: 'ask',
    archetypeLabel: 'Direct Weekly Offer',
    title: 'The Weekend Sprint Invitation',
    bestFor: 'Threads, Stories, IG',
    template: 'Weekend goal: finish your offer before Monday.\n\nUse [DELIVERABLE] to go from scattered notes to a live, sellable system in 48 hours.\n\nTSh [PRICE_TZS] / $[PRICE_USD] one-time. Message "[KEYWORD]" to start tonight.',
    tanzanianExample: 'Weekend goal: finalize your offer before Monday. Grab The Quiet Sales Engine for TSh 25,000 ($10) and build your complete sales system in 48 hours. DM "ENGINE".'
  },
  {
    id: 'tpl_20',
    num: '20',
    archetype: 'ask',
    archetypeLabel: 'Direct Weekly Offer',
    title: 'The FAQ + Direct Link Close',
    bestFor: 'Threads, LinkedIn, DMs',
    template: '3 questions people ask before grabbing [DELIVERABLE]:\n\n1. Do I need video or followers? No — built for zero-camera selling.\n2. How do I pay? M-Pesa / Tigo Pesa (TSh [PRICE_TZS]) or International Card ($[PRICE_USD]).\n3. When do I get it? Immediately via personal access code + PDF.\n\nReply "[KEYWORD]" to grab yours.',
    tanzanianExample: '3 quick FAQs: 1. Do I need to film videos? No. 2. How do I pay? M-Pesa / Mobile Money (TSh 25,000) or Card ($10). 3. When do I get access? Instantly! DM "ENGINE" to get started.'
  }
];

export const WHATSAPP_SCRIPTS_FULL: DMSwipeScript[] = [
  {
    id: 'ws_status_01',
    title: 'Story / Status 3-Slide Sequence (Text-Only)',
    category: 'status',
    triggerScenario: 'Post on IG Stories, WhatsApp Status, or Threads on Tuesday & Saturday mornings to trigger warm DM replies.',
    script: 'Slide 1 (Dark BG): "Are you losing leads in your DMs because you only reply with the price?"\n\nSlide 2 (White BG): "The issue isn\'t your price. It\'s that buyers don\'t see a clear step from question to checkout."\n\nSlide 3 (Lime/Black): "I built [PRODUCT] (TSh [PRICE_TZS] / $[PRICE_USD]). Get ready-to-use DM scripts & a 7-day launch plan. Reply \'START\' in DMs and I\'ll send it over."',
    proTip: 'Keep each Story/Status slide under 22 words so readers can scan it without holding the screen.'
  },
  {
    id: 'ws_status_02',
    title: 'Behind-The-Scenes Progress Story / Status',
    category: 'status',
    triggerScenario: 'Screenshot your Offer Worksheet or checklist and share it with a short DM CTA.',
    script: 'Caption under screenshot: "I\'ve been building this system to help [WHO] achieve [OUTCOME] without [WITHOUT]. If you want to try it today for TSh [PRICE_TZS] ($[PRICE_USD]), send me a DM with [KEYWORD]."',
    proTip: 'Real screenshots of a clean spreadsheet or app screen outperform polished flyers by 3x across Stories and Status.'
  },
  {
    id: 'ws_dm_01',
    title: 'Warm DM Opener (When Someone Replies to a Post or Status)',
    category: 'dm',
    triggerScenario: 'Someone comments "[KEYWORD]" or replies to your Status with interest.',
    script: 'Hi [Name]! Thanks for reaching out.\n\nBefore I send the link, tell me briefly—what product or service are you selling right now, and what is your biggest challenge? (This helps me point you to the best starting point right away.)',
    proTip: 'Asking 1 quick diagnostic question makes the buyer feel heard and dramatically increases payment completion.'
  },
  {
    id: 'ws_dm_02',
    title: 'Public Comment → Private DM Bridge',
    category: 'dm',
    triggerScenario: 'Someone asks a thoughtful question on Threads, Instagram, or LinkedIn.',
    script: 'Hey [Name], saw your comment about [PROBLEM]. I actually put together a short 1-page breakdown on how we handle that without [WITHOUT]. Happy to share it here if you want to take a look!',
    proTip: 'Always ask permission or offer value first—never drop an uninvited payment link in a cold DM.'
  },
  {
    id: 'ws_followup_01',
    title: '24-Hour Respectful Follow-Up',
    category: 'followup',
    triggerScenario: 'Buyer asked for payment details or Selar link yesterday but hasn\'t completed payment yet.',
    script: 'Hi [Name]! Hope your day is going well.\n\nJust checking in to see if you had a chance to open the [PRODUCT] checkout link, or if you had any questions about paying by mobile money or card.\n\nNo pressure at all—just let me know, happy to help!',
    proTip: 'Send once after 24 hours. Keep it polite and low-pressure; about 30% of quiet sales close on this single follow-up.'
  },
  {
    id: 'ws_followup_02',
    title: '3-Day Check-In After Delivery (Turns Buyers Into Case Studies)',
    category: 'followup',
    triggerScenario: 'Send 3 days after a customer unlocks their app access.',
    script: 'Hi [Name]! It\'s been 3 days since you unlocked [PRODUCT]. Have you started Day 1 or filled in your Offer Worksheet yet?\n\nLet me know if you\'re stuck anywhere or what has helped you the most so far!',
    proTip: 'Replies to this message give you real customer quotes you can screenshot (with permission) as proof.'
  },
  {
    id: 'ws_closing_01',
    title: 'Tanzania M-Pesa / Tigo Pesa / Direct Mobile Closing Script',
    category: 'closing',
    triggerScenario: 'Buyer is ready to pay in Tanzanian Shillings (TSh).',
    script: 'Awesome [Name]! Here is how to get instant access to [PRODUCT]:\n\n1. Send TSh [PRICE_TZS] to: [LIPA_NAMBA] (Name: [LIPA_NAME])\n2. Reply here with your full name and transaction code (or a screenshot of the SMS receipt)\n3. Within 1 minute you will receive your Personal Access Code, app link, and offline PDF.\n\nLet me know as soon as you send it so I can unlock it for you right away!',
    proTip: 'Always show the exact registered name so buyers confirm before pressing their mobile money PIN.'
  },
  {
    id: 'ws_closing_02',
    title: 'International Card / Selar Closing Script',
    category: 'closing',
    triggerScenario: 'Buyer is outside Tanzania (Kenya, Nigeria, UK, US, Europe) paying by Card.',
    script: 'Awesome [Name]! You can pay securely by Visa, Mastercard, or international card ($[PRICE_USD] USD) using this checkout link:\n👉 [CHECKOUT_LINK]\n\nRight after payment, your personal Access Code + app link + downloadable 8-page PDF are delivered automatically so you can start Day 1 immediately.\n\nLet me know once you\'re inside!',
    proTip: 'Highlight instant automated delivery so international buyers in different timezones feel confident buying anytime.'
  },
  {
    id: 'ws_obj_01',
    title: 'Objection: "Do I Need to Show My Face on Reels?"',
    category: 'objection',
    triggerScenario: 'Camera-shy creator or professional who values privacy.',
    script: 'Not at all! This entire system was built specifically for selling WITHOUT video or showing your face on camera.\n\nYou use clear, structured text posts, simple screen screenshots, and respectful DM conversations (on IG, X, LinkedIn, or WhatsApp). Serious buyers don\'t care about TikTok dances—they want a clear solution.',
    proTip: 'Reassure them that text + DMs works especially well for B2B, guides, digital products, and consulting.'
  },
  {
    id: 'ws_obj_02',
    title: 'Objection: "Is TSh 25,000 / $10 Worth It If I Have Few Followers?"',
    category: 'objection',
    triggerScenario: 'Buyer worries they need 5,000+ followers first or hesitates on price.',
    script: 'Great question [Name]! This system does not require a large follower count—just 1 single sale of your product or service pays back the entire TSh [PRICE_TZS] ($[PRICE_USD]) cost.\n\nYou are not just buying theory; you get the Offer Builder, 20 ready-to-post templates, and DM scripts to start closing customers tonight.',
    proTip: 'Always anchor the price to 1 single customer sale paying back 100% of the cost.'
  }
];

export const TANZANIAN_EXAMPLES: TanzanianExampleItem[] = [
  {
    id: 'tz_ex_01',
    businessType: 'Dar es Salaam Home Kitchen & Meal Prep',
    city: 'Dar es Salaam (Mikocheni)',
    productSold: 'Weekly Office Lunch Subscription + 7-Day Meal Prep Guide PDF',
    priceTZS: 25000,
    channel: 'Stories + Threads',
    postHook: 'Office workers in Dar: ordering takeout every afternoon quietly drains TSh 150,000+ every month. Here is our exact weekly meal schedule and prep guide PDF.',
    whatsappConversation: [
      { sender: 'Buyer', message: 'Hi! I saw your post about the meal prep guide and lunch plan. What is inside the PDF and how much is it?' },
      { sender: 'Seller', message: 'Hi Neema! The PDF includes a 14-day home meal schedule, a TSh 35,000 weekly market shopping list, and easy recipes. It is TSh 25,000.' },
      { sender: 'Buyer', message: 'How do I receive it once I pay, and which number do I send to?' },
      { sender: 'Seller', message: 'Send TSh 25,000 to 0757 895 896 (Name: SARAH KAPUYA). Once sent, I will immediately send your access code and PDF download link right to your phone.' },
      { sender: 'Buyer', message: 'Sent via M-Pesa, Ref: QX74K29M.' },
      { sender: 'Seller', message: 'Thank you Neema! Payment confirmed. Here is your Access Code: BB-NEEMA-4821-K4 and your PDF download link. Welcome!' }
    ],
    takeaway: 'Zero video reels filmed—sold 19 guides in 2 weeks directly from text story slides and direct mobile checkout.'
  },
  {
    id: 'tz_ex_02',
    businessType: 'Arusha Freelance Graphic Designer & Brand Pack',
    city: 'Arusha',
    productSold: 'DIY Small Business Brand Kit & Canva Proposal Template',
    priceTZS: 30000,
    channel: 'Threads + Instagram Text Carousel',
    postHook: 'Small business owners: stop paying TSh 200,000 every week for tiny design edits. Use our 15 Canva templates to swap your colors and prices in 3 minutes.',
    whatsappConversation: [
      { sender: 'Buyer', message: 'Hello, I saw your Threads post about the business Canva templates. Do they work on a smartphone?' },
      { sender: 'Seller', message: 'Hi Musa! Yes, 100%—they work on the free Canva app on your phone or laptop. You just edit the text and drop in your contact link.' },
      { sender: 'Buyer', message: 'How do I grab it today? Is it TSh 30,000?' },
      { sender: 'Seller', message: 'Yes, TSh 30,000 for lifetime access. Send via Tigo Pesa / M-Pesa to 0757 895 896 (SARAH KAPUYA), then reply with your transaction code so I can unlock it.' }
    ],
    takeaway: 'Packaged repetitive client design requests into a TSh 30,000 template kit instead of turning away low-budget leads.'
  },
  {
    id: 'tz_ex_03',
    businessType: 'Mwanza Small Shop Bookkeeping Sheet',
    city: 'Mwanza',
    productSold: 'Daily Cash & M-Pesa Till Reconciliation Excel/Google Sheet',
    priceTZS: 20000,
    channel: 'LinkedIn + Stories',
    postHook: 'Shop and salon owners: if you don\'t know your real net profit after daily expenses every evening, you are flying blind. Here is our 5-minute tracking sheet.',
    whatsappConversation: [
      { sender: 'Buyer', message: 'Does that sheet require advanced Excel skills? I mostly use my phone.' },
      { sender: 'Seller', message: 'Not at all Rose! Every formula is already built in. You just type today\'s sales and expenses on your phone (Google Sheets), and it calculates your profit automatically.' },
      { sender: 'Buyer', message: 'Send me the payment number so I can pay right now.' }
    ],
    takeaway: 'Solved one urgent evening pain point (balancing till cash) with clear plain-English proof screenshots.'
  }
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'cs_freelancer',
    archetype: 'Freelancer',
    name: 'Kelvin M. — Freelance Web & Copy Specialist',
    location: 'Dar es Salaam, Tanzania',
    beforeState: 'Spent hours writing long proposals that got ghosted, and had irregular income relying solely on referrals.',
    changeMade: 'Built a focused TSh 25,000 "Client Onboarding & Proposal Pack" using the Offer Worksheet and posted 4 text breakdowns a week on Threads & LinkedIn.',
    outcomeMetric: '14 digital kit sales (TSh 350,000) + 2 full retainer clients in 30 days',
    timeframe: '30 Days · 20 mins/day',
    weeklyRoutine: [
      'Monday: Posted 1 Costly Mistake story from past client work',
      'Wednesday: Shared a screenshot of his Scope-of-Work Google Doc',
      'Friday: Published a clear Weekly Offer with DM keyword "PACK"'
    ],
    keyPostUsed: '"Stop sending clients 10-page proposals they never read. Here is the 1-page agreement that gets 50% deposits paid the same day."'
  },
  {
    id: 'cs_food',
    archetype: 'Food Business',
    name: 'Amina H. — Homemade Bakery & Weekly Lunch Boxes',
    location: 'Dodoma & Dar es Salaam',
    beforeState: 'Answered "How much?" 30 times a day in DMs with buyers disappearing, and struggled to predict weekend ingredient orders.',
    changeMade: 'Switched to a 3-slide Story/Status menu sequence + launched a TSh 15,000 digital "7-Day Healthy Home Meal Planner PDF" for remote customers.',
    outcomeMetric: 'Pre-paid weekend orders rose 2.4x + 22 PDF guide sales via M-Pesa',
    timeframe: '21 Days · Zero video Reels',
    weeklyRoutine: [
      'Thursday: Posted 3-slide Story/Status showing weekend menu & cut-off time',
      'Saturday: Shared a screenshot of happy customer DM feedback',
      'Sunday: Followed up politely with 24-hour script on pending inquiries'
    ],
    keyPostUsed: '"If you spend TSh 12,000/day on random takeout, our 7-Day Home Prep Guide saves you TSh 40,000 every single week. Reply MENU."'
  },
  {
    id: 'cs_coach',
    archetype: 'Coach',
    name: 'David K. — Career & Remote Work Coach',
    location: 'Nairobi / Arusha',
    beforeState: 'Hated being on camera, felt awkward filming Instagram Reels, and waited weeks between 1-on-1 coaching bookings.',
    changeMade: 'Packaged his CV & LinkedIn advice into a $10 (TSh 25,000) digital sprint guide using Selar for international cards and Lipa Namba locally.',
    outcomeMetric: '31 international & local sales ($310+) while working a full-time job',
    timeframe: '45 Days · Weekend Batch Track',
    weeklyRoutine: [
      'Sunday: Batched 3 LinkedIn & Threads posts in 45 minutes',
      'Daily 15-min timer: Left 5 thoughtful comments under remote-work discussions',
      'DM Bridge: Sent helpful answers first, checkout link only when asked'
    ],
    keyPostUsed: '"Remote employers reject 80% of CVs in 6 seconds because of formatting. Here are the 3 fixes that got 4 readers interviews this month."'
  }
];

export const CONVERSATION_MAP_STAGES: ConversationMapStage[] = [
  {
    step: '01',
    title: 'Post (Earn Attention Without Video)',
    goal: 'Stop the right buyer with a clear problem, mistake, or practical insight.',
    action: 'Publish 1 text post from the 20-Template Vault. Keep external links OUT of the main post.',
    exactLine: '"Why most DM inquiries end in silence—and the 3-line reply that locks in deposits."',
    mistakeToAvoid: 'Posting vague motivational quotes or dropping a raw payment link with zero context.'
  },
  {
    step: '02',
    title: 'DM (Open a Human Conversation)',
    goal: 'Move curious commenters or Story viewers into a warm 1-on-1 chat.',
    action: 'When they comment a keyword or reply to your Story, greet them by name and ask 1 short question.',
    exactLine: '"Hi [Name]! Thanks for reaching out. What product or service are you selling right now?"',
    mistakeToAvoid: 'Immediately pasting a wall of 5 paragraphs and 3 links before saying hello.'
  },
  {
    step: '03',
    title: 'Recommendation (Match Offer to Problem)',
    goal: 'Show clearly how your digital product or service solves what they just told you.',
    action: 'Summarize their need in one sentence, present your Offer Deliverable, and state the price transparently.',
    exactLine: '"Based on what you shared, [PRODUCT] (TSh 25,000 / $10) gives you ready-to-use DM scripts and a 7-day plan. Would you like me to send the payment details?"',
    mistakeToAvoid: 'Giving only a bare number ("It\'s $10") without explaining the tangible deliverables included.'
  },
  {
    step: '04',
    title: 'Payment (Zero-Friction Local or Card Rail)',
    goal: 'Let them pay in under 60 seconds using the method natural to their country.',
    action: 'Tanzania buyers get M-Pesa / Tigo Pesa mobile number instructions; international buyers get the direct Selar Card link.',
    exactLine: '"Tanzania: Send TSh 25,000 to 0757 895 896 (SARAH KAPUYA). International Card ($10): [Selar Link]."',
    mistakeToAvoid: 'Asking international clients to wire banks or forcing local mobile money users through failing card forms.'
  },
  {
    step: '05',
    title: 'Delivery (Instant Access + Clear First Step)',
    goal: 'Eliminate buyer remorse immediately and get them winning in the first 10 minutes.',
    action: 'Automated system or seller sends personal Access Code + Direct Magic App Link + Offline PDF + "Start Here" instruction.',
    exactLine: '"Welcome [Name]! Your Access Code is [CODE]. Open the workspace here: [LINK]?key=[CODE] — start with the Start Here tab tonight!"',
    mistakeToAvoid: 'Leaving paid buyers waiting for hours or dumping 40 disorganized files with no starting point.'
  }
];

