/**
 * Seed Authors for VerseCraft
 * Creates author profiles for literary figures with bios and portraits
 */

const SUPABASE_URL = 'https://lgvjzynnckmjleyqxtai.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wonqskdZRJ6TwDnOcxQlLA_yg0keYlQ';

// Comprehensive author data with bios and Wikimedia Commons portraits
const authors = [
  {
    name: "William Shakespeare",
    slug: "william-shakespeare",
    bio: "English playwright and poet, widely regarded as the greatest writer in the English language. His works include approximately 39 plays, 154 sonnets, and several longer poems.",
    birthYear: 1564,
    deathYear: 1616,
    nationality: "English",
    era: "Renaissance",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/440px-Shakespeare.jpg"
  },
  {
    name: "Emily Dickinson",
    slug: "emily-dickinson",
    bio: "American poet known for her unique style of short lines, slant rhyme, and unconventional punctuation. She wrote nearly 1,800 poems but fewer than a dozen were published in her lifetime.",
    birthYear: 1830,
    deathYear: 1886,
    nationality: "American",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Emily_Dickinson_daguerreotype_%28cropped%29.jpg"
  },
  {
    name: "Robert Frost",
    slug: "robert-frost",
    bio: "American poet known for his realistic depictions of rural life and command of American colloquial speech. He won four Pulitzer Prizes for Poetry.",
    birthYear: 1874,
    deathYear: 1963,
    nationality: "American",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Robert_Frost_NYWTS.jpg"
  },
  {
    name: "Edgar Allan Poe",
    slug: "edgar-allan-poe",
    bio: "American writer, poet, and literary critic, best known for his tales of mystery and the macabre. He is considered the inventor of detective fiction.",
    birthYear: 1809,
    deathYear: 1849,
    nationality: "American",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Edgar_Allan_Poe_2_retouched_and_transparent_bg.png"
  },
  {
    name: "Walt Whitman",
    slug: "walt-whitman",
    bio: "American poet, essayist, and journalist. His work 'Leaves of Grass' was considered highly controversial for its overt sensuality. He is often called the father of free verse.",
    birthYear: 1819,
    deathYear: 1892,
    nationality: "American",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Walt_Whitman_-_George_Collins_Cox.jpg"
  },
  {
    name: "Rumi",
    slug: "rumi",
    bio: "13th-century Persian poet, scholar, and Sufi mystic. His poems have been widely translated and he is often described as the best-selling poet in the United States.",
    birthYear: 1207,
    deathYear: 1273,
    nationality: "Persian",
    era: "Medieval",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Mevlana_Statue%2C_Buca.jpg"
  },
  {
    name: "Oscar Wilde",
    slug: "oscar-wilde",
    bio: "Irish poet and playwright. Known for his wit, flamboyant dress, and conversational skill, he became one of the most successful playwrights of late Victorian London.",
    birthYear: 1854,
    deathYear: 1900,
    nationality: "Irish",
    era: "Victorian",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Oscar_Wilde_Sarony.jpg"
  },
  {
    name: "Maya Angelou",
    slug: "maya-angelou",
    bio: "American poet, memoirist, and civil rights activist. She published seven autobiographies and received dozens of awards and more than 50 honorary degrees.",
    birthYear: 1928,
    deathYear: 2014,
    nationality: "American",
    era: "Contemporary",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Angelou_at_Clinton_inauguration_%28cropped_2%29.jpg"
  },
  {
    name: "Langston Hughes",
    slug: "langston-hughes",
    bio: "American poet and social activist. He was one of the earliest innovators of jazz poetry and a leader of the Harlem Renaissance.",
    birthYear: 1901,
    deathYear: 1967,
    nationality: "American",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Langston_Hughes_by_Carl_Van_Vechten_1936.jpg"
  },
  {
    name: "T.S. Eliot",
    slug: "ts-eliot",
    bio: "American-English poet, essayist, and playwright. Considered one of the 20th century's major poets, he won the Nobel Prize in Literature in 1948.",
    birthYear: 1888,
    deathYear: 1965,
    nationality: "American-British",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Thomas_Stearns_Eliot_by_Lady_Ottoline_Morrell_%281934%29.jpg"
  },
  {
    name: "Sylvia Plath",
    slug: "sylvia-plath",
    bio: "American poet, novelist, and short-story writer. Known for her confessional style of poetry, she won a posthumous Pulitzer Prize for her Collected Poems.",
    birthYear: 1932,
    deathYear: 1963,
    nationality: "American",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sylvia_Plath.jpg"
  },
  {
    name: "Pablo Neruda",
    slug: "pablo-neruda",
    bio: "Chilean poet-diplomat and politician who won the Nobel Prize for Literature in 1971. His works include surrealistic poems, historical epics, and political manifestos.",
    birthYear: 1904,
    deathYear: 1973,
    nationality: "Chilean",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/Pablo_Neruda_1963.jpg"
  },
  {
    name: "Marcus Aurelius",
    slug: "marcus-aurelius",
    bio: "Roman emperor and Stoic philosopher. His personal writings, known as 'Meditations', are a significant source of the modern understanding of Stoic philosophy.",
    birthYear: 121,
    deathYear: 180,
    nationality: "Roman",
    era: "Classical",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/MSR-ra-61-b-1-DM.jpg"
  },
  {
    name: "Seneca",
    slug: "seneca",
    bio: "Roman Stoic philosopher, statesman, and dramatist. His works have influenced later Western philosophy and helped shape the development of tragedy as a dramatic form.",
    birthYear: -4,
    deathYear: 65,
    nationality: "Roman",
    era: "Classical",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/Seneca-berlinantikensammlung-1.jpg"
  },
  {
    name: "Friedrich Nietzsche",
    slug: "friedrich-nietzsche",
    bio: "German philosopher, cultural critic, and poet whose work has exerted a profound influence on modern intellectual history. He wrote extensively on truth, morality, and human potential.",
    birthYear: 1844,
    deathYear: 1900,
    nationality: "German",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Nietzsche187a.jpg"
  },
  {
    name: "Albert Camus",
    slug: "albert-camus",
    bio: "French philosopher, author, and journalist. He won the Nobel Prize in Literature in 1957 for his work illuminating 'the problems of the human conscience in our times.'",
    birthYear: 1913,
    deathYear: 1960,
    nationality: "French",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Albert_Camus%2C_gagnant_de_prix_Nobel%2C_portrait_en_buste%2C_pos%C3%A9_au_bureau%2C_faisant_face_%C3%A0_gauche%2C_cigarette_de_tabagisme.jpg"
  },
  {
    name: "Franz Kafka",
    slug: "franz-kafka",
    bio: "German-speaking Bohemian novelist and short-story writer. His work, which fuses elements of realism and the fantastic, is considered a major contribution to 20th-century literature.",
    birthYear: 1883,
    deathYear: 1924,
    nationality: "Austrian-Czech",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Kafka1906_cropped.jpg"
  },
  {
    name: "Fyodor Dostoevsky",
    slug: "fyodor-dostoevsky",
    bio: "Russian novelist, philosopher, and short story writer. His psychological penetration into the human soul has influenced world literature and philosophy.",
    birthYear: 1821,
    deathYear: 1881,
    nationality: "Russian",
    era: "Victorian",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Dostoevsky_1872.jpg"
  },
  {
    name: "Leo Tolstoy",
    slug: "leo-tolstoy",
    bio: "Russian writer regarded as one of the greatest novelists of all time. His masterpieces 'War and Peace' and 'Anna Karenina' are landmarks of world literature.",
    birthYear: 1828,
    deathYear: 1910,
    nationality: "Russian",
    era: "Victorian",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/L.N.Tolstoy_Prokudin-Gorsky.jpg"
  },
  {
    name: "Virginia Woolf",
    slug: "virginia-woolf",
    bio: "English writer considered one of the most important modernist 20th-century authors. She pioneered the use of stream of consciousness as a narrative device.",
    birthYear: 1882,
    deathYear: 1941,
    nationality: "English",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg"
  },
  {
    name: "Haruki Murakami",
    slug: "haruki-murakami",
    bio: "Japanese writer whose novels and stories have been described as 'easily accessible, yet profoundly complex'. His work has been translated into 50 languages.",
    birthYear: 1949,
    deathYear: null,
    nationality: "Japanese",
    era: "Contemporary",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Murakami_Haruki_%282009%29.jpg"
  },
  {
    name: "Jorge Luis Borges",
    slug: "jorge-luis-borges",
    bio: "Argentine short-story writer, essayist, poet, and translator. His work embraces the 'character of unreality in all literature' and profoundly influenced magical realism.",
    birthYear: 1899,
    deathYear: 1986,
    nationality: "Argentine",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Jorge_Luis_Borges_1951%2C_by_Grete_Stern.jpg"
  },
  {
    name: "Khalil Gibran",
    slug: "khalil-gibran",
    bio: "Lebanese-American writer, poet, and visual artist. His book 'The Prophet' has been translated into over 100 languages, making it one of the most translated books in history.",
    birthYear: 1883,
    deathYear: 1931,
    nationality: "Lebanese-American",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Kahlil_Gibran_1913.jpg"
  },
  {
    name: "Mary Oliver",
    slug: "mary-oliver",
    bio: "American poet who won the National Book Award and the Pulitzer Prize. Her work focuses on the natural world and introspection, written in a clear and poignant style.",
    birthYear: 1935,
    deathYear: 2019,
    nationality: "American",
    era: "Contemporary",
    portraitUrl: null
  },
  {
    name: "W.B. Yeats",
    slug: "wb-yeats",
    bio: "Irish poet and dramatist. A pillar of the Irish literary establishment and a driving force behind the Irish Literary Revival, he won the Nobel Prize in Literature in 1923.",
    birthYear: 1865,
    deathYear: 1939,
    nationality: "Irish",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/William_Butler_Yeats_1.jpg"
  },
  {
    name: "E.E. Cummings",
    slug: "ee-cummings",
    bio: "American poet, painter, essayist, author, and playwright. He wrote approximately 2,900 poems and is known for his unconventional use of syntax and punctuation.",
    birthYear: 1894,
    deathYear: 1962,
    nationality: "American",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/E._E._Cummings_NYWTS.jpg"
  },
  {
    name: "Henry David Thoreau",
    slug: "henry-david-thoreau",
    bio: "American naturalist, essayist, poet, and philosopher. His book 'Walden' is a reflection on simple living in natural surroundings and a declaration of personal independence.",
    birthYear: 1817,
    deathYear: 1862,
    nationality: "American",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Henry_David_Thoreau.jpg"
  },
  {
    name: "Ralph Waldo Emerson",
    slug: "ralph-waldo-emerson",
    bio: "American essayist, lecturer, philosopher, and poet who led the transcendentalist movement. He was seen as a champion of individualism.",
    birthYear: 1803,
    deathYear: 1882,
    nationality: "American",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Ralph_Waldo_Emerson_ca1857_retouched.jpg"
  },
  {
    name: "Søren Kierkegaard",
    slug: "soren-kierkegaard",
    bio: "Danish philosopher, theologian, and poet. Considered the first existentialist philosopher, his work deals with questions of existence, individuality, and subjective experience.",
    birthYear: 1813,
    deathYear: 1855,
    nationality: "Danish",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/S%C3%B8ren_Kierkegaard_%281813-1855%29_-_%28cropped%29.jpg"
  },
  {
    name: "Epictetus",
    slug: "epictetus",
    bio: "Greek Stoic philosopher born as a slave. His teachings were written down by his student Arrian in the 'Discourses' and the handbook 'Enchiridion'.",
    birthYear: 50,
    deathYear: 135,
    nationality: "Greek",
    era: "Classical",
    portraitUrl: null
  },
  {
    name: "George Gordon Byron",
    slug: "lord-byron",
    bio: "English poet and leading figure of the Romantic movement. His works include 'Don Juan' and 'Childe Harold's Pilgrimage'. He is regarded as one of the greatest English poets.",
    birthYear: 1788,
    deathYear: 1824,
    nationality: "English",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Lord_Byron_in_Albanian_Dress_by_Thomas_Phillips%2C_1813.jpg"
  },
  {
    name: "Percy Bysshe Shelley",
    slug: "percy-bysshe-shelley",
    bio: "English Romantic poet regarded as one of the finest lyric poets in the English language. His major works include 'Ozymandias', 'Ode to the West Wind', and 'Prometheus Unbound'.",
    birthYear: 1792,
    deathYear: 1822,
    nationality: "English",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Percy_Bysshe_Shelley_by_Alfred_Clint.jpg"
  },
  {
    name: "John Keats",
    slug: "john-keats",
    bio: "English Romantic poet. His work became more popular after his death and influenced many later poets. He is known for his odes, which are among the most celebrated in English poetry.",
    birthYear: 1795,
    deathYear: 1821,
    nationality: "English",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/John_Keats_by_William_Hilton.jpg"
  },
  {
    name: "William Blake",
    slug: "william-blake",
    bio: "English poet, painter, and printmaker. Considered a seminal figure of Romanticism, his work 'Songs of Innocence and of Experience' is a classic of English poetry.",
    birthYear: 1757,
    deathYear: 1827,
    nationality: "English",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/William_Blake_by_Thomas_Phillips.jpg"
  },
  {
    name: "John Donne",
    slug: "john-donne",
    bio: "English poet and cleric in the Church of England. He is considered the preeminent representative of the metaphysical poets, known for his vibrant language and inventive metaphors.",
    birthYear: 1572,
    deathYear: 1631,
    nationality: "English",
    era: "Renaissance",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/John_Donne_BBC.jpg"
  },
  {
    name: "Christina Rossetti",
    slug: "christina-rossetti",
    bio: "English poet who wrote romantic, devotional, and children's poems. She is known for 'Goblin Market' and 'In the Bleak Midwinter', which became a popular Christmas carol.",
    birthYear: 1830,
    deathYear: 1894,
    nationality: "English",
    era: "Victorian",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/Dante_Gabriel_Rossetti_-_Christina_Rossetti.jpg"
  },
  {
    name: "Robert Burns",
    slug: "robert-burns",
    bio: "Scottish poet and lyricist widely regarded as the national poet of Scotland. He is celebrated worldwide on Burns Night (25 January) with haggis, whisky, and poetry.",
    birthYear: 1759,
    deathYear: 1796,
    nationality: "Scottish",
    era: "Romantic",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Robert_burns.jpg"
  },
  {
    name: "Antoine de Saint-Exupéry",
    slug: "antoine-de-saint-exupery",
    bio: "French writer, poet, and aviator. He is best known for his novella 'The Little Prince', which has become one of the best-selling books ever published.",
    birthYear: 1900,
    deathYear: 1944,
    nationality: "French",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Antoine_de_Saint-Exup%C3%A9ry.jpg"
  },
  {
    name: "Hermann Hesse",
    slug: "hermann-hesse",
    bio: "German-Swiss poet, novelist, and painter. He won the Nobel Prize in Literature in 1946. His best-known works include 'Steppenwolf', 'Siddhartha', and 'The Glass Bead Game'.",
    birthYear: 1877,
    deathYear: 1962,
    nationality: "German-Swiss",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Hermann_Hesse_2.jpg"
  },
  {
    name: "Gabriel García Márquez",
    slug: "gabriel-garcia-marquez",
    bio: "Colombian novelist, short-story writer, and journalist. His works of magical realism brought him the Nobel Prize in Literature in 1982. 'One Hundred Years of Solitude' is his masterpiece.",
    birthYear: 1927,
    deathYear: 2014,
    nationality: "Colombian",
    era: "Contemporary",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg"
  },
  {
    name: "Anaïs Nin",
    slug: "anais-nin",
    bio: "French-Cuban-American diarist, essayist, novelist, and writer of short stories and erotica. Her journals, spanning several decades, are considered an important work of literature.",
    birthYear: 1903,
    deathYear: 1977,
    nationality: "French-American",
    era: "Modern",
    portraitUrl: "https://upload.wikimedia.org/wikipedia/commons/5/58/Ana%C3%AFs_Nin.jpg"
  }
];

