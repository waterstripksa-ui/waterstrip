# SAFTA legacy key map

The field-by-field mapping from SAFTA's current content to the new content model. It is the source
for two things in the [port plan](safta-port.md): the singleton and table schemas written in Phase 2,
and the `MAP` table inside `scripts/import-legacy.ts` in Phase 4.

Built from SAFTA commit `76ac788` and its local `content/`. **Re-check it against the production
snapshot before cutover.** The import enforces this map, so it fails on any key the map doesn't
list.

## How to read it

- **Legacy keys are shortened to their prefix.** `index:t005` means the key in `content/index.json`
  that starts with `t005-`. Prefixes are unique within each file (checked). The `t…` prefix is text,
  `i…` an image and `p…` a placeholder attribute.
- **A text key fills two fields.** Its `ar` goes to `<field>Ar` and its `en` to `<field>En`. So
  `heading ← index:t005` means `headingAr ← ar` and `headingEn ← en`.
- **`(new)`** marks a field with no legacy source. Its seed value comes from the current markup,
  which is quoted in the row.
- **`=` checks** mark legacy keys that only duplicate another key. The import asserts that the two
  are equal and then drops the duplicate. If they differ, the import fails and someone decides.
- Every target singleton is **version 1** with no migrations. SAFTA's database starts fresh, so the
  `addEnFields` step and waterstrip's migration history are not needed.

## Rules for every value

1. **Decode entities.** `&amp;` and `&nbsp;` appear in 22 strings, rendered today through `set:html`.
   Fields are plain text from now on, so decode them (`&amp;` to `&`, `&nbsp;` to a normal space).
