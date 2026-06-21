import type { Metadata } from 'next'
import { Box, Stack } from '@mui/material'
import { getLocale } from 'next-intl/server'
import { TextBody1Neutral60, TextCaptionNeutral60, TextH4Bold, TextH6Bold } from '@/shared/components'

export const metadata: Metadata = {
  title: 'Ochrana osobných údajov — MK Digital',
  description: 'Ako MK Digital s.r.o. spracúva osobné údaje z kontaktného formulára (GDPR, zákon č. 18/2018 Z. z.).',
}

const CONTACT_EMAIL = 'admin@mkdigital.sk'

interface Policy {
  title: string
  updated: string
  reviewNote: string
  sections: { h: string; body: string }[]
}

// Canonical Slovak version (the controller is a Slovak s.r.o.; Slovak law applies),
// with an English version for the other locales. Grounded in GDPR (Reg. 2016/679),
// the Slovak Act 18/2018 Coll. and Act 452/2021 Coll. § 109 (cookies).
// TODO before go-live: fill the controller's registered seat + IČO, and have it reviewed by a lawyer.
const SK: Policy = {
  title: 'Ochrana osobných údajov',
  updated: 'Účinné od: 20. júna 2026',
  reviewNote: 'Odporúčame dať tento dokument pred ostrým spustením skontrolovať advokátovi.',
  sections: [
    {
      h: '1. Prevádzkovateľ',
      body: `Prevádzkovateľom je MK Digital s. r. o., so sídlom Medená 15387/2, 974 05 Banská Bystrica, IČO 55 450 229, DIČ 2122015236, IČ DPH SK2122015236, zapísaná v Obchodnom registri Mestského súdu Banská Bystrica, oddiel Sro, vložka č. 47559/S, e-mail ${CONTACT_EMAIL}. Zodpovednú osobu (DPO) sme neurčili — pre náš rozsah spracúvania nie je povinná.`,
    },
    {
      h: '2. Aké údaje spracúvame',
      body: 'Pri použití kontaktného / projektového formulára spracúvame len to, čo nám pošlete: váš e-mail (povinný) a voliteľne meno alebo firmu, telefónne číslo, vybraný typ produktu a funkcie a vašu správu.',
    },
    {
      h: '3. Účel a právny základ',
      body: 'Údaje používame výlučne na prečítanie a zodpovedanie vášho dopytu a na vykonanie krokov na vašu žiadosť pred prípadným uzavretím zmluvy. Právny základ je čl. 6 ods. 1 písm. b) GDPR (predzmluvné vzťahy) a písm. f) GDPR (náš oprávnený záujem odpovedať vám). Údaje nepoužívame na marketing a nikdy ich nepredávame.',
    },
    {
      h: '4. Príjemcovia a prenos do tretej krajiny',
      body: 'Odoslanie formulára nám doručuje sprostredkovateľská služba Web3Forms, ktorá ho prepošle na náš e-mail; pri tom sa údaje môžu spracúvať aj mimo EÚ (USA). Iným tretím stranám údaje neposkytujeme. Plánujeme prejsť na vlastné riešenie v EÚ, ktoré tento prenos odstráni.',
    },
    {
      h: '5. Doba uchovávania',
      body: 'Váš dopyt uchovávame len po dobu nevyhnutnú na jeho vybavenie a prípadnú nadväznú komunikáciu, potom ho vymažeme.',
    },
    {
      h: '6. Cookies a úložisko prehliadača',
      body: 'Nepoužívame analytické, reklamné ani sledovacie cookies, preto nepotrebujeme cookie lištu. Ukladáme len funkčné nastavenia vo vašom prehliadači — jazyk (cookie) a tému a obmedzenie animácií (local storage) — podľa § 109 zákona č. 452/2021 Z. z. Tieto údaje vás neidentifikujú a neopúšťajú vaše zariadenie.',
    },
    {
      h: '7. Vaše práva',
      body: `Podľa GDPR (čl. 15–22) a zákona č. 18/2018 Z. z. máte právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracúvania, namietanie, prenosnosť a na odvolanie súhlasu. Uplatníte ich e-mailom na ${CONTACT_EMAIL}.`,
    },
    {
      h: '8. Právo podať sťažnosť',
      body: 'Máte právo podať návrh na začatie konania Úradu na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava, e-mail statny.dozor@pdp.gov.sk, web dataprotection.gov.sk.',
    },
    {
      h: '9. Dobrovoľnosť a automatizované rozhodovanie',
      body: 'Poskytnutie údajov je dobrovoľné; bez e-mailu vám však nevieme odpovedať. Nevykonávame automatizované rozhodovanie ani profilovanie.',
    },
  ],
}

