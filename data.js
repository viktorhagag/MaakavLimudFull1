// Default data set for the Torah tracker application.
// Each category contains an id, a display name, a colour and a list of tracks.
// Each track defines an id, title and number of units. Completed units will
// be initialised at runtime based on this count.

export const DEFAULT_DATA = {
  categories: [
    {
      id: 'gemara',
      name: 'גמרא',
      color: '#A66E31',
      tracks: [
        { id: 'berakhot-gemara', title: 'ברכות', units: 64 },
        { id: 'shabbat-gemara', title: 'שבת', units: 157 },
        { id: 'eruvin-gemara', title: 'עירובין', units: 105 },
        { id: 'pesachim-gemara', title: 'פסחים', units: 121 },
        { id: 'shekalim-gemara', title: 'שקלים', units: 22 },
        { id: 'yoma-gemara', title: 'יומא', units: 88 }
      ]
    },
    {
      id: 'mishnah',
      name: 'משנה',
      color: '#A66E31',
      tracks: [
        { id: 'berakhot-mishnah', title: 'ברכות', units: 9 },
        { id: 'peah-mishnah', title: 'פאה', units: 8 },
        { id: 'dmai-mishnah', title: 'דמאי', units: 7 },
        { id: 'kilaayim-mishnah', title: 'כלאים', units: 9 },
        { id: 'shabbat-mishnah', title: 'שבת', units: 24 },
        { id: 'eruvin-mishnah', title: 'עירובין', units: 10 }
      ]
    },
    {
      id: 'tanakh',
      name: 'תנ״ך',
      color: '#007ACC',
      tracks: [
        { id: 'bereishit-tanakh', title: 'בראשית', units: 50 },
        { id: 'shemot-tanakh', title: 'שמות', units: 40 },
        { id: 'vayikra-tanakh', title: 'ויקרא', units: 27 },
        { id: 'bamidbar-tanakh', title: 'במדבר', units: 36 },
        { id: 'devarim-tanakh', title: 'דברים', units: 34 },
        { id: 'yehoshua-tanakh', title: 'יהושע', units: 24 },
        { id: 'shoftim-tanakh', title: 'שופטים', units: 21 },
        { id: 'ruth-tanakh', title: 'רות', units: 4 },
        { id: 'tehilim-tanakh', title: 'תהילים', units: 150 },
        { id: 'mishlei-tanakh', title: 'משלי', units: 31 }
      ]
    },
    {
      id: 'rambam',
      name: 'רמב״ם',
      color: '#E59500',
      tracks: [
        { id: 'yesodei-torah', title: 'הלכות יסודי התורה', units: 10 },
        { id: 'deot', title: 'הלכות דעות', units: 7 },
        { id: 'talmud-torah', title: 'הלכות תלמוד תורה', units: 7 },
        { id: 'avoda-zara', title: 'הלכות עבודה זרה וחוקות הגויים', units: 12 },
        { id: 'teshuva', title: 'הלכות תשובה', units: 10 },
        { id: 'keriat-shema', title: 'הלכות קריאת שמע', units: 4 },
        { id: 'tefila', title: 'הלכות תפילה וברכת כהנים', units: 15 },
        { id: 'tefillin', title: 'הלכות תפילין, מזוזה וספר תורה', units: 10 },
        { id: 'tzitzit', title: 'הלכות ציצית', units: 3 },
        { id: 'berachot-halacha', title: 'הלכות ברכות', units: 11 }
      ]
    },
    {
      id: 'shulchan_aruch',
      name: 'שולחן ערוך',
      color: '#FFA500',
      tracks: [
        { id: 'orach-chaim', title: 'אורח חיים', units: 697 },
        { id: 'yoreh-deah', title: 'יורה דעה', units: 397 },
        { id: 'even-haezer', title: 'אבן העזר', units: 178 },
        { id: 'choshen-mishpat', title: 'חושן משפט', units: 427 }
      ]
    },
    {
      id: 'yerushalmi',
      name: 'ירושלמי',
      color: '#8A8A8A',
      tracks: [
        { id: 'berakhot-yerushalmi', title: 'ברכות (ירושלמי)', units: 68 },
        { id: 'peah-yerushalmi', title: 'פאה (ירושלמי)', units: 64 },
        { id: 'shekalim-yerushalmi', title: 'שקלים (ירושלמי)', units: 68 },
        { id: 'yoma-yerushalmi', title: 'יומא (ירושלמי)', units: 71 }
      ]
    }
  ]
};