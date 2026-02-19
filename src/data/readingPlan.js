const bibleBooks = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 },
]

const totalChapters = bibleBooks.reduce((sum, book) => sum + book.chapters, 0)
const bookChapterMap = Object.fromEntries(
  bibleBooks.map((book) => [book.name, book.chapters]),
)

const formatReference = (bookName, start, end) =>
  start === end ? `${bookName} ${start}` : `${bookName} ${start}-${end}`

const buildWholeBiblePlan = (totalDays) => {
  const base = Math.floor(totalChapters / totalDays)
  const extra = totalChapters % totalDays
  const readings = []

  let bookIndex = 0
  let chapter = 1

  for (let day = 1; day <= totalDays; day += 1) {
    let chaptersForDay = base + (day <= extra ? 1 : 0)
    const references = []

    while (chaptersForDay > 0 && bookIndex < bibleBooks.length) {
      const book = bibleBooks[bookIndex]
      const remainingInBook = book.chapters - chapter + 1
      const take = Math.min(chaptersForDay, remainingInBook)
      const start = chapter
      const end = chapter + take - 1

      references.push(formatReference(book.name, start, end))

      chaptersForDay -= take
      chapter = end + 1

      if (chapter > book.chapters) {
        bookIndex += 1
        chapter = 1
      }
    }

    readings.push({ day, references })
  }

  return readings
}

export const expandReferences = (references) => {
  const expanded = []

  references.forEach((reference) => {
    const match = reference.match(/^(.+?)\s+(\d+)(?:-(\d+))?$/)
    if (!match) {
      expanded.push(reference)
      return
    }

    const bookName = match[1]
    const start = Number(match[2])
    const end = Number(match[3] || match[2])
    const maxChapters = bookChapterMap[bookName]

    if (!maxChapters || Number.isNaN(start) || Number.isNaN(end)) {
      expanded.push(reference)
      return
    }

    const last = Math.min(end, maxChapters)
    for (let chapter = start; chapter <= last; chapter += 1) {
      expanded.push(`${bookName} ${chapter}`)
    }
  })

  return expanded
}

