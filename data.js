// Default data set for the Torah tracker application.
// Each category contains an id, a display name, a colour and a list of tracks.
// Each track defines an id, title and number of units. Completed units will
// be initialised at runtime based on this count.

export const DEFAULT_DATA = {
  categories: [
    {
      id: 'gemara',
      name: 'גמרא (בבלי)',
      color: '#A66E31',
      tracks: [
        { id: 'berakhot',    title: 'ברכות',        units: 64 },
        { id: 'shabbat',     title: 'שבת',           units: 157 },
        { id: 'eruvin',      title: 'עירובין',       units: 105 },
        { id: 'pesachim',    title: 'פסחים',         units: 121 },
        { id: 'shekalim',    title: 'שקלים',         units: 22 },
        { id: 'yoma',        title: 'יומא',           units: 88 },
        { id: 'sukkah',      title: 'סוכה',           units: 56 },
        { id: 'beitza',      title: 'ביצה',           units: 40 },
        { id: 'rosh-hashanah', title: 'ראש השנה',     units: 35 },
        { id: 'taanit',      title: 'תענית',         units: 31 },
        { id: 'megillah',    title: 'מגילה',         units: 32 },
        { id: 'moed-katan',  title: 'מועד קטן',       units: 29 },
        { id: 'chagigah',    title: 'חגיגה',         units: 27 },
        { id: 'yevamot',     title: 'יבמות',         units: 122 },
        { id: 'ketubot',     title: 'כתובות',         units: 112 },
        { id: 'nedarim',     title: 'נדרים',         units: 91 },
        { id: 'nazir',       title: 'נזיר',           units: 66 },
        { id: 'sotah',       title: 'סוטה',           units: 49 },
        { id: 'gittin',      title: 'גיטין',          units: 90 },
        { id: 'kiddushin',   title: 'קידושין',        units: 82 },
        { id: 'bava-kamma',  title: 'בבא קמא',        units: 119 },
        { id: 'bava-metzia', title: 'בבא מציעא',      units: 119 },
        { id: 'bava-batra',  title: 'בבא בתרא',       units: 176 },
        { id: 'sanhedrin',   title: 'סנהדרין',        units: 113 },
        { id: 'makot',       title: 'מכות',           units: 24 },
        { id: 'shevuot',     title: 'שבועות',         units: 49 },
        { id: 'avodah-zarah',title: 'עבודה זרה',      units: 76 },
        { id: 'horayot',     title: 'הוריות',         units: 14 },
        { id: 'zevachim',    title: 'זבחים',          units: 120 },
        { id: 'menachot',    title: 'מנחות',          units: 110 },
        { id: 'chullin',     title: 'חולין',          units: 142 },
        { id: 'bekhorot',    title: 'בכורות',         units: 61 },
        { id: 'arachin',     title: 'ערכין',          units: 34 },
        { id: 'temurah',     title: 'תמורה',          units: 34 },
        { id: 'keritot',     title: 'כריתות',         units: 28 },
        { id: 'meilah',      title: 'מעילה',          units: 22 },
        { id: 'kinnim',      title: 'קנים',           units: 3 },
        { id: 'tamid',       title: 'תמיד',           units: 10 },
        { id: 'midot',       title: 'מידות',          units: 4 }
      ]
    }
  ]
};