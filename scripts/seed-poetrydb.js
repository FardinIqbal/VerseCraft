/**
 * Comprehensive seed script for VerseCraft
 * Fetches all poems from PoetryDB and seeds the database
 */

const SUPABASE_URL = 'https://lgvjzynnckmjleyqxtai.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wonqskdZRJ6TwDnOcxQlLA_yg0keYlQ';

// Maximum lines for a poem to be included (for Reels-style experience)
const MAX_LINES = 40;
// Minimum lines (filter out single-line fragments)
const MIN_LINES = 2;

async function fetchAllPoems() {
  console.log('Fetching all poems from PoetryDB...');

  // Fetch all poems at once
  const response = await fetch('https://poetrydb.org/author');
  const { authors } = await response.json();

  console.log(`Found ${authors.length} authors`);

  const allPoems = [];

  // Fetch poems by author in batches to avoid overwhelming the API
  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    try {
      const poetryResponse = await fetch(`https://poetrydb.org/author/${encodeURIComponent(author)}`);
      const poems = await poetryResponse.json();

      if (Array.isArray(poems)) {
        // Filter poems by line count
        const validPoems = poems.filter(p => {
          const lineCount = parseInt(p.linecount) || p.lines?.length || 0;
          return lineCount >= MIN_LINES && lineCount <= MAX_LINES;
        });

        allPoems.push(...validPoems);
        console.log(`[${i + 1}/${authors.length}] ${author}: ${validPoems.length}/${poems.length} poems (filtered by length)`);
      }

      // Small delay to be nice to the API
      await new Promise(r => setTimeout(r, 100));
    } catch (error) {
      console.error(`Error fetching ${author}:`, error.message);
    }
  }

  return allPoems;
}

