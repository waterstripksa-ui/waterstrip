# شريط شراكات الابتكار المائي — Water STRIP

موقع ثابت بالكامل (HTML/CSS/JS) — **بالعربية فقط**، بلا لوحة تحكّم.
التصميم مطابق لنسخة سافتا الأخيرة (SAFTA-v5) من ناحية الأقسام والبنية، والمحتوى خاص بـ Water STRIP.

## البنية
```
index · about · technologies · working-group · members · member
media · article · contact · register-interest
login · forgot-password · terms · privacy · cookies · accessibility · sitemap · 404
assets/css/style.css      نظام التصميم (ألوان Water STRIP الرسمية)
assets/js/main.js         السلوك (السلايدرات · التبويبات · النماذج · الحركات)
assets/js/wg-data.js      بيانات مجموعات العمل الثماني
assets/js/article-data.js الأخبار
assets/js/events-data.js  الفعاليات
assets/img/               الشعارات والخلفيات والبدائل
```

## الهوية
- الألوان الرسمية: `#154A91` · `#1A77BC` · `#2B8CCC` · `#2FB2DC` · `#61CBF1`
- الخطوط: Tajawal (عناوين) + IBM Plex Sans Arabic (نصوص)
- الشعارات مأخوذة من ملف الهوية الرسمي (الأساسي + الرمزي · ملوّن/أبيض/أسود)

## قبل الإطلاق الرسمي
1. احذف `<meta name="robots" content="noindex, nofollow">` من الصفحات الثماني عشرة
2. في `robots.txt` استبدل `Disallow: /` بـ `Allow: /`
3. ضع روابط حسابات التواصل الفعلية بدل `#` في الفوتر
4. استبدل الصور البديلة (`assets/img/ph/*.svg` و`assets/img/hero/*.svg`) بصور حقيقية
5. اربط النماذج بخدمة استقبال (Netlify Forms أو backend)

## النشر
مجلد ثابت جاهز للرفع كما هو على Netlify — لا build ولا حزم.
`netlify.toml` يحوي ترويسات الأمان وسياسة التخزين، و`_redirects` للروابط النظيفة.

## اعتمادات خارجية
Google Fonts · GSAP و ScrollTrigger (cdnjs) · Lenis (jsDelivr). كلها محمية بشروط — لو انحجبت يعمل الموقع بلا حركات.