2. **Tags fail the import** unless the row below says what to do with them. Only four keys hold tags.
   - `contact:t004`, `t006`, `t011` and `t013` end in `<b class="req">*</b>`, the required-field
     marker. See the [required markers decision](#decisions-taken-in-this-map).
   - `register-interest:t031` contains two links and becomes prose: `[Terms & Conditions](/terms)`.
   - `technologies.js:t007` contains `<b>Source:</b>` and becomes prose: `**Source:** …`.
3. **Images.** Every non-empty path is imported as media, whether it is under `uploads/` or under
   `assets/img/`; see [Images](#images).
4. **Empty Arabic text fails** unless the row marks the field optional. The only empty values today
   are the YouTube link and the quote and attribution on 5 of the 7 articles, and all of those are
   optional.
5. **Known content fixes** are applied from an explicit `FIXES` list, and only when the stored value
   still matches the old value exactly:

   | Key | Old value | New value |
   |---|---|---|
   | `contact:t002` (ar) | `تواصل معنا kuyiky` | `تواصل معنا` |

---

## Page singletons

### Home: `index.json` (40 keys)

| Target | Legacy | Notes |
|---|---|---|
| `home_hero.panels[0].imageId` | `index:i001` | Alt text `""`, so the image is decorative. |
| `home_hero.panels[0].eyebrow` | `index:t004` | Also the carousel tab label. |
| `home_hero.panels[0].heading` | `index:t005` | The page's `h1`. |
| `home_hero.panels[0].ctaLabel` | `index:t006` | |
| `home_hero.panels[0].ctaHref` | (new) | `/about` |
| `home_hero.panels[1].imageId` | `index:i002` | |
| `home_hero.panels[1].eyebrow` | `index:t007` | |
| `home_hero.panels[1].heading` | `index:t008` | |
| `home_hero.panels[1].ctaLabel` | `index:t009` | |
| `home_hero.panels[1].ctaHref` | (new) | `/members` |
| `home_hero.panels[2].imageId` | `index:i003` | |
| `home_hero.panels[2].eyebrow` | `index:t010` | |
| `home_hero.panels[2].heading` | `index:t011` | |
| `home_hero.panels[2].ctaLabel` | `index:t012` | Key says "سجّل اهتمامك" but the value is "اعرف المزيد / Learn more". |
| `home_hero.panels[2].ctaHref` | (new) | `/media` |
| dropped | `index:t013` `t014` `t015` | Tab labels. Each must `=` the eyebrow of its panel (`t004`, `t007`, `t010`), as in waterstrip. |
| `home_discover.eyebrow` | `index:t016` | |
| `home_discover.intro` | `index:t017` | |
| `home_discover.tiles[0].imageId` | `index:i018` | Alt is "Open raceway ponds…" in **both** `alt` and `alt_ar`, so it is English only: `altEn` gets it. `altAr` is required on a media row, so the import needs Arabic alt text here: write it into `FIXES`. |
| `home_discover.tiles[0].eyebrow` | `index:t019` | |
| `home_discover.tiles[0].heading` | `index:t020` | |
| `home_discover.tiles[0].href` | (new) | `/technologies` |
| `home_discover.tiles[1].imageId` | `index:i021` | Alt is "What we do" in both, handled the same way (the tile's eyebrow "ما نقوم به" fits). |
| `home_discover.tiles[1].eyebrow` | `index:t022` | |
| `home_discover.tiles[1].heading` | `index:t023` | |
| `home_discover.tiles[1].href` | (new) | `/about` |
| `home_challenges_intro.eyebrow` | `index:t024` | The cards come from the [`challenges`](#challenges-singleton) list. |
| `home_challenges_intro.heading` | `index:t025` | |
| `home_awards.hidden` | `settings.json:hideAwards` | `false` when the file is missing (it is missing locally). |
| `home_awards.soonLabel` | `index:t041` | |
| `home_awards.eyebrow` | `index:t045` | |
| `home_awards.heading` | `index:t046` | |
| `home_awards.lede` | `index:t047` | |
| `home_awards.ctaLabel` | `index:t048` | Its link stays `/register-interest` in the markup. |
| `home_awards.categories[0..4].title` | `index:t049` `t051` `t053` `t055` `t057` | A list, min 1 and max 12. The number shown (`01`…) is its position. |
| `home_awards.categories[0..4].description` | `index:t050` `t052` `t054` `t056` `t058` | |

The partner strip under the home page is the [`home_partners`](#partners--home_partnersitems) list.
Its label and note are hardcoded today and stay that way until [After cutover](safta-port.md#after-cutover).

### About: `about.json` (28 keys)

| Target | Legacy | Notes |
|---|---|---|
| `ui.ts` `crumbHome` | `about:t001` | Interface copy. See the [Home crumb](#the-home-crumb). |
| `about_hero.title` | `about:t002` | |
| `about_hero.lede` | `about:t003` | |
| `about_mission.eyebrow` | `about:t004` | Decode `&amp;`. |
| `about_mission.heading` | `about:t005` | |
| `about_mission.paragraphs[0..1]` | `about:t006` `t007` | A list, min 1 and max 4. |
| `about_mission.youtubeUrl` | `about:t008` (en) | Optional. The `ar` value must be empty or `=` the `en` one. Validated as a YouTube URL. |
| `about_glance.hidden` | (new) | `true`, replacing the hardcoded `hidden` attribute. |
| `about_glance.soon` | `about:t011` | The tape mixes both languages and mirrors on the switch: "Soon · قريبًا · …" in English, "قريبًا · Soon · …" in Arabic. |
| dropped | `about:t012` `t013` `t014` | `t013` `=` `t011`. `t012` and `t014` are `t011` with the languages swapped, which is how the tape mixes both, and is not a bug. The markup renders the tape from `soon` alone, swapping it for the 2nd and 4th words. |
| `about_glance.heading` | `about:t015` | |
| `about_glance.stats[0..3].label` | `about:t016`…`t019` | |
| `about_glance.stats[0..3].value` | (new) | `24`, `4`, `4`, `3`, from `data-count` in the markup. |
| `about_roles.eyebrow` | `about:t039` | Items: [`roles`](#roles--about_rolesitems). |
| `about_roles.heading` | `about:t040` | |
| `about_roles.lede` | `about:t041` | |
| `about_challenges_intro.eyebrow` | `about:t020` | The cards come from the [`challenges`](#challenges-singleton) list. |
| `about_challenges_intro.heading` | `about:t021` | |
| `about_challenges_intro.lede` | `about:t022` | |
| dropped | `about:t023` | "See the working groups". Not on any page. |
| `about_founding_statement.imageId` | `about:i050` | `ph-membership.svg`, rasterized. |
| `about_founding_statement.eyebrow` | `about:t051` | |
| `about_founding_statement.quote` | `about:t052` | |
| `about_founding_statement.ctaLabel` | `about:t053` | Its link stays `/members`. |

### Working groups page: `public/assets/content/technologies.js` (7 keys)

Read from the `.js` file, **not** `content/technologies.json`, which no page reads.

| Target | Legacy | Notes |
|---|---|---|
| `ui.ts` `crumbHome` | `technologies.js:t001` | |
| `technologies_banner.title` | `technologies.js:t002` | |
| `technologies_banner.lede` | `technologies.js:t003` | |
| `technologies_intro.eyebrow` | `technologies.js:t004` | |
| `technologies_intro.heading` | `technologies.js:t005` | |
| `technologies_intro.lede` | `technologies.js:t006` | |
| `technologies_intro.sourceNote` | `technologies.js:t007` | Prose. `<b data-ar=…>Source:</b>` becomes `**Source:**`. |

The cards come from the [`working_group`](#groups--working_group) table.

### Media: `media.json` (15 keys)

| Target | Legacy | Notes |
|---|---|---|
| `ui.ts` `crumbHome` | `media:t001` | |
| `media_banner.title` | `media:t002` | |
| `media_banner.lede` | `media:t003` | |
| dropped | `media:i005`…`t016` (12 keys) | Four static news cards from before `articles` became a collection. No page reads them, and the same stories are in `articles.json`. |

The News and Events tab labels are hardcoded `data-ar` attributes today and stay that way.

### Article page: `public/assets/content/article.js` (5 keys)

Read from the `.js` file, **not** `content/article.json`.

| Target | Legacy | Notes |
|---|---|---|
| `article_chrome.defaultImageId` | `article.js:i001` | The hero shown when an article has no image. |
| `ui.ts` `crumbHome` | `article.js:t002` | |
| `article_chrome.crumbMedia` | `article.js:t003` | |
| `article_chrome.backLabel` | `article.js:t004` | |
| `article_chrome.registerLabel` | `article.js:t005` | |

### Members page: `members-page.json` (6 keys)

| Target | Legacy | Notes |
|---|---|---|
| `ui.ts` `crumbHome` | `members-page:t001` | |
| `members_banner.title` | `members-page:t002` | |
| `members_banner.lede` | `members-page:t003` | |
| `members_intro.eyebrow` | `members-page:t004` | |
| `members_intro.heading` | `members-page:t005` | |
| `members_intro.lede` | `members-page:t006` | |
| `members_map.heading`, `.lede`, `.sourceNote` | (new) | Text for the rebuilt `.memmap` block. It has never been shown, so there is nothing to carry over; write it in Phase 3. Legend labels come from the [member category](#members--member) set. |

### Member profile: `member.json` (16 keys)

| Target | Legacy | Notes |
|---|---|---|
| `ui.ts` `crumbHome` | `member:t001` | |
| `member_chrome.crumbMembers` | `member:t002` | |
| `member_chrome.title` | `member:t003` | |
| `member_chrome.roleLabel` | `member:t007` | |
| `member_chrome.sectorLabel` | `member:t009` | |
| `member_chrome.sinceLabel` | `member:t011` | |
| `member_chrome.overviewHeading` | `member:t012` | |
| `member_chrome.collaborationHeading` | `member:t013` | |
| `member_chrome.collaborationItems[0..2]` | `member:t014` `t015` `t016` | A list, max 6. The same on every profile, as it is today. |
| `member_chrome.contactEyebrow` | `member:t017` | |
| `member_chrome.contactHeading` | `member:t018` | |
| `member_chrome.contactText` | `member:t019` | |
| `member_chrome.contactCtaLabel` | `member:t020` | |
| `member_chrome.contactEmail` | (new) | `info@safta.sa` |
| `member_chrome.backLabel` | `member:t021` | |

### Contact: `contact.json` (60 keys)

| Target | Legacy | Notes |
|---|---|---|
| `ui.ts` `crumbHome` | `contact:t001` | |
| `contact_hero.title` | `contact:t002` | Has a `FIXES` entry. |
| `contact_hero.lede` | `contact:t003` | |
| `contact_form.nameLabel` | `contact:t004` | Strip the `req` marker. |
| `contact_form.namePlaceholder` | `contact:p005` | |
| `contact_form.emailLabel` | `contact:t006` | Strip the `req` marker. |
| `contact_form.emailPlaceholder` | `contact:p007` | |
| `contact_form.phoneLabel` | `contact:t008` | |
| `contact_form.phoneHint` | `contact:t009` | |
| `contact_form.phonePlaceholder` | `contact:p010` | |
| `contact_form.companyLabel` | `contact:t011` | Strip the `req` marker. |
| `contact_form.companyPlaceholder` | `contact:p012` | |
| `contact_form.sectorLabel` | `contact:t013` | Strip the `req` marker. |
| `contact_form.sectorPrompt` | `contact:t014` | The empty first option. |
| `contact_form.sectorOptions[0..13].label` | `contact:t015`…`t028` | See [Select options](#select-options). |
| `contact_form.countryLabel` | `contact:t032` | |
| `contact_form.countryPrompt` | `contact:t033` | |
| `contact_form.countryOptions[0..17].label` | `contact:t034`…`t051` | |
| `contact_form.submitLabel` | `contact:t059` | |
| `contact_form.successMessage` | `contact:t060` | |
| `contact_info.heading` | `contact:t061` | |
| `contact_info.lede` | `contact:t062` | |
| `contact_info.generalLabel` | `contact:t063` | |
| `contact_info.email` | (new) | `info@safta.sa` |
| `contact_info.membershipLabel` | `contact:t064` | |
| `contact_info.membershipLinkLabel` | `contact:t065` | Its link stays `/register-interest`. |
| `contact_info.mediaLabel` | `contact:t066` | |
| `contact_info.mediaLinkLabel` | `contact:t067` | Its link stays `/media`. |
| `contact_info.responseLabel` | `contact:t068` | |
| `contact_info.responseText` | `contact:t069` | |
| `contact_info.followLabel` | `contact:t070` | The LinkedIn and X links stay hardcoded until `footer_social` exists. |

### Register interest: `register-interest.json` (44 keys)

| Target | Legacy | Notes |
|---|---|---|
| `ui.ts` `crumbHome` | `register-interest:t001` | |
| `register_hero.title` | `register-interest:t002` | |
| `register_hero.lede` | `register-interest:t003` | |
| `register_form.nameLabel` | `register-interest:t004` | Strip the trailing ` *`. |
| `register_form.entityLabel` | `register-interest:t005` | Strip ` *`. |
| `register_form.entityTypeLabel` | `register-interest:t006` | Strip ` *`. |
| `register_form.entityTypePrompt` | `register-interest:t007` | |
| `register_form.entityTypeOptions[0..4].label` | `register-interest:t008`…`t012` | |
| `register_form.emailLabel` | `register-interest:t013` | Strip ` *`. |
| `register_form.phoneLabel` | `register-interest:t014` | |
| `register_form.websiteLabel` | `register-interest:t015` | |
| `register_form.websitePlaceholder` | `register-interest:p016` | |
| `register_form.areaLabel` | `register-interest:t017` | Strip ` *`. |
| `register_form.areaPrompt` | `register-interest:t018` | |
| `register_form.areaOptions[0..5].label` | `register-interest:t019`…`t024` | |
| `register_form.areaHint` | `register-interest:t025` | |
| `register_form.messageLabel` | `register-interest:t026` | |
| `register_form.portfolioLabel` | `register-interest:t027` | |
| `register_form.portfolioHint` | `register-interest:t028` | |
| `register_form.chooseFileLabel` | `register-interest:t029` | |
| `register_form.noFileLabel` | `register-interest:t030` | |
| `register_form.consent` | `register-interest:t031` | Prose. The links become `[…](/terms)` and `[…](/privacy)`, and the inline `style` is dropped. Render through `renderProse` with `localizePath` as `mapHref`, because the links lack the `/en` or `/ar` prefix today. |
| `register_form.submitLabel` | `register-interest:t032` | |
| `register_form.successMessage` | `register-interest:t033` | |
| `register_info.heading` | `register-interest:t034` | |
| `register_info.lede` | `register-interest:t035` | |
| `register_info.steps[0..3].title` | `register-interest:t036` `t038` `t040` `t042` | A list, min 1 and max 6. The number is its position. |
| `register_info.steps[0..3].text` | `register-interest:t037` `t039` `t041` `t043` | |
| `register_info.questionsLabel` | `register-interest:t044` | |
| `register_info.email` | (new) | `info@safta.sa` |

### Not imported

| File | Why |
|---|---|
| `content/technologies.json`, `content/article.json` | No page reads them. Their live text is in `public/assets/content/*.js`, mapped above. |
| `content/working-group.json` (12 keys) | Belongs to the detail page that was deleted. |
| `content/*.bak` | Backups written by the repair scripts. |

---

## Collections

Every collection is an object keyed by record id. Unless a row says otherwise:

- `slug` comes from the id;
- `order` comes from the record's position in the JSON;
- `published` is `true`;
- `id` comes from the record id when the target is a list inside a singleton.

### `members` → `member`

| Column | Legacy | Notes |
|---|---|---|
| `nameAr/En` | `name` | Decode `&amp;` (5 records). |
| `logoId` | `logo.src` | 3 PNG and 9 SVG, all under `assets/img/partners/`. Alt text is the name. |
| `initials` | `ini` | Shown when there is no logo. |
| `category` | `cat` | A fixed set: `government`, `academic`, `private`, `nonprofit`, matched from `cat.en` (`Government`, `Academic`, `Private sector`, `Non-profit`). Fail on any other value, and fail if `cat.ar` isn't the fixed Arabic label for that category. The labels live in `ui.ts`. |
| `roleAr/En` | `role` | |
| `sectorAr/En` | `sector` | Decode `&amp;`. |
| `since` | `since` | Text such as `2026`. |
| `bioAr/En` | `bio` | |
| dropped | `short` | English only, and never rendered. See the [decisions](#decisions-taken-in-this-map). |
| `lat`, `lng` | `members-map-data.js` `lat`, `lng` | Matched by `id`. Nullable. Also check that the file's `ini` and `cat` agree with the member record. |
| `cityAr/En` | `members-map-data.js` `city_ar`, `city` | |
| `countryAr/En` | `members-map-data.js` `country_ar`, `country` | |

### `groups` → `working_group`

| Column | Legacy | Notes |
|---|---|---|
| `nameAr/En` | `name` | Decode `&amp;` (`traceability`). |
| `scopeAr/En` | `scope` | |
| `imageId` | `img.src` | All 9 are `""` today, so `null`, which renders the themed icon tile. |
| `number` | `no` | Text such as `01`. |
| `challenge` | `ch` | A fixed set: `pests`, `waste`, `climate`, `soil`. It picks the tile's colour. |

The tile icons stay keyed by slug in code, as they are now.

### `articles` → `article`

| Column | Legacy | Notes |
|---|---|---|
| `kindAr/En` | `kind` | |
| `dateAr/En` | `date` | Free text such as "July 28, 2026". Not parsed. |
| `readTimeAr/En` | `read` | |
| `imageId` | `img.src` | 6 placeholder SVGs and 1 WebP. When it is `null`, the page uses `article_chrome.defaultImageId`. |
| `titleAr/En` | `title` | |
| `ledeAr/En` | `lede` | |
| `blocks[].headingAr/En` | `body[].h` | A real list (min 1, max 20), so paragraphs can now be added. |
| `blocks[].bodyAr/En` | `body[].p` | |
| `quoteAr/En` | `quote` | Optional. Empty on 5 records. |
| `quoteByAr/En` | `quoteBy` | Optional. |
| `tags[].labelAr/En` | `tags[]` | A list, max 6. |
| dropped | `ph` | Only a dashboard label ("sample data"); the site never reads it. |

### `events` → `event`

| Column | Legacy | Notes |
|---|---|---|
| `day` | `day` | Text such as `18`. |
| `monthAr/En` | `month` | Such as "SEP 2026". |
| `titleAr/En` | `title` | |
| `descriptionAr/En` | `desc` | |
| `href` | `link` | A site path (localized when rendered) or an `https://` URL. It blocks `javascript:` and similar, like `safeHref` today. All 4 hold `/register-interest`. |

### `roles` → `about_roles.items`

| Field | Legacy |
|---|---|
| `titleAr/En` | `title` |
| `descriptionAr/En` | `description` |

A list, min 1 and max 8.

### `partners` → `home_partners.items`

| Field | Legacy | Notes |
|---|---|---|
| `nameAr/En` | `name` | Also the logo's alt text. |
| `logoId` | `logo.src` | 7 PNGs. |
| `url` | `url` | Optional external URL. `""` becomes `null`, which links to `/members` as it does today. |

A list, max 16.

### `challenges` singleton

| Field | Legacy | Notes |
|---|---|---|
| `items[].titleAr/En` | `title` | |
| `items[].descriptionAr/En` | `description` | |
| `items[].imageId` | `image.src` | 7 placeholder SVGs, rasterized. |

A list, min 1 and max 12. The home slider and the about grid both read it.

---

## Images

The import takes **every** image path it finds, not only `uploads/...`. The original plan set
`assets/img/...` paths to `null` and fell back to placeholder art. That doesn't work, because those
paths are the real content:

- All 12 member logos and all 7 partner logos are bundled files.
- So are the hero photos, the article images and the challenge images.

Setting them to `null` would lose them.

| Source | Count (local) | Handling |
|---|---|---|
| `.png`, `.jpg`, `.webp` under `assets/img/` or `uploads/` | 3 hero + 2 discover + 1 article default + 1 article + 3 member logos + 7 partner logos | `ingestImage` as is. Shared files are stored once, because the media id is the content hash. |
| `.svg` under `assets/img/` | 9 member logos + 6 article + 7 challenge + 1 about | The import rasterizes them first, with `sharp(svg, { density }).png()` at a 1600 px long edge, then calls `ingestImage`. This is safe because the files come from SAFTA's own repo. **Uploaded** SVGs (`uploads/*.svg`) are still refused and listed, as the plan says. |
| `""` | 9 group images | `null` |

**Alt text is required on every media row** (`altAr`, by the media pipeline's rule), but four page
images have none today: the three hero slides and the founding-statement image, all stored with
`alt: ""` because they are decorative. The import gives them the Arabic text of the field next to
them (the slide heading, the statement's eyebrow), as the dashboard's upload prefill does. The page
can still render them with an empty `alt` where they are decorative.

The default article hero is one image, so `safta-assets.ts` only has to cover empty slots: group
tiles (already drawn in code) and any slot an admin clears later.

## Decisions taken in this map

These follow the plan's rules and can still be changed:

- **The Home crumb.** All 8 files hold the same "Home / الرئيسية" breadcrumb (asserted equal). It is
  interface copy, so it goes in `ui.ts` and not in 8 singletons.
- **Required markers move into the markup.** The contact form marks required fields with
  `<b class="req">*</b>`, in English only. The register form puts a plain ` *` in both languages.
  The import strips both. The markup then renders `<b class="req">*</b>` after every label whose
  input is `required`, on both forms and in both languages. Visible effect: the Arabic contact
  labels gain the asterisk, and the register form's asterisk picks up the `.req` style.
- **Select options are a fixed set with editable labels.** The `<option value>` each form submits
  is hardcoded English today (`Water & irrigation`, `Saudi Arabia`…). So each option's `value` stays
  in code and only its label is content, and options cannot be added or removed. The entity-type and
  area options on the register form have no `value` today, so they submit their visible text, which
  turns Arabic once `i18n.js` swaps it. Give them the English label as a fixed `value`, which matches
  what an English visitor submits now.
- **Hero tab labels merge into the eyebrows**, as in waterstrip, after checking that they are equal.
- **Member `short` is dropped.** It is English only, has no Arabic, and nothing renders it. If it
  turns out to be wanted, it becomes an optional `summaryAr/En` pair. The import would then need
  Arabic for all 12 records.

## Public-site bugs found along the way

These are outside the "public site doesn't change" scope, so they are only noted here:

- **Breadcrumb tails are English only.** "About SAFTA", "Contact", "Members", "Profile", "Working
  Groups", "News & Events" and "Register interest" are raw text with no `data-ar`, so `/ar` shows
  them in English. The cheapest fix is to render each page's own title field there.
- **Links in the consent text have no locale prefix** (`/terms` instead of `/en/terms`). They are
  fixed by the `mapHref` noted above.
- **Event links had no locale prefix either** (`/register-interest`). Phase 3 localizes on-site
  event hrefs.
- **Inconsistent counts.** About's "At a glance" says 24 working groups, while the home page and the
  working groups page say 9. The section is hidden, but the count is wrong when it is shown again.

## Totals

| Source | Keys | Mapped | Dropped (with reason) |
|---|---|---|---|
| `index.json` | 40 | 37 | 3 (tab labels, duplicates) |
| `about.json` | 28 | 24 | 4 (3 tape duplicates, 1 unused) |
| `technologies.js` | 7 | 7 | — |
| `media.json` | 15 | 3 | 12 (orphaned cards) |
| `article.js` | 5 | 5 | — |
| `members-page.json` | 6 | 6 | — |
| `member.json` | 16 | 16 | — |
| `contact.json` | 60 | 60 | — |
| `register-interest.json` | 44 | 44 | — |
| Collections | 50 records | all fields except `members.short` and `articles.ph` | |

"Mapped" includes the Home crumbs that go to `ui.ts`.