export const readingPlans = [
  {
    id: '30-ot',
    label: '30-Day Old Testament',
    description: 'Read the Old Testament in 30 days.',
    totalDays: 30,
    readings: [
      { day: 1, references: ['Genesis 1-11'] },
      { day: 2, references: ['Genesis 12-25'] },
      { day: 3, references: ['Genesis 26-36'] },
      { day: 4, references: ['Genesis 37-50'] },
      { day: 5, references: ['Exodus 1-15'] },
      { day: 6, references: ['Exodus 16-30'] },
      { day: 7, references: ['Exodus 31-40', 'Leviticus 1-10'] },
      { day: 8, references: ['Leviticus 11-27'] },
      { day: 9, references: ['Numbers 1-12'] },
      { day: 10, references: ['Numbers 13-26'] },
      { day: 11, references: ['Numbers 27-36', 'Deuteronomy 1-5'] },
      { day: 12, references: ['Deuteronomy 6-20'] },
      { day: 13, references: ['Deuteronomy 21-34', 'Joshua 1-8'] },
      { day: 14, references: ['Joshua 9-24'] },
      { day: 15, references: ['Judges 1-12'] },
      { day: 16, references: ['Judges 13-21', 'Ruth 1-4'] },
      { day: 17, references: ['1 Samuel 1-15'] },
      { day: 18, references: ['1 Samuel 16-31'] },
      { day: 19, references: ['2 Samuel 1-14'] },
      { day: 20, references: ['2 Samuel 15-24', '1 Kings 1-4'] },
      { day: 21, references: ['1 Kings 5-22'] },
      { day: 22, references: ['2 Kings 1-17'] },
      { day: 23, references: ['2 Kings 18-25', '1 Chronicles 1-10'] },
      { day: 24, references: ['1 Chronicles 11-29'] },
      { day: 25, references: ['2 Chronicles 1-20'] },
      { day: 26, references: ['2 Chronicles 21-36', 'Ezra 1-6'] },
      { day: 27, references: ['Ezra 7-10', 'Nehemiah 1-13'] },
      { day: 28, references: ['Esther 1-10', 'Job 1-21'] },
      { day: 29, references: ['Job 22-42', 'Psalms 1-50'] },
      {
        day: 30,
        references: [
          'Psalms 51-150',
          'Proverbs 1-31',
          'Ecclesiastes 1-12',
          'Song of Solomon 1-8',
          'Isaiah 1-66',
          'Jeremiah 1-52',
          'Lamentations 1-5',
          'Ezekiel 1-48',
          'Daniel 1-12',
          'Hosea 1-14',
          'Joel 1-3',
          'Amos 1-9',
          'Obadiah 1',
          'Jonah 1-4',
          'Micah 1-7',
          'Nahum 1-3',
          'Habakkuk 1-3',
          'Zephaniah 1-3',
          'Haggai 1-2',
          'Zechariah 1-14',
          'Malachi 1-4',
        ],
      },
    ],
  },
  {
    id: '30-nt',
    label: '30-Day New Testament',
    description: 'Read the New Testament in 30 days.',
    totalDays: 30,
    readings: [
      { day: 1, references: ['Matthew 1-7'] },
      { day: 2, references: ['Matthew 8-14'] },
      { day: 3, references: ['Matthew 15-28'] },
      { day: 4, references: ['Mark 1-8'] },
      { day: 5, references: ['Mark 9-16'] },
      { day: 6, references: ['Luke 1-9'] },
      { day: 7, references: ['Luke 10-18'] },
      { day: 8, references: ['Luke 19-24'] },
      { day: 9, references: ['John 1-7'] },
      { day: 10, references: ['John 8-14'] },
      { day: 11, references: ['John 15-21'] },
      { day: 12, references: ['Acts 1-7'] },
      { day: 13, references: ['Acts 8-14'] },
      { day: 14, references: ['Acts 15-21'] },
      { day: 15, references: ['Acts 22-28'] },
      { day: 16, references: ['Romans 1-8'] },
      { day: 17, references: ['Romans 9-16'] },
      { day: 18, references: ['1 Corinthians 1-8'] },
      { day: 19, references: ['1 Corinthians 9-16'] },
      { day: 20, references: ['2 Corinthians 1-13'] },
      { day: 21, references: ['Galatians 1-6', 'Ephesians 1-6'] },
      { day: 22, references: ['Philippians 1-4', 'Colossians 1-4'] },
      { day: 23, references: ['1 Thessalonians 1-5', '2 Thessalonians 1-3'] },
      { day: 24, references: ['1 Timothy 1-6'] },
      { day: 25, references: ['2 Timothy 1-4', 'Titus 1-3', 'Philemon 1'] },
      { day: 26, references: ['Hebrews 1-8'] },
      { day: 27, references: ['Hebrews 9-13'] },
      { day: 28, references: ['James 1-5', '1 Peter 1-5'] },
      { day: 29, references: ['2 Peter 1-3', '1 John 1-5', '2 John 1', '3 John 1', 'Jude 1'] },
      { day: 30, references: ['Revelation 1-22'] },
    ],
  },
  {
    id: '90-bible',
    label: '90-Day Whole Bible',
    description: 'Read the whole Bible in 90 days.',
    totalDays: 90,
    readings: buildWholeBiblePlan(90),
  },
  {
    id: '365-bible',
    label: '1-Year Whole Bible',
    description: 'Read the whole Bible in a year.',
    totalDays: 365,
    readings: buildWholeBiblePlan(365),
  },
]

export const getPlanById = (planId) =>
  readingPlans.find((plan) => plan.id === planId) || readingPlans[0]

export const getReadingForDay = (plan, dayNumber) =>
  plan?.readings?.find((reading) => reading.day === dayNumber)