async function seedAuthors() {
  console.log('Seeding authors...\n');

  const authorsToInsert = authors.map(a => ({
    name: a.name,
    slug: a.slug,
    bio: a.bio,
    birth_year: a.birthYear,
    death_year: a.deathYear,
    nationality: a.nationality,
    era: a.era,
    portrait_url: a.portraitUrl,
    works_count: 0,
    followers_count: 0
  }));

  // Insert in batches
  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < authorsToInsert.length; i += batchSize) {
    const batch = authorsToInsert.slice(i, i + batchSize);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/authors`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(batch)
      });

      if (response.ok) {
        inserted += batch.length;
        console.log(`Inserted ${inserted}/${authorsToInsert.length} authors`);
      } else {
        const error = await response.text();
        console.error(`Error inserting batch: ${error}`);
      }
    } catch (error) {
      console.error(`Network error: ${error.message}`);
    }
  }

  console.log(`\nDone! Seeded ${inserted} author profiles.`);
}

async function linkPostsToAuthors() {
  console.log('\nLinking posts to authors...\n');

  // First, get all authors
  const authorsResponse = await fetch(`${SUPABASE_URL}/rest/v1/authors?select=id,name`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  const authorsList = await authorsResponse.json();

  // Create a map of author names to IDs
  const authorMap = {};
  authorsList.forEach(a => {
    authorMap[a.name.toLowerCase()] = a.id;
    // Also add variations
    if (a.name === "George Gordon Byron") {
      authorMap["george gordon, lord byron"] = a.id;
      authorMap["lord byron"] = a.id;
    }
  });

  // Get all posts with author names
  let offset = 0;
  const limit = 100;
  let updated = 0;

  while (true) {
    const postsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=id,author&is_seeded=eq.1&author_id=is.null&limit=${limit}&offset=${offset}`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    const posts = await postsResponse.json();

    if (!posts.length) break;

    for (const post of posts) {
      if (!post.author) continue;

      const authorId = authorMap[post.author.toLowerCase()];
      if (authorId) {
        await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ author_id: authorId })
        });
        updated++;
      }
    }

    console.log(`Processed ${offset + posts.length} posts, linked ${updated} to authors...`);
    offset += limit;

    if (posts.length < limit) break;
  }

  console.log(`\nLinked ${updated} posts to author profiles.`);
}

async function updateAuthorWorksCounts() {
  console.log('\nUpdating author works counts...\n');

  // Get all authors
  const authorsResponse = await fetch(`${SUPABASE_URL}/rest/v1/authors?select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  const authorsList = await authorsResponse.json();

  for (const author of authorsList) {
    // Count posts for this author
    const countResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?author_id=eq.${author.id}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'count=exact'
        }
      }
    );

    const count = countResponse.headers.get('content-range')?.split('/')[1] || '0';

    // Update author's works_count
    await fetch(`${SUPABASE_URL}/rest/v1/authors?id=eq.${author.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ works_count: parseInt(count) })
    });
  }

  console.log('Updated works counts for all authors.');
}

async function main() {
  console.log('='.repeat(60));
  console.log('VerseCraft Authors Seeder');
  console.log('='.repeat(60));
  console.log();

  await seedAuthors();
  await linkPostsToAuthors();
  await updateAuthorWorksCounts();

  console.log('\n' + '='.repeat(60));
  console.log('Authors seeding complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);
