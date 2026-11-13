const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function createPdf() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);

  // Helper to draw standard header & footer on pages 2-8
  function drawPageChrome(pageNum, chapterTitle) {
    // Header line
    doc.setDrawColor(20, 20, 20);
    doc.setLineWidth(0.5);
    doc.line(margin, 14, pageWidth - margin, 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text('THE QUIET SALES ENGINE · BIASHARABASE.COM', margin, 11);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(chapterTitle.toUpperCase(), pageWidth - margin, 11, { align: 'right' });

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Official Offline Edition · © 2025 BiasharaBase (biasharabase.com)', margin, pageHeight - 9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(`Page ${pageNum} of 8`, pageWidth - margin, pageHeight - 9, { align: 'right' });
  }

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Background accent block
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Neon yellow hero strip
  doc.setFillColor(210, 248, 3);
  doc.rect(margin, 25, contentWidth, 24, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(margin, 25, contentWidth, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('BIASHARABASE.COM · OFFICIAL COMPLETE E-BOOK', margin + 6, 35);
  doc.setFontSize(9);
  doc.text('ZERO-CAMERA SOCIAL COMMERCE SPECIFICATION', margin + 6, 42);

  // Big Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text('THE QUIET', margin, 72);
  doc.text('SALES ENGINE', margin, 85);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(210, 248, 3);
  doc.text('THE NO-REELS TEXT & DM SYSTEM FOR SELLING DIGITAL PRODUCTS', margin, 97);

  // Divider
  doc.setDrawColor(210, 248, 3);
  doc.setLineWidth(1);
  doc.line(margin, 104, pageWidth - margin, 104);

  // Description body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(210, 210, 210);
  const desc = 'How to sell digital products, Notion templates, checklists, guides & freelance services using text-only posts, genuine direct messages, and zero video. No studio lighting, no dancing on camera, no paid advertising campaigns.';
  const splitDesc = doc.splitTextToSize(desc, contentWidth);
  doc.text(splitDesc, margin, 114);

  // Table of Contents Card
  doc.setFillColor(30, 30, 30);
  doc.rect(margin, 136, contentWidth, 108, 'F');
  doc.setDrawColor(60, 60, 60);
  doc.rect(margin, 136, contentWidth, 108, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(210, 248, 3);
  doc.text('COMPLETE 8-CHAPTER CURRICULUM OVERVIEW', margin + 6, 146);

  const chapters = [
    { num: '01', title: 'The Attention Trap: Why broadcasting fails & conversations win', page: 'Page 2' },
    { num: '02', title: 'The Positioning Formula: Write a bio that converts strangers in 3s', page: 'Page 3' },
    { num: '03', title: 'The 5 Text Archetypes: Posts that trigger natural buyer DMs', page: 'Page 4' },
    { num: '04', title: 'The 15-Minute Daily Rhythm: Generating leads without burnout', page: 'Page 5' },
    { num: '05', title: 'The Conversation-to-Cash Protocol: Closing WhatsApp orders', page: 'Page 6' },
    { num: '06', title: 'Zero-Camera Visual Proof: Screenshots that build instant trust', page: 'Page 7' },
    { num: '07', title: 'The Dual-Track Matrix: 25-Min Sprint vs 2-Hour Weekend Batch', page: 'Page 8' },
    { num: '08', title: 'The 4 True Metrics: Tracking real commerce instead of vanity likes', page: 'Page 8' }
  ];

  let tocY = 156;
  chapters.forEach(ch => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(210, 248, 3);
    doc.text(ch.num, margin + 6, tocY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(230, 230, 230);
    doc.text(ch.title, margin + 14, tocY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(160, 160, 160);
    doc.text(ch.page, pageWidth - margin - 6, tocY, { align: 'right' });
    tocY += 10.5;
  });

  // Footer on cover
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Published by BiasharaBase Publishing · East Africa & Global Digital Commerce', margin, pageHeight - 20);
  doc.text('Verified Offline Digital Download · Direct Link: https://biasharabase.com', margin, pageHeight - 15);

  // ==========================================
  // PAGE 2: CHAPTER 01
  // ==========================================
  doc.addPage();
  drawPageChrome(2, 'Chapter 01 · The Attention Trap');

  // Chapter Header Box
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 20, contentWidth, 26, 'F');
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.8);
  doc.rect(margin, 20, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('CHAPTER 01 · 4 MIN SPRINT', margin + 6, 28);

  doc.setFontSize(14);
  doc.setTextColor(17, 17, 17);
  doc.text('The Attention Trap: Why Broadcasting Fails & Conversations Win', margin + 6, 36);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.text('Posting links to empty rooms gets zero sales. Here is how modern algorithms actually treat text.', margin + 6, 42);

  // Core Principles
  let yPos = 54;
  const ch1Points = [
    { title: '1. Conversations Beat Broadcast Announcements', text: 'Beginners shout broadcast announcements: "New guide released!" Nobody owes an announcement a reply. A conversation hook gives your reader a low-barrier reason to stop, think, and comment.' },
    { title: '2. The Reply Multiplier: Comment Threads Drive Discovery', text: 'Platform distribution algorithms consistently favor active discussion threads over passive standalone broadcasts. Constructive comments under established industry voices introduce your profile to qualified readers.' },
    { title: '3. Keep Sales Links Out of the Main Post', text: 'Social media algorithms downrank posts containing external links. Post your full insight as high-value text first, and place your purchase link in your bio or as the first reply once engagement begins.' },
    { title: '4. Static Text & Screenshots Beat Video Hype for Digital Products', text: 'Buyers looking for templates, checklists, or professional consulting want fast clarity. A clean screenshot of a workflow or a simple text breakdown converts at a higher rate than a 15-second dancing reel.' },
    { title: '5. Community Relevance Over Vanity Follower Counts', text: 'You do not need 10,000 followers to make a great living. You need 50 to 100 engaged buyers who understand your exact value. Five real conversations a week beat 10,000 passive scrollers every time.' }
  ];

  ch1Points.forEach(pt => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(pt.title, margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(pt.text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 4.3) + 6;
  });

  // Action Box
  doc.setFillColor(254, 243, 199); // light amber
  doc.rect(margin, yPos, contentWidth, 38, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.rect(margin, yPos, contentWidth, 38, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(146, 64, 14);
  doc.text('DO THIS NOW · YOUR 5-MINUTE ACTION ITEM', margin + 6, yPos + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  const actionCh1 = [
    '• Open Threads, X, or LinkedIn and locate a respected voice in your specific niche.',
    '• Find a post with an active discussion. Add a genuine observation, a lesson learned, or a clarifying question.',
    '• Never drop your sales link in the comment. Let the quality of your insight drive people to tap your bio.',
    '• End of Chapter Outcome: Leave 1 value-packed reply under a respected account today.'
  ];
  let aY = yPos + 14;
  actionCh1.forEach(act => {
    doc.text(act, margin + 6, aY);
    aY += 5.5;
  });

  // Founder quote box
  yPos += 44;
  doc.setFillColor(17, 17, 17);
  doc.rect(margin, yPos, contentWidth, 22, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(210, 248, 3);
  doc.text('"Public comment sections function as an open portfolio of your thinking. When your contributions consistently solve micro-problems for others, buyers will naturally visit your profile to buy."', margin + 6, yPos + 8, { maxWidth: contentWidth - 12 });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('— BiasharaBase Publishing', margin + 6, yPos + 17);

  // ==========================================
  // PAGE 3: CHAPTER 02
  // ==========================================
  doc.addPage();
  drawPageChrome(3, 'Chapter 02 · The Positioning Formula');

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 20, contentWidth, 26, 'F');
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.8);
  doc.rect(margin, 20, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('CHAPTER 02 · 4 MIN SPRINT', margin + 6, 28);
  doc.setFontSize(14);
  doc.setTextColor(17, 17, 17);
  doc.text('The Positioning Formula: How to Write a Bio That Converts Strangers', margin + 6, 36);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.text('When a visitor taps your profile, you have exactly 3 seconds to prove you solve their problem.', margin + 6, 42);

  yPos = 54;
  const ch2Points = [
    { title: '1. Target One Exact Problem for One Exact Person', text: 'Generalists struggle to sell. When your profile claims to help "everyone achieve success", it resonates with nobody. When you help "freelancers close retainers" or "digital sellers organize customer orders", buying intent skyrockets immediately.' },
    { title: '2. Define the Tangible Result They Wake Up Wanting', text: 'People do not buy ebooks or spreadsheets; they buy hours saved, stress eliminated, or money earned. State the exact tangible transformation in plain words.' },
    { title: '3. Remove the Barrier They Dread the Most', text: 'Every industry has a major friction point that causes buyers to hesitate. State explicitly that your system bypasses that pain point (e.g., without complex coding, without dancing on video, without paid ads).' }
  ];

  ch2Points.forEach(pt => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(pt.title, margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(pt.text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 4.3) + 6;
  });

  // The T3 Positioning Formula Box
  doc.setFillColor(210, 248, 3); // neon yellow
  doc.rect(margin, yPos, contentWidth, 42, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(margin, yPos, contentWidth, 42, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('THE T3 POSITIONING FORMULA (COPY & FILL IN)', margin + 6, yPos + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('"I help [EXACT WHO] achieve [TANGIBLE WIN] without [DREADED OBSTACLE]."', margin + 6, yPos + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Example 1: "I help East African freelancers close high-paying international retainers without agency fees."', margin + 6, yPos + 26);
  doc.text('Example 2: "I teach digital product creators to sell templates using text & DMs without filming video reels."', margin + 6, yPos + 32);
  doc.text('Example 3: "I help boutique business owners balance their daily till & M-Pesa in under 10 minutes."', margin + 6, yPos + 38);

  yPos += 50;

  // Action Box
  doc.setFillColor(254, 243, 199);
  doc.rect(margin, yPos, contentWidth, 38, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.rect(margin, yPos, contentWidth, 38, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(146, 64, 14);
  doc.text('DO THIS NOW · DEPLOY YOUR CLARITY HOOK TONIGHT', margin + 6, yPos + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  const actionCh2 = [
    '• Draft your single-sentence bio using the T3 Formula above.',
    '• Read it aloud. If it sounds like corporate jargon, simplify it into casual conversational English.',
    '• Update your WhatsApp Business description, Threads bio, and Instagram header before tomorrow morning.',
    '• End of Chapter Outcome: Single-sentence hook deployed on all active customer-facing profiles.'
  ];
  aY = yPos + 14;
  actionCh2.forEach(act => {
    doc.text(act, margin + 6, aY);
    aY += 5.5;
  });

  // ==========================================
  // PAGE 4: CHAPTER 03
  // ==========================================
  doc.addPage();
  drawPageChrome(4, 'Chapter 03 · The 5 Text Archetypes');

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 20, contentWidth, 24, 'F');
  doc.setDrawColor(20, 20, 20);
  doc.rect(margin, 20, contentWidth, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('CHAPTER 03 · 6 MIN SPRINT', margin + 6, 27);
  doc.setFontSize(13);
  doc.setTextColor(17, 17, 17);
  doc.text('The 5 Text Archetypes: Posts That Trigger Buying Conversations', margin + 6, 35);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Stop staring at a blank screen. Every high-converting post falls into one of these 5 psychological models.', margin + 6, 40);

  yPos = 50;
  const archetypes = [
    { name: 'Archetype 1: The Hard-Learned Lesson (Mistake → Insight → Question)', desc: 'Share an early failure. Authentic vulnerability creates high trust: "In 2023 I spent 3 weeks building a product nobody wanted. Here is what I do differently now: [Lesson]. Have you made this mistake?"' },
    { name: 'Archetype 2: The Workflow Proof (Behind-The-Scenes Process)', desc: 'Show the mechanics of how you build your templates, organize spreadsheets, or solve client headaches. Real process builds 10x more trust than fake income claims.' },
    { name: 'Archetype 3: The Contrarian Truth (Challenging Bad Industry Advice)', desc: 'Call out a toxic myth that normal people hate: "The advice to post 5 video reels a day is burning creators out. Here is why high-trust text posts close 3x more sales."' },
    { name: 'Archetype 4: The Low-Friction Question (Easy Comment Triggers)', desc: 'Ask an open-ended question that takes under 10 seconds to answer: "Digital creators: do you prefer Notion or Google Sheets for tracking orders? Tell me why below."' },
    { name: 'Archetype 5: The Direct Weekly Offer (Clear Invitation to Buy)', desc: 'Once a week, invite your audience to purchase directly. State plainly who it is for, the problem it solves, the price, and where to order. Zero pressure, total clarity.' }
  ];

  archetypes.forEach(arc => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 20, 20);
    doc.text(arc.name, margin, yPos);
    yPos += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(arc.desc, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 4.2) + 5;
  });

  // Multi-platform distribution box
  doc.setFillColor(240, 249, 255); // light blue
  doc.rect(margin, yPos, contentWidth, 34, 'F');
  doc.setDrawColor(2, 132, 199);
  doc.rect(margin, yPos, contentWidth, 34, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(3, 105, 161);
  doc.text('THE MULTI-PLATFORM DISTRIBUTION RULE (ONE INSIGHT, 4 CHANNELS)', margin + 6, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(50, 50, 50);
  doc.text('1. Threads / X: Single punchy post with link in the first reply once engagement begins.', margin + 6, yPos + 12);
  doc.text('2. WhatsApp Status: 3-slide story sequence that drives direct private message replies.', margin + 6, yPos + 17);
  doc.text('3. Instagram: 3-slide high-contrast text carousel with clear CTA to send keyword in DM.', margin + 6, yPos + 22);
  doc.text('4. LinkedIn: Double-spaced professional case study with lessons learned.', margin + 6, yPos + 27);

  yPos += 40;
  // Action
  doc.setFillColor(254, 243, 199);
  doc.rect(margin, yPos, contentWidth, 30, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.rect(margin, yPos, contentWidth, 30, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14);
  doc.text('DO THIS NOW · WRITE TOMORROW MORNING\'S LESSON POST', margin + 6, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(50, 50, 50);
  doc.text('• Recall a mistake that cost you time or money when starting your digital product journey.', margin + 6, yPos + 12);
  doc.text('• Structure it using Archetype 1: What I did wrong → What I do today → What about you?', margin + 6, yPos + 17);
  doc.text('• Publish it tomorrow morning, then spend 15 minutes replying to every comment.', margin + 6, yPos + 22);

  // ==========================================
  // PAGE 5: CHAPTER 04
  // ==========================================
  doc.addPage();
  drawPageChrome(5, 'Chapter 04 · The 15-Minute Daily Rhythm');

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 20, contentWidth, 26, 'F');
  doc.setDrawColor(20, 20, 20);
  doc.rect(margin, 20, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('CHAPTER 04 · 4 MIN SPRINT', margin + 6, 28);
  doc.setFontSize(14);
  doc.setTextColor(17, 17, 17);
  doc.text('The 15-Minute Daily Rhythm: Generating Warm Leads Without Burnout', margin + 6, 36);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.text('A disciplined 15-minute daily engagement block beats 6 hours of endless scrolling every single time.', margin + 6, 42);

  yPos = 54;
  const ch4Points = [
    { title: '1. Set a Strict 15-Minute Countdown Timer', text: 'Treat engagement like a high-intensity workout. When the timer starts, your phone is a business tool. When it rings, you close the app. This prevents procrastination and social media fatigue.' },
    { title: '2. The 5-5-5 Rule for Focused Outreach', text: 'Spend 5 minutes answering every reply on your own posts, 5 minutes leaving thoughtful comments on peer creators, and 5 minutes responding to targeted questions in your niche communities.' },
    { title: '3. Never Pitch in Public Comment Sections', text: 'Comment sections are for demonstrating insight, not dropping affiliate links or spamming prices. When someone asks a deeper question, provide a generous answer and invite them to message you privately.' },
    { title: '4. The Transition from Public Comment to Private DM', text: 'When a public conversation reveals a genuine customer pain point, send a simple direct message: "Hey, saw your question about managing client orders. Sent you a quick tip here if helpful." No pitch, pure service.' }
  ];

  ch4Points.forEach(pt => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(pt.title, margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(pt.text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 4.3) + 6;
  });

  // Daily Schedule Breakdown Box
  doc.setFillColor(17, 17, 17);
  doc.rect(margin, yPos, contentWidth, 42, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(210, 248, 3);
  doc.text('THE 20-MINUTE DAILY DESK PROTOCOL', margin + 6, yPos + 8);

  const routine = [
    { block: '00-05 MIN', task: 'PUBLISH POST: Copy & paste queued Archetype post from your notes app.' },
    { block: '05-10 MIN', task: 'REPLY SPRINT: Respond thoughtfully to every incoming comment & quote.' },
    { block: '10-15 MIN', task: 'NICHE REPLIES: Leave 3 value-packed comments under peer creators.' },
    { block: '15-20 MIN', task: 'DM BRIDGING: Answer private WhatsApp/DM inquiries with payment links.' }
  ];
  let rY = yPos + 16;
  routine.forEach(r => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(210, 248, 3);
    doc.text(r.block, margin + 6, rY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(230, 230, 230);
    doc.text(r.task, margin + 28, rY);
    rY += 6;
  });

  yPos += 48;
  doc.setFillColor(254, 243, 199);
  doc.rect(margin, yPos, contentWidth, 30, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.rect(margin, yPos, contentWidth, 30, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14);
  doc.text('ACTION ITEM · START A 15-MINUTE TIMER TODAY', margin + 6, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(50, 50, 50);
  doc.text('• Use the built-in 15-Minute Timer inside The Quiet Sales Engine web app.', margin + 6, yPos + 12);
  doc.text('• Find 3 active posts where prospective buyers are asking questions.', margin + 6, yPos + 17);
  doc.text('• Provide helpful, experience-based answers without pitching anything.', margin + 6, yPos + 22);

  // ==========================================
  // PAGE 6: CHAPTER 05
  // ==========================================
  doc.addPage();
  drawPageChrome(6, 'Chapter 05 · The Conversation-to-Cash Protocol');

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 20, contentWidth, 26, 'F');
  doc.setDrawColor(20, 20, 20);
  doc.rect(margin, 20, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('CHAPTER 05 · 5 MIN SPRINT', margin + 6, 28);
  doc.setFontSize(14);
  doc.setTextColor(17, 17, 17);
  doc.text('The Conversation-to-Cash Protocol: Closing Orders in DMs & WhatsApp', margin + 6, 36);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.text('How to handle inquiries with genuine dignity, zero sleazy pressure, and frictionless checkout.', margin + 6, 42);

  yPos = 54;
  const ch5Points = [
    { title: '1. The 4-Step T3 Conversational Sequence', text: 'Follow this sequence: (1) Acknowledge their message warmly, (2) Diagnose their exact bottleneck, (3) Confirm if your product solves it, (4) Provide direct payment instructions.' },
    { title: '2. Answering "How Much Does This Cost?" Without Losing the Sale', text: 'Never respond with just a bare number. Answer with context: "The Quiet Sales Engine is TSh 25,000 ($10). That includes the complete 8-chapter guide, the 30-day template matrix, and our 3 interactive tools. Would you like me to send the checkout link?"' },
    { title: '3. Minimizing Checkout Friction Across Local & International Rails', text: 'Multi-step checkouts increase purchase drop-off. Providing immediate, familiar payment channels—such as direct Lipa Namba Till numbers (895896) or instant Card checkout ($10 USD)—ensures buyers can complete transactions seamlessly in under 30 seconds.' },
    { title: '4. The Respectful 24-Hour Follow-Up', text: 'If a buyer asked for payment instructions but did not complete the order, send one polite note the next morning: "Hey [Name], just checking if you were able to access the link, or if you had any questions?" Never send more than one follow-up.' }
  ];

  ch5Points.forEach(pt => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(pt.title, margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(pt.text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 4.3) + 6;
  });

  // WhatsApp Quick-Reply Swipe Card
  doc.setFillColor(210, 248, 3);
  doc.rect(margin, yPos, contentWidth, 40, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(margin, yPos, contentWidth, 40, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text('READY-TO-USE DM ORDER CLOSING SCRIPT', margin + 6, yPos + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  const swipeText = 'Hi [Name]! To get instant access to The Quiet Sales Engine:\n\n1. Send TSh 25,000 via M-Pesa / Tigo Pesa to: 0757 895 896 (SARAH KAPUYA)\n   OR use instant card checkout at: https://biasharabase.com ($10 USD)\n2. Reply here with your confirmation code\n3. I will immediately send your personal access key and direct unlock link!';
  doc.text(doc.splitTextToSize(swipeText, contentWidth - 12), margin + 6, yPos + 15);

  yPos += 46;
  doc.setFillColor(254, 243, 199);
  doc.rect(margin, yPos, contentWidth, 26, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.rect(margin, yPos, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14);
  doc.text('ACTION ITEM · SAVE SCRIPT TO WHATSAPP QUICK REPLIES', margin + 6, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(50, 50, 50);
  doc.text('• Open WhatsApp Business → Settings → Quick Replies.', margin + 6, yPos + 12);
  doc.text('• Save shortcut /order with your product details, price, and instant unlock instructions.', margin + 6, yPos + 17);

  // ==========================================
  // PAGE 7: CHAPTER 06
  // ==========================================
  doc.addPage();
  drawPageChrome(7, 'Chapter 06 · Zero-Camera Visual Proof');

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 20, contentWidth, 26, 'F');
  doc.setDrawColor(20, 20, 20);
  doc.rect(margin, 20, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('CHAPTER 06 · 4 MIN SPRINT', margin + 6, 28);
  doc.setFontSize(14);
  doc.setTextColor(17, 17, 17);
  doc.text('Zero-Camera Visual Proof: Graphics That Build Instant Customer Trust', margin + 6, 36);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.text('You do not need lighting or cameras. These 4 static assets generate higher conversion than video.', margin + 6, 42);

  yPos = 54;
  const ch6Points = [
    { title: '1. The High-Contrast Text Slide', text: 'A dark charcoal square with bold white text and neon highlighter accents stops scrollers immediately. It feels authoritative, clean, and takes under 3 minutes to produce.' },
    { title: '2. The Unedited Workflow Screenshot', text: 'Take a direct screenshot of your Notion dashboard, spreadsheet formulas, or prompt bank. Showing real work in progress proves you actually build the tools you sell.' },
    { title: '3. The Customer Message Snippet', text: 'A cropped screenshot of a genuine customer WhatsApp reply saying "Your template saved me 3 hours today" carries 10x more weight than any claims you can write about yourself.' },
    { title: '4. The 3D Digital Product Bundle Mockup', text: 'Digital products feel intangible. Presenting your curriculum, daily matrix, and toolkits as a visual bundle mockup gives the buyer immediate clarity on the immense value included.' }
  ];

  ch6Points.forEach(pt => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(pt.title, margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(pt.text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 4.3) + 6;
  });

  // Neo-Brutalist Visual Card
  doc.setFillColor(17, 17, 17);
  doc.rect(margin, yPos, contentWidth, 42, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(210, 248, 3);
  doc.text('THE 4 NON-CAMERA ASSETS CHECKLIST', margin + 6, yPos + 8);

  const assets = [
    '[  ] 1. One 1:1 square quote graphic with dark background and yellow accent text.',
    '[  ] 2. One unedited screenshot of your spreadsheet, template, or customer notes.',
    '[  ] 3. One cropped WhatsApp screenshot showing genuine customer feedback.',
    '[  ] 4. One product stack mockup displaying all deliverables in a single visual image.'
  ];
  let asY = yPos + 16;
  assets.forEach(a => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(230, 230, 230);
    doc.text(a, margin + 6, asY);
    asY += 6;
  });

  yPos += 48;
  doc.setFillColor(254, 243, 199);
  doc.rect(margin, yPos, contentWidth, 26, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.rect(margin, yPos, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14);
  doc.text('ACTION ITEM · CREATE ONE WORKFLOW PROOF ASSET', margin + 6, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(50, 50, 50);
  doc.text('• Take a screenshot of a template or customer chat on your screen.', margin + 6, yPos + 12);
  doc.text('• Pair it with an Archetype 2 post: "Behind the scenes of how we built this tool."', margin + 6, yPos + 17);

  // ==========================================
  // PAGE 8: CHAPTERS 07 & 08 + SPRINT CHECKLIST
  // ==========================================
  doc.addPage();
  drawPageChrome(8, 'Chapters 07 & 08 · Execution & Commerce Metrics');

  // Chapter 07 Summary
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 20, contentWidth, 22, 'F');
  doc.setDrawColor(20, 20, 20);
  doc.rect(margin, 20, contentWidth, 22, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 100, 100);
  doc.text('CHAPTER 07 · THE DUAL-TRACK EXECUTION MATRIX', margin + 6, 26);
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 17);
  doc.text('Track A: 25-Min Daily Sprint  vs  Track B: 2-Hour Weekend Batch', margin + 6, 33);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Choose Track A for rapid customer momentum, or Track B to build quietly alongside a full-time job.', margin + 6, 38);

  // Chapter 08 Summary (The 4 True Metrics)
  yPos = 46;
  doc.setFillColor(210, 248, 3);
  doc.rect(margin, yPos, contentWidth, 44, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(margin, yPos, contentWidth, 44, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text('CHAPTER 08 · THE 4 TRUE METRICS (IGNORE VANITY LIKES)', margin + 6, yPos + 8);

  const metrics = [
    { m: '1. POSTS PUBLISHED:', desc: 'Target 3-5 structured Archetype posts/week. The only input you 100% control.' },
    { m: '2. REPLIES LEFT:', desc: 'Target 30-50 thoughtful, value-first comments/week on peer & customer accounts.' },
    { m: '3. ACTIVE DM CONVERSATIONS:', desc: 'How many private chats did your posts spark? More chats = more sales.' },
    { m: '4. DIRECT PURCHASE ASKS:', desc: 'How many times did you clearly ask for the sale? Zero asks = zero revenue.' }
  ];

  let mY = yPos + 16;
  metrics.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(0, 0, 0);
    doc.text(item.m, margin + 6, mY);
    doc.setFont('helvetica', 'normal');
    doc.text(item.desc, margin + 50, mY);
    mY += 6.5;
  });

  // 7-Day Sprint Checklist Card
  yPos += 50;
  doc.setFillColor(17, 17, 17);
  doc.rect(margin, yPos, contentWidth, 74, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(210, 248, 3);
  doc.text('7-DAY DIGITAL PRODUCT LAUNCH SPRINT CHECKLIST', margin + 6, yPos + 8);

  const sprint = [
    { day: 'DAY 1: Bio & Positioning Hook', task: 'Deploy your single-sentence T3 hook on Threads, WhatsApp & IG.' },
    { day: 'DAY 2: First Hard-Learned Lesson', task: 'Publish Archetype 1 post sharing a real failure and actionable lesson.' },
    { day: 'DAY 3: Behind-The-Scenes Proof', task: 'Share an unedited screenshot of your template, notes, or workflow.' },
    { day: 'DAY 4: Low-Friction Question', task: 'Post an open-ended niche question & spend 20 minutes replying.' },
    { day: 'DAY 5: Direct Weekly Offer', task: 'Publish your direct invitation to buy with clear price & DM keyword.' },
    { day: 'DAY 6: Order Closing Sprint', task: 'Follow up on DM inquiries using the WhatsApp Quick-Reply script.' },
    { day: 'DAY 7: 4-Numbers Sunday Review', task: 'Log your weekly Posts, Replies, Convos, and Asks in the scorecard.' }
  ];

  let sY = yPos + 16;
  sprint.forEach(s => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(210, 248, 3);
    doc.text(s.day, margin + 6, sY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(230, 230, 230);
    doc.text(s.task, margin + 55, sY);
    sY += 8;
  });

  // Final Back-cover stamp
  yPos += 80;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text('THE QUIET SALES ENGINE · 100% OFFLINE REFERENCE MANUAL', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Deploy under your domain: biasharabase.com · Master License Override: BB-ADMIN-2025', margin, yPos + 5);

  // Output file
  const outputDir = path.join(__dirname, '../public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'The-Quiet-Sales-Engine-8-Chapters.pdf');
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(pdfPath, Buffer.from(pdfBytes));

  // Also duplicate to a simple lowercase name for convenience
  fs.writeFileSync(path.join(outputDir, 'the-quiet-sales-engine.pdf'), Buffer.from(pdfBytes));

  console.log('Successfully generated 8-page PDF at:', pdfPath);
  console.log('File size:', (fs.statSync(pdfPath).size / 1024).toFixed(2), 'KB');
}

createPdf();
