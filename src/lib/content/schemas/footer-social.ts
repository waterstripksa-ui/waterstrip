import { z } from 'zod';
import { defineSingleton } from './types.ts';
import { socialUrl } from './fields.ts';

const v1 = z.object({
  xUrl: socialUrl,
  linkedinUrl: socialUrl,
});

export type FooterSocial = z.infer<typeof v1>;

export const footerSocial = defineSingleton<FooterSocial>({
  key: 'footer_social',
  version: 1,
  schema: v1,
  migrations: [],
  initial: {
    xUrl: '',
    linkedinUrl: '',
  },
});