async function clearExistingSeededPosts() {
  console.log('Clearing existing seeded posts...');

  const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?is_seeded=eq.1`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    console.log('Cleared existing seeded posts');
  } else {
    console.error('Error clearing posts:', await response.text());
  }
}

async function seedPoems(poems) {
  console.log(`\nSeeding ${poems.length} poems to database...`);

  const posts = poems.map(poem => ({
    content: Array.isArray(poem.lines) ? poem.lines.join('\n') : poem.lines,
    author: poem.author,
    source: poem.title,
    type: 'poetry',
    is_seeded: 1,
    likes_count: Math.floor(Math.random() * 1000) + 10,
    comments_count: Math.floor(Math.random() * 50)
  }));

  // Insert in batches
  const batchSize = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
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
        process.stdout.write(`\rInserted ${inserted}/${posts.length} poems...`);
      } else {
        errors += batch.length;
        console.error(`\nError inserting batch: ${await response.text()}`);
      }
    } catch (error) {
      errors += batch.length;
      console.error(`\nNetwork error: ${error.message}`);
    }
  }

  console.log(`\n\nDone! Successfully seeded ${inserted} poems. Errors: ${errors}`);
}

async function addFamousQuotes() {
  console.log('\nAdding famous literary quotes...');

  // Add curated quotes that aren't in PoetryDB
  const quotes = [
    { content: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde", source: "The Soul of Man Under Socialism", type: "quote" },
    { content: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde", source: "Lady Windermere's Fan", type: "quote" },
    { content: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", source: null, type: "quote" },
    { content: "The wound is the place where the Light enters you.", author: "Rumi", source: null, type: "quote" },
    { content: "What you seek is seeking you.", author: "Rumi", source: null, type: "quote" },
    { content: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi", source: null, type: "quote" },
    { content: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.", author: "Rumi", source: null, type: "quote" },
    { content: "Out beyond ideas of wrongdoing and rightdoing, there is a field. I'll meet you there.", author: "Rumi", source: null, type: "quote" },
    { content: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", source: "Meditations", type: "quote" },
    { content: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius", source: "Meditations", type: "quote" },
    { content: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", source: "Meditations", type: "quote" },
    { content: "We suffer more often in imagination than in reality.", author: "Seneca", source: "Letters from a Stoic", type: "quote" },
    { content: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca", source: "On the Shortness of Life", type: "quote" },
    { content: "Luck is what happens when preparation meets opportunity.", author: "Seneca", source: null, type: "quote" },
    { content: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", source: "Twilight of the Idols", type: "quote" },
    { content: "And those who were seen dancing were thought to be insane by those who could not hear the music.", author: "Friedrich Nietzsche", source: null, type: "quote" },
    { content: "Without music, life would be a mistake.", author: "Friedrich Nietzsche", source: "Twilight of the Idols", type: "quote" },
    { content: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus", source: "Return to Tipasa", type: "quote" },
    { content: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", author: "Albert Camus", source: null, type: "quote" },
    { content: "Should I kill myself, or have a cup of coffee?", author: "Albert Camus", source: "A Happy Death", type: "quote" },
    { content: "A book must be the axe for the frozen sea within us.", author: "Franz Kafka", source: "Letters to Oskar Pollak", type: "quote" },
    { content: "I am a cage, in search of a bird.", author: "Franz Kafka", source: "Aphorisms", type: "quote" },
    { content: "Pain and suffering are always inevitable for a large intelligence and a deep heart.", author: "Fyodor Dostoevsky", source: "Crime and Punishment", type: "quote" },
    { content: "To go wrong in one's own way is better than to go right in someone else's.", author: "Fyodor Dostoevsky", source: "Crime and Punishment", type: "quote" },
    { content: "All happy families are alike; each unhappy family is unhappy in its own way.", author: "Leo Tolstoy", source: "Anna Karenina", type: "quote" },
    { content: "Everyone thinks of changing the world, but no one thinks of changing himself.", author: "Leo Tolstoy", source: null, type: "quote" },
    { content: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou", source: null, type: "quote" },
    { content: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou", source: "I Know Why the Caged Bird Sings", type: "quote" },
    { content: "I took a deep breath and listened to the old brag of my heart. I am, I am, I am.", author: "Sylvia Plath", source: "The Bell Jar", type: "quote" },
    { content: "One cannot think well, love well, sleep well, if one has not dined well.", author: "Virginia Woolf", source: "A Room of One's Own", type: "quote" },
    { content: "Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.", author: "Virginia Woolf", source: "A Room of One's Own", type: "quote" },
    { content: "And once the storm is over, you won't remember how you made it through, how you managed to survive. You won't even be sure, whether the storm is really over. But one thing is certain. When you come out of the storm, you won't be the same person who walked in.", author: "Haruki Murakami", source: "Kafka on the Shore", type: "quote" },
    { content: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.", author: "Haruki Murakami", source: "Norwegian Wood", type: "quote" },
    { content: "We don't see things as they are, we see them as we are.", author: "Anaïs Nin", source: "Seduction of the Minotaur", type: "quote" },
    { content: "Life shrinks or expands in proportion to one's courage.", author: "Anaïs Nin", source: "The Diary of Anaïs Nin", type: "quote" },
    { content: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges", source: "Poem of the Gifts", type: "quote" },
    { content: "And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is invisible to the eye.", author: "Antoine de Saint-Exupéry", source: "The Little Prince", type: "quote" },
    { content: "You become responsible, forever, for what you have tamed.", author: "Antoine de Saint-Exupéry", source: "The Little Prince", type: "quote" },
    { content: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson", source: null, type: "quote" },
    { content: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", source: null, type: "quote" },
    { content: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.", author: "Henry David Thoreau", source: "Walden", type: "quote" },
    { content: "Not until we are lost do we begin to understand ourselves.", author: "Henry David Thoreau", source: "Walden", type: "quote" },
    { content: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus", source: "Enchiridion", type: "quote" },
    { content: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus", source: "Discourses", type: "quote" },
    { content: "Life can only be understood backwards; but it must be lived forwards.", author: "Søren Kierkegaard", source: null, type: "quote" },
    { content: "Anxiety is the dizziness of freedom.", author: "Søren Kierkegaard", source: "The Concept of Anxiety", type: "quote" },
    { content: "I want to do with you what spring does with the cherry trees.", author: "Pablo Neruda", source: "Twenty Love Poems and a Song of Despair", type: "quote" },
    { content: "Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.", author: "Khalil Gibran", source: "Broken Wings", type: "quote" },
    { content: "Some of us think holding on makes us strong, but sometimes it is letting go.", author: "Hermann Hesse", source: null, type: "quote" },
    { content: "It is not true that people stop pursuing dreams because they grow old, they grow old because they stop pursuing dreams.", author: "Gabriel García Márquez", source: null, type: "quote" },
    { content: "No matter what, nobody can take away the dances you've already had.", author: "Gabriel García Márquez", source: "Memories of My Melancholy Whores", type: "quote" },
  ];

  const posts = quotes.map(q => ({
    content: q.content,
    author: q.author,
    source: q.source,
    type: q.type,
    is_seeded: 1,
    likes_count: Math.floor(Math.random() * 2000) + 100,
    comments_count: Math.floor(Math.random() * 100)
  }));

  const response = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(posts)
  });

  if (response.ok) {
    console.log(`Added ${quotes.length} famous quotes`);
  } else {
    console.error('Error adding quotes:', await response.text());
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('VerseCraft Comprehensive Poetry Seeder');
  console.log('='.repeat(60));

  // Clear existing seeded posts
  await clearExistingSeededPosts();

  // Fetch and seed poems from PoetryDB
  const poems = await fetchAllPoems();
  console.log(`\nTotal poems collected: ${poems.length}`);

  await seedPoems(poems);

  // Add famous quotes
  await addFamousQuotes();

  console.log('\n' + '='.repeat(60));
  console.log('Seeding complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);