const EN: Policy = {
  title: 'Privacy Policy',
  updated: 'Effective: 20 June 2026',
  reviewNote: 'We recommend a lawyer reviews this document before go-live.',
  sections: [
    {
      h: '1. Controller',
      body: `The controller is MK Digital s. r. o., registered seat Medená 15387/2, 974 05 Banská Bystrica, Slovakia, company ID (IČO) 55 450 229, tax ID (DIČ) 2122015236, VAT ID (IČ DPH) SK2122015236, registered in the Commercial Register of the City Court Banská Bystrica, section Sro, insert No. 47559/S, email ${CONTACT_EMAIL}. We have not appointed a Data Protection Officer — it is not mandatory for our scope of processing.`,
    },
    {
      h: '2. What we collect',
      body: 'When you use the contact / project form we process only what you send: your email (required), and optionally your name or company, phone number, the product type and features you selected, and your message.',
    },
    {
      h: '3. Purpose & legal basis',
      body: 'We use this only to read and answer your enquiry and to take steps at your request before a possible contract. The legal basis is Art. 6(1)(b) GDPR (pre-contractual steps) and Art. 6(1)(f) GDPR (our legitimate interest in replying). We do not use your data for marketing and never sell it.',
    },
    {
      h: '4. Recipients & international transfer',
      body: 'The form is delivered to us by Web3Forms, a processor that forwards your submission to our email; in doing so data may be processed outside the EU (USA). We do not share your data with anyone else. We plan to move to our own EU-based solution, which removes this transfer.',
    },
    { h: '5. Retention', body: 'We keep your enquiry only as long as needed to handle it and any follow-up, then delete it.' },
    {
      h: '6. Cookies & browser storage',
      body: 'We use no analytics, advertising, or tracking cookies, so no cookie banner is needed. We store only functional preferences in your browser — your language (cookie) and your theme and reduced-motion settings (local storage) — under § 109 of Act 452/2021 Coll. None of this identifies you or leaves your device.',
    },
    {
      h: '7. Your rights',
      body: `Under the GDPR (Art. 15–22) and Act 18/2018 Coll. you can request access, rectification, erasure, restriction, objection, portability, and withdraw consent. Exercise them by emailing ${CONTACT_EMAIL}.`,
    },
    {
      h: '8. Right to complain',
      body: 'You have the right to lodge a complaint with the Office for Personal Data Protection of the Slovak Republic, Hraničná 12, 820 07 Bratislava, email statny.dozor@pdp.gov.sk, dataprotection.gov.sk.',
    },
    {
      h: '9. Voluntariness & automated decisions',
      body: 'Providing your data is voluntary; without an email we cannot reply. We do not carry out automated decision-making or profiling.',
    },
  ],
}

export default async function PrivacyPage() {
  const locale = await getLocale()
  const p = locale.startsWith('sk') ? SK : EN

  return (
    <Box component="main" sx={{ maxWidth: 880, mx: 'auto', px: 3, py: { xs: 4, md: 6 } }}>
      <TextH4Bold sx={{ mb: 1 }}>{p.title}</TextH4Bold>
      <Box sx={{ mb: 4 }}>
        <TextCaptionNeutral60>{p.updated}</TextCaptionNeutral60>
      </Box>

      <Stack spacing={3}>
        {p.sections.map((section) => (
          <Box key={section.h}>
            <TextH6Bold sx={{ mb: 1 }}>{section.h}</TextH6Bold>
            <TextBody1Neutral60>{section.body}</TextBody1Neutral60>
          </Box>
        ))}

        <Box sx={{ pt: 2 }}>
          <TextCaptionNeutral60>{p.reviewNote}</TextCaptionNeutral60>
        </Box>
      </Stack>
    </Box>
  )
}
