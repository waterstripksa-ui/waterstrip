/**
 * The reports page list: each report has a bilingual title and description,
 * plus two separate link lists — Arabic links (shown on the Arabic site) and
 * English links (shown on the English site). The link lists do not fall back to
 * each other: a report with no links in the page's language shows its title and
 * description only. A link's label is written in that list's language, so it
 * has no `xAr`/`xEn` pair.
 *
 * The page's heading and intro are interface copy in ui.ts (`t.reports`), not
 * part of this surface.
 */
import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { arText, enText, externalUrl, itemId } from './fields.ts';

const link = z.object({
  id: itemId,
  // Arabic or English depending on the list; arText is just required, trimmed text.
  label: arText(1, 120),
  url: externalUrl,
});

const report = z.object({
  id: itemId,
  titleAr: arText(1, 160),
  titleEn: enText(160),
  descriptionAr: arText(1, 600),
  descriptionEn: enText(600),
  linksAr: z.array(link).max(10),
  linksEn: z.array(link).max(10),
});

const v1 = z.object({
  items: z.array(report).max(30),
});

export type ReportLink = z.infer<typeof link>;
export type Report = z.infer<typeof report>;
export type ReportsList = z.infer<typeof v1>;

const MEWA_AR =
  'https://www.mewa.gov.sa/ar/Ministry/Agencies/AgencyForInnovation/Topics/Pages/InnovationintheWatersector.aspx';
const MEWA_EN =
  'https://www.mewa.gov.sa/en/Ministry/Agencies/AgencyLivestock/Topics/Pages/InnovationintheWatersector.aspx';

export const reportsList = defineSingleton<ReportsList>({
  key: 'reports_list',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    items: [
      {
        id: 'rp-roadmap',
        titleAr: 'تقرير خارطة تبني التقنيات',
        titleEn: 'Technology Adoption Roadmap report',
        descriptionAr:
          'تقرير خارطة تبني التقنيات في قطاع المياه، المتاح على موقع وزارة البيئة والمياه والزراعة.',
        descriptionEn:
          'The Technology Adoption Roadmap report for the water sector, available on the Ministry of Environment, Water and Agriculture website.',
        linksAr: [
          { id: 'rl-1', label: 'النسخة العربية', url: MEWA_AR },
          { id: 'rl-2', label: 'النسخة الإنجليزية', url: MEWA_EN },
        ],
        linksEn: [
          { id: 'rl-1', label: 'English version', url: MEWA_EN },
          { id: 'rl-2', label: 'Arabic version', url: MEWA_AR },
        ],
      },
    ],
  },
});
