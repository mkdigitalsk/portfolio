// AUTO-GENERATED scaffold spec from the 112-site research blueprint (see portfolio-research.md).
// Each entry is a homepage section in final order. The flip-card section renders the real
// (demoted) <AppShowcase>; every other section renders <ScaffoldSection>, which shows its brief
// on screen until it's built for real. Replace scaffolds one by one with real implementations.

export interface HomeSectionSpec {
  id: string
  title: string
  purpose: string
  recommended: string
  embed?: 'showcase'
  status: 'scaffold' | 'embedded'
}

export const HOME_SECTIONS: HomeSectionSpec[] = [
  {
    id: 'hero-outcome-in-view-proof',
    title: `Hero (outcome + in-view proof)`,
    purpose: `Convert the first viewport from 'impressive demo' to 'trustworthy partner' by leading with what the client GETS and proving credibility before any scroll.`,
    recommended: `Outcome-led headline, NOT a service list and NOT the current slogan. Use a sharpened version of the buried hero.* copy: e.g. 'Your product, shipped end-to-end — and on time.' or 'One senior partner. Mobile, web, and backend. Built once, properly.' Sub: one staccato line that owns the solo-senior angle the data rewards (category ownership): 'iOS, Android, web and backend — the same production patterns I use on real client work, delivered by one accountable engineer, not a hand-off chain.' One single primary CTA in-view: 'Let's talk' (mailto already wired to mk.digital.sro@gmail.com). CRITICAL — embed hard proof on this same screen since you have no client logos: a metric/trust trio calibrated to a solo NDA studio — e.g. (1) 'Reply within 24h' (you already promise this in the web app locale), (2) '4 open-source showcase apps — inspect the actual code', (3) a third-party signal once available (Clutch/G2 review badge, or 'X yrs shipping production apps'). The flip-card grid moves DOWN; it must not be the first and only thing.`,
    // scaffold
    status: 'scaffold',
  },
  {
    id: 'trust-metrics-band',
    title: `Trust / metrics band`,
    purpose: `Fast-scan reassurance strip — the synthesis shows a metrics band high on the page correlates almost perfectly with 8-9 scores and reframes a solo studio's longevity/availability as a client outcome.`,
    recommended: `A horizontal strip directly under the hero: years shipping production apps · platforms covered (iOS · Android · Web · Backend) · '24h response' · 'Open-source codebase, MIT-licensed, fully inspectable' · 'GDPR-compliant, SK-registered s.r.o.' Frame availability as the partnership win solo studios own: 'One client at a time — full focus, no junior hand-off.' (matches your low-volume sequential-client model). Add a Clutch/G2 score the moment you have one review.`,
    // scaffold
    status: 'scaffold',
  },
  {
    id: 'services-as-3-4-named-lifecycle-',
    title: `Services as 3-4 named, lifecycle pillars + engagement model`,
    purpose: `Replace the implicit 'I do everything' read (and the developer-framed 'app types') with an intentional, scannable taxonomy that signals focus and sales maturity.`,
    recommended: `Three lifecycle pillars mirroring buyer mental model — Strategy & Scoping → Design & Build → Launch & Iterate — with AI elevated as a first-class capability inside Build (table-stakes in 2025/26 per synthesis). Each card: outcome one-liner + one mini-credential (e.g. Build: 'KMP-shared logic across iOS, Android and web — one codebase, fewer bugs, lower cost; see the open-source proof'). THEN the differentiator the synthesis rewards for boutiques: frame the RELATIONSHIP as an engagement model, not a package menu — 'Full product partner (idea → live, end-to-end)' vs 'Embedded senior engineer (augment your team).' Deep-link each pillar to detail later; ship overview first.`,
    // scaffold
    status: 'scaffold',
  },
  {
    id: 'the-flip-card-watch-it-come-to-l',
    title: `The flip-card 'watch it come to life' craft demo`,
    purpose: `Keep your strongest asset — but re-cast it from 'the homepage' to a PROOF module that demonstrates craft (the MetaLab/STRV move: the medium is the proof), wired into the lead funnel.`,
    recommended: `Keep AppShowcase.tsx grid and the /app/[id] feature-picker→lead-form flow exactly as built — it is best-in-class. Re-frame its heading from developer 'app types' to client outcome: 'See the kind of product you could ship — pick a type, watch it come to life, then tell me what yours needs.' This becomes section 4, not section 1. The live per-app preview animations ARE craft proof; label them as such ('built with the same components I ship to production').`,
    embed: 'showcase',
    status: 'embedded',
  },
  {
    id: 'how-i-work-opinionated-process-p',
    title: `How I work — opinionated process + productized first step`,
    purpose: `The synthesis is explicit: for boutique/solo brands, process transparency and a low-risk productized discovery substitute for client logos and directly de-risk the buyer. This is your single highest-leverage NDA-compatible trust builder.`,
    recommended: `Differentiate on MECHANICS, not generic Discover→Design→Build phase names. State cadence and reality of working with you: weekly demos, direct access to the engineer (no account manager), 1-2 week iteration cycles, transparent repo access. Attach TIME to phases (procurement confidence): e.g. 'Free scoping call → fixed-scope proposal in 48h → first working build in week 2.' Productize the entry point (Sudolabs/Etyka pattern): a named, low-commitment first step — 'Free 30-min product scoping + a written fixed-scope estimate, no obligation.' Add a risk-reversal line you can credibly own as a focused solo studio (Etyka's 'on time, guaranteed' is the highest-converting ownable claim): e.g. 'Fixed scope, fixed price, fixed date — agreed before a line of code.'`,
    // scaffold
    status: 'scaffold',
  },
  {
    id: 'proof-spine-open-source-showcase',
    title: `Proof spine — open-source showcases as quantified case studies`,
    purpose: `Your NDA-safe proof axis. The synthesis says portfolio-as-proof + per-project quantified outcomes is what 9-scorers have and 6-7s lack. You cannot quantify client revenue, so quantify the ARTIFACT and the engineering rigor — a proof type almost no agency can match because their code is closed.`,
    recommended: `Promote the /about ShowcaseList to a first-class homepage 'Proof' section. For each of the 4 showcases (kmp-showcase, android-showcase, rn-showcase, web) write a mini case-study card with INSPECTABLE numbers: platforms shipped, lines of shared logic, test coverage %, CI/CD pipeline, architecture (Clean/MVVM), 'X commits, fully public git history.' Add a GitHub stars/commits signal. Frame: 'Most studios ask you to trust closed code. Mine is open — read every line before you hire me.' This converts the NDA constraint into a unique trust advantage.`,
    // scaffold
    status: 'scaffold',
  },
  {
    id: 'testimonials-human-attribution',
    title: `Testimonials / human attribution`,
    purpose: `Synthesis: anonymous = no proof; one attributed, number-bearing quote outweighs a wall of praise. Even under NDA you can gather attributable voices that don't name the end-client's product.`,
    recommended: `Pursue: (a) a Clutch/G2 review (third-party, verifiable — the synthesis ranks this as the SMB buyer's strongest trigger) from any past client willing to review the WORKING RELATIONSHIP without naming their product; (b) LinkedIn recommendations with name + role + photo (NDA-safe — they vouch for you, not disclose the client); (c) a peer/collaborator testimonial. Each must have name, role, photo, and ideally a number ('delivered on time', 'shipped in 8 weeks'). Until you have one, do NOT fake it — use the open-source proof and process as the trust load-bearer.`,
    // scaffold
    status: 'scaffold',
  },
  {
    id: 'about-the-person-you-hire',
    title: `About / the-person-you-hire`,
    purpose: `For a solo studio the founder IS the de-risking story; buyers handing budget to one person need to trust that person specifically.`,
    recommended: `Tighten the existing /about into a confident senior-engineer narrative: years in production app delivery, the kind of clients/domains (NDA-safe categories: fintech, e-commerce, etc. — which your app grid already implies), why solo-and-senior beats an agency hand-off chain for their project, the tech stack (already strong), and a real photo. Keep TechStack but lead with outcomes, not the tag cloud.`,
    // scaffold
    status: 'scaffold',
  },
  {
    id: 'final-cta-contact',
    title: `Final CTA + contact`,
    purpose: `Close. Synthesis: one clear action, response-time reassurance, low friction.`,
    recommended: `Repeat the primary CTA with the risk-reversal and response promise: 'Tell me what you're building — free scoping call, written estimate in 48h, reply within 24h.' Keep mail + WhatsApp + LinkedIn (already wired). Surface the GDPR/privacy link (you already have a SK-law-grounded policy — that's a trust asset, show it).`,
    // scaffold
    status: 'scaffold',
  },
]
