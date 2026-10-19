import { LANGUAGE } from './language.js';
import { regExpTests } from './regex.utils.spec.js';

// a few endonyms are commented out because they contain characters that are not supported by the regex
export const ISO_639_1_LANGUAGE_NAMES_AND_ENDONYMS = [
  { iso: 'Abkhazian', endonyms: ['Аҧсуа (Apsua)'] },
  { iso: 'Afar', endonyms: ['Qafar af'] },
  { iso: 'Afrikaans', endonyms: ['Afrikaans'] },
  { iso: 'Akan', endonyms: ['Ákán'] },
  { iso: 'Albanian', endonyms: ['Shqip'] },
  { iso: 'Amharic', endonyms: ['አማርኛ (Amarəñña)'] },
  {
    iso: 'Arabic', // endonyms: ['اَلْعَرَبِيَّةُ (al-ʿarabiyyah)']
  },
  { iso: 'Aragonese', endonyms: ['Aragonés'] },
  { iso: 'Armenian', endonyms: ['Հայերեն (Hayeren)'] },
  {
    iso: 'Assamese', // endonyms: ['অসমীয়া (Ôxômiya)']
  },
  { iso: 'Avaric', endonyms: ['Авар мацӏ', 'اوار ماض (Avar maz)'] },
  { iso: 'Avestan', endonyms: ['Upastawakaēna'] },
  { iso: 'Aymara', endonyms: ['Aymara'] },
  {
    iso: 'Azerbaijani',
    endonyms: ['Azərbaycan dili', 'آذربایجان دیلی', 'Азәрбајҹан дили'],
  },
  {
    iso: 'Bambara',
    // endonyms: ['بَمَنَنكَن', 'ߓߡߊߣߊ߲ߞߊ߲ (Bamanankan)']
  },
  { iso: 'Bashkir', endonyms: ['Башҡорт теле', 'Başqort tele'] },
  { iso: 'Basque', endonyms: ['Euskara'] },
  { iso: 'Belarusian', endonyms: ['Беларуская мова (Belaruskaâ mova)'] },
  {
    iso: 'Bengali', // endonyms: ['বাংলা (Bāŋlā)']
  },
  { iso: 'Bislama', endonyms: ['Bislama'] },
  { iso: 'Bosnian', endonyms: ['Босански (Bosanski)'] },
  { iso: 'Breton', endonyms: ['Brezhoneg'] },
  { iso: 'Bulgarian', endonyms: ['Български (Bulgarski)'] },
  {
    iso: 'Burmese', // endonyms: ['မြန်မာစာ (Mrãmācā)']
  },
  { iso: 'Catalan, Valencian', endonyms: ['Català', 'Valencià'] },
  { iso: 'Chamorro', endonyms: ["Finu' Chamoru"] },
  {
    iso: 'Chechen',
    endonyms: ['Нохчийн мотт'], // endonyms: ['(Noxçiyn mott)']
  },
  {
    iso: 'Chichewa, Chewa, Nyanja',
    endonyms: ['Chichewa', 'Chinyanja'],
  },
  {
    iso: 'Chinese',
    endonyms: ['中文 (Zhōngwén)', '汉语 (Hànyǔ)', '漢語 (Hànyǔ)'],
  },
  {
    iso: 'Church Slavonic, Old Slavonic, Old Church Slavonic',
    // endonyms: ['Славе́нскїй ѧ҆зы́къ']
  },
  { iso: 'Chuvash', endonyms: ['Чӑвашла (Çăvaşla)'] },
  { iso: 'Cornish', endonyms: ['Kernowek'] },
  { iso: 'Corsican', endonyms: ['Corsu'] },
  { iso: 'Cree', endonyms: ['ᓀᐦᐃᔭᐁᐧᐃᐧᐣ (Nehiyawewin)'] },
  { iso: 'Croatian', endonyms: ['Hrvatski'] },
  { iso: 'Czech', endonyms: ['Čeština'] },
  { iso: 'Danish', endonyms: ['Dansk'] },
  {
    iso: 'Divehi, Dhivehi, Maldivian', // endonyms: ['ދިވެހި (Dhivehi)']
  },
  { iso: 'Dutch, Flemish', endonyms: ['Nederlands'] },
  {
    iso: 'Dzongkha', // endonyms: ['རྫོང་ཁ་ (Dzongkha)']
  },
  { iso: 'English', endonyms: ['English'] },
  { iso: 'Esperanto', endonyms: ['Esperanto'] },
  { iso: 'Estonian', endonyms: ['Eesti keel'] },
  { iso: 'Ewe', endonyms: ['Èʋegbe'] },
  { iso: 'Faroese', endonyms: ['Føroyskt'] },
  { iso: 'Fijian', endonyms: ['Na Vosa Vakaviti'] },
  { iso: 'Finnish', endonyms: ['Suomi'] },
  { iso: 'French', endonyms: ['Français'] },
  { iso: 'Western Frisian', endonyms: ['Frysk'] },
  {
    iso: 'Fulah',
    endonyms: [
      '𞤊𞤵𞤤𞤬𞤵𞤤𞤣𞤫',
      'Pulaar',
      // 'ࢻُلْࢻُلْدٜ',
      // 'Fulfulde𞤆𞤵𞤤𞤢𞥄𞤪',
      // 'ݒُلَارْ'
    ],
  },
  { iso: 'Gaelic, Scottish Gaelic', endonyms: ['Gàidhlig'] },
  { iso: 'Galician', endonyms: ['Galego'] },
  { iso: 'Ganda', endonyms: ['Luganda'] },
  { iso: 'Georgian', endonyms: ['ქართული (Kharthuli)'] },
  { iso: 'German', endonyms: ['Deutsch'] },
  { iso: 'Greek, Modern (1453–)', endonyms: ['Νέα Ελληνικά (Néa Ellêniká)'] },
  { iso: 'Kalaallisut, Greenlandic', endonyms: ['Kalaallisut'] },
  { iso: 'Guarani', endonyms: ["Avañe'ẽ"] },
  {
    iso: 'Gujarati', // endonyms: ['ગુજરાતી (Gujarātī)']
  },
  { iso: 'Haitian, Haitian Creole', endonyms: ['Kreyòl ayisyen'] },
  {
    iso: 'Hausa', // endonyms: ['هَرْشٜن هَوْس (halshen Hausa)']
  },
  { iso: 'Hebrew', endonyms: ['עברית (Ivrit)'] },
  { iso: 'Herero', endonyms: ['Otjiherero'] },
  {
    iso: 'Hindi', // endonyms: ['हिन्दी (Hindī)']
  },
  { iso: 'Hiri Motu', endonyms: ['Hiri Motu'] },
  { iso: 'Hungarian', endonyms: ['Magyar nyelv'] },
  { iso: 'Icelandic', endonyms: ['Íslenska'] },
  { iso: 'Ido', endonyms: ['Ido'] },
  {
    iso: 'Igbo', // endonyms: ['ásụ̀sụ́ Ìgbò']
  },
  { iso: 'Indonesian', endonyms: ['bahasa Indonesia'] },
  {
    iso: 'Interlingua (International Auxiliary Language Association)',
    endonyms: ['Interlingua'],
  },
  {
    iso: 'Interlingue, Occidental',
    endonyms: ['Interlingue', 'Occidental'],
  },
  { iso: 'Inuktitut', endonyms: ['ᐃᓄᒃᑎᑐᑦ (Inuktitut)'] },
  { iso: 'Inupiaq', endonyms: ['Iñupiaq'] },
  { iso: 'Irish', endonyms: ['Gaeilge'] },
  { iso: 'Italian', endonyms: ['Italiano'] },
  { iso: 'Japanese', endonyms: ['日本語 (Nihongo)'] },
  { iso: 'Javanese', endonyms: ['ꦧꦱꦗꦮ', 'basa Jawa'] },
  {
    iso: 'Kannada', // endonyms: ['ಕನ್ನಡ (Kannađa)']
  },
  {
    iso: 'Kanuri',
    endonyms: ['Kànùrí'], // endonyms: ['كَنُرِيِه']
  },
  {
    iso: 'Kashmiri',
    // endonyms: ['कॉशुर', 'كأشُر (Kosher)']
  },
  { iso: 'Kazakh', endonyms: ['Қазақша', 'Qazaqşa'] },
  {
    iso: 'Central Khmer', // endonyms: ['ខេមរភាសា (Khémôrôphéasa)']
  },
  { iso: 'Kikuyu, Gikuyu', endonyms: ['Gĩgĩkũyũ'] },
  { iso: 'Kinyarwanda', endonyms: ['Ikinyarwanda'] },
  { iso: 'Kirghiz, Kyrgyz', endonyms: ['Кыргызча', 'Kırgızça'] },
  { iso: 'Komi', endonyms: ['Коми кыв'] },
  { iso: 'Kongo', endonyms: ['Kikongo'] },
  {
    iso: 'Korean',
    endonyms: ['한국어 (Hangugeo)', '조선말 (Chosŏnmal)'],
  },
  { iso: 'Kuanyama, Kwanyama', endonyms: ['Oshikwanyama'] },
  { iso: 'Kurdish', endonyms: ['کوردی', 'Kurdî'] },
  { iso: 'Lao', endonyms: ['ພາສາລາວ (phasa Lao)'] },
  { iso: 'Latin', endonyms: ['Latinum'] },
  { iso: 'Latvian', endonyms: ['Latviski'] },
  { iso: 'Limburgan, Limburger, Limburgish', endonyms: ['Lèmburgs'] },
  { iso: 'Lingala', endonyms: ['Lingála'] },
  { iso: 'Lithuanian', endonyms: ['Lietuviškai'] },
  { iso: 'Luba-Katanga', endonyms: ['Kiluba'] },
  { iso: 'Luxembourgish, Letzeburgesch', endonyms: ['Lëtzebuergesch'] },
  { iso: 'Macedonian', endonyms: ['Македонски (Makedonski)'] },
  { iso: 'Malagasy', endonyms: ['Malagasy'] },
  { iso: 'Malay', endonyms: ['بهاس ملايو (bahasa Melayu)'] },
  {
    iso: 'Malayalam', // endonyms: ['മലയാളം (Malayāļã)']
  },
  { iso: 'Maltese', endonyms: ['Malti'] },
  { iso: 'Manx', endonyms: ['Gaelg', 'Gailck'] },
  { iso: 'Maori', endonyms: ['reo Māori'] },
  {
    iso: 'Marathi', // endonyms: ['मराठी (Marāṭhī)']
  },
  {
    iso: 'Marshallese', // endonyms: ['kajin M̧ajel']
  },
  {
    iso: 'Mongolian',
    endonyms: ['ᠮᠣᠩᠭᠣᠯ ᠬᠡᠯᠡ', 'Монгол хэл (Mongol xel)'],
  },
  { iso: 'Nauru', endonyms: ['dorerin Naoe'] },
  {
    iso: 'Navajo, Navaho',
    endonyms: ['Diné bizaad', 'Naabeehó bizaad'],
  },
  {
    iso: 'North Ndebele',
    endonyms: ['isiNdebele', 'saseNyakatho', 'Mthwakazi Ndebele'],
  },
  { iso: 'South Ndebele', endonyms: ['isiNdebele', 'sakwaNdzundza'] },
  { iso: 'Ndonga', endonyms: ['Ndonga'] },
  {
    iso: 'Nepali', // endonyms: ['नेपाली भाषा (Nepālī bhāśā)']
  },
  { iso: 'Norwegian', endonyms: ['Norsk'] },
  { iso: 'Norwegian Bokmål', endonyms: ['Norsk Bokmål'] },
  { iso: 'Norwegian Nynorsk', endonyms: ['Norsk Nynorsk'] },
  { iso: 'Occitan', endonyms: ['Occitan', 'Provençal'] },
  { iso: 'Ojibwa', endonyms: ['ᐊᓂᔑᓈᐯᒧᐎᓐ (Anishinaabemowin)'] },
  {
    iso: 'Oriya', // endonyms: ['ଓଡ଼ିଆ (Odia)']
  },
  { iso: 'Oromo', endonyms: ['afaan Oromoo'] },
  { iso: 'Ossetian, Ossetic', endonyms: ['дигорон Ӕвзаг (digoron Ævzag)'] },
  { iso: 'Pali', endonyms: ['Pāli'] },
  {
    iso: 'Pashto, Pushto', // endonyms: ['پښتو (Pax̌tow)']
  },
  { iso: 'Persian', endonyms: ['فارسی (Fārsiy)'] },
  { iso: 'Polish', endonyms: ['Polski'] },
  { iso: 'Portuguese', endonyms: ['Português'] },
  {
    iso: 'Punjabi, Panjabi',
    endonyms: [
      'پنجابی (Pãjābī)', // 'ਪੰਜਾਬੀ'
    ],
  },
  {
    iso: 'Quechua',
    endonyms: ['Runa simi', 'kichwa simi', 'Nuna shimi'],
  },
  { iso: 'Romanian, Moldavian, Moldovan', endonyms: ['Românește'] },
  {
    iso: 'Romansh',
    endonyms: ['Rumantsch', 'Rumàntsch', 'Romauntsch', 'Romontsch'],
  },
  { iso: 'Rundi', endonyms: ['Ikirundi'] },
  { iso: 'Russian', endonyms: ['Русский язык (Russkiĭ âzyk)'] },
  { iso: 'Northern Sami', endonyms: ['Davvisámegiella'] },
  { iso: 'Samoan', endonyms: ['gagana Sāmoa'] },
  { iso: 'Sango', endonyms: ['yângâ tî Sängö'] },
  {
    iso: 'Sanskrit', // endonyms: ['संस्कृतम् (Saṃskṛtam)']
  },
  { iso: 'Sardinian', endonyms: ['Sardu'] },
  { iso: 'Serbian', endonyms: ['Српски (Srpski)'] },
  { iso: 'Shona', endonyms: ['chiShona'] },
  {
    iso: 'Sindhi',
    endonyms: ['سنڌي'], // endonyms: ['सिन्धी (Sindhī)']
  },
  {
    iso: 'Sinhala, Sinhalese', // endonyms: ['සිංහල (Siṁhala)']
  },
  { iso: 'Slovak', endonyms: ['Slovenčina'] },
  { iso: 'Slovenian', endonyms: ['Slovenščina'] },
  {
    iso: 'Somali',
    endonyms: ['Soomaali', '𐒈𐒝𐒑𐒛𐒐𐒘'],
    // endonyms: ['سٝومالِ']
  },
  { iso: 'Southern Sotho', endonyms: ['Sesotho'] },
  { iso: 'Spanish, Castilian', endonyms: ['Español', 'Castellano'] },
  {
    iso: 'Sundanese',
    endonyms: [
      'basa Sunda', //'ᮘᮞ ᮞᮥᮔ᮪ᮓ', بَاسَا سُوْندَا'
    ],
  },
  {
    iso: 'Swahili',
    endonyms: [
      'Kiswahili', //'كِسوَحِيلِ'
    ],
  },
  { iso: 'Swati', endonyms: ['siSwati'] },
  { iso: 'Swedish', endonyms: ['Svenska'] },
  { iso: 'Tagalog', endonyms: ['Wikang Tagalog'] },
  { iso: 'Tahitian', endonyms: ['reo Tahiti'] },
  { iso: 'Tajik', endonyms: ['Тоҷикӣ (Tojikī)'] },
  {
    iso: 'Tamil', // endonyms: ['தமிழ் (Tamiḻ)']
  },
  {
    iso: 'Tatar',
    endonyms: ['Татар теле', 'Tatar tele', 'تاتار تئلئ'],
  },
  {
    iso: 'Telugu', // endonyms: ['తెలుగు (Telugu)']
  },
  { iso: 'Thai', endonyms: ['ภาษาไทย (Phasa Thai)'] },
  {
    iso: 'Tibetan',
    // endonyms: ['བོད་སྐད་ (Bodskad)', 'ལྷ་སའི་སྐད་ (Lhas'iskad)']
  },
  { iso: 'Tigrinya', endonyms: ['ትግርኛ (Təgrəñña)'] },
  { iso: 'Tonga (Tonga Islands)', endonyms: ['lea faka-Tonga'] },
  { iso: 'Tsonga', endonyms: ['Xitsonga'] },
  { iso: 'Tswana', endonyms: ['Setswana'] },
  { iso: 'Turkish', endonyms: ['Türkçe'] },
  {
    iso: 'Turkmen',
    endonyms: ['Түркменче', 'تۆرکمنچه', 'Türkmençe'],
  },
  { iso: 'Twi', endonyms: ['Twi'] },
  {
    iso: 'Uighur, Uyghur',
    endonyms: ['ئۇيغۇر تىلى', 'ئۇيغۇر تىلى', 'Uyƣur tili'],
  },
  { iso: 'Ukrainian', endonyms: ['Українська (Ukraїnska)'] },
  {
    iso: 'Urdu', // endonyms: ['اُردُو (Urdu)']
  },
  {
    iso: 'Uzbek',
    endonyms: ['Ózbekça', 'ўзбекча', 'ئوزبېچه'],
  },
  { iso: 'Venda', endonyms: ['Tshivenḓa'] },
  { iso: 'Vietnamese', endonyms: ['tiếng Việt'] },
  { iso: 'Volapük', endonyms: ['Volapük'] },
  { iso: 'Walloon', endonyms: ['Walon'] },
  { iso: 'Welsh', endonyms: ['Cymraeg'] },
  {
    iso: 'Wolof', // endonyms: ['وࣷلࣷفْ']
  },
  { iso: 'Xhosa', endonyms: ['isiXhosa'] },
  { iso: 'Sichuan Yi, Nuosu', endonyms: ['ꆈꌠꉙ (Nuosuhxop)'] },
  {
    iso: 'Yiddish', // endonyms: ['ייִדיש (Yidiš)']
  },
  { iso: 'Yoruba', endonyms: ['èdè Yorùbá'] },
  { iso: 'Zhuang, Chuang', endonyms: ['話僮 (Vahcuengh)'] },
  { iso: 'Zulu', endonyms: ['isiZulu'] },
];

regExpTests(
  'LANGUAGE',
  LANGUAGE,
  [
    { expected: false, value: '' }, // Empty string
    { expected: false, value: ' ' }, // Only space
    { expected: false, value: '-abc' }, // Start with a symbol
    { expected: false, value: '@#$%^&*' }, // Only symbols
    { expected: false, value: 'Español\nFrançais' }, // Newline character in the middle
    { expected: false, value: '!!' }, // Only punctuation
    { expected: false, value: '中文\n漢語' }, // Newline in complex script
    { expected: true, value: '1234name' }, // numbers and letters

    // Language names and endonyms test cases
    ...ISO_639_1_LANGUAGE_NAMES_AND_ENDONYMS.flatMap(({ iso, endonyms }) => {
      const endonymTests =
        endonyms?.map((endonym) => ({
          expected: true,
          value: endonym,
        })) || []; // Default to an empty array if endonyms is undefined

      return [{ expected: true, value: iso }, ...endonymTests];
    }),
  ],
  true,
);
