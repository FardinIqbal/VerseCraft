import { db } from "../src/lib/db";
import { posts } from "../src/lib/db/schema";

const seedData = [
  // Emily Dickinson
  {
    content: `Hope is the thing with feathers
That perches in the soul,
And sings the tune without the words,
And never stops at all,

And sweetest in the gale is heard;
And sore must be the storm
That could abash the little bird
That kept so many warm.

I've heard it in the chillest land,
And on the strangest sea;
Yet, never, in extremity,
It asked a crumb of me.`,
    author: "Emily Dickinson",
    source: "Hope is the thing with feathers",
    type: "poetry" as const,
  },
  {
    content: `Because I could not stop for Death –
He kindly stopped for me –
The Carriage held but just Ourselves –
And Immortality.`,
    author: "Emily Dickinson",
    source: "Because I could not stop for Death",
    type: "poetry" as const,
  },
  {
    content: `I'm nobody! Who are you?
Are you nobody, too?
Then there's a pair of us — don't tell!
They'd banish us, you know.

How dreary to be somebody!
How public, like a frog
To tell your name the livelong day
To an admiring bog!`,
    author: "Emily Dickinson",
    source: "I'm Nobody! Who are you?",
    type: "poetry" as const,
  },

  // Robert Frost
  {
    content: `Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same,

And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.

I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.`,
    author: "Robert Frost",
    source: "The Road Not Taken",
    type: "poetry" as const,
  },
  {
    content: `The woods are lovely, dark and deep,
But I have promises to keep,
And miles to go before I sleep,
And miles to go before I sleep.`,
    author: "Robert Frost",
    source: "Stopping by Woods on a Snowy Evening",
    type: "poetry" as const,
  },
  {
    content: `Nature's first green is gold,
Her hardest hue to hold.
Her early leaf's a flower;
But only so an hour.
Then leaf subsides to leaf.
So Eden sank to grief,
So dawn goes down to day.
Nothing gold can stay.`,
    author: "Robert Frost",
    source: "Nothing Gold Can Stay",
    type: "poetry" as const,
  },

  // William Shakespeare
  {
    content: `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date.`,
    author: "William Shakespeare",
    source: "Sonnet 18",
    type: "poetry" as const,
  },
  {
    content: `To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles
And by opposing end them.`,
    author: "William Shakespeare",
    source: "Hamlet",
    type: "prose" as const,
  },
  {
    content: `All the world's a stage,
And all the men and women merely players;
They have their exits and their entrances,
And one man in his time plays many parts.`,
    author: "William Shakespeare",
    source: "As You Like It",
    type: "poetry" as const,
  },

  // Oscar Wilde
  {
    content: `To live is the rarest thing in the world. Most people exist, that is all.`,
    author: "Oscar Wilde",
    source: "The Soul of Man Under Socialism",
    type: "quote" as const,
  },
  {
    content: `We are all in the gutter, but some of us are looking at the stars.`,
    author: "Oscar Wilde",
    source: "Lady Windermere's Fan",
    type: "quote" as const,
  },
  {
    content: `Be yourself; everyone else is already taken.`,
    author: "Oscar Wilde",
    source: null,
    type: "quote" as const,
  },
  {
    content: `I have the simplest tastes. I am always satisfied with the best.`,
    author: "Oscar Wilde",
    source: null,
    type: "quote" as const,
  },

  // Pablo Neruda
  {
    content: `I want to do with you what spring does with the cherry trees.`,
    author: "Pablo Neruda",
    source: "Twenty Love Poems and a Song of Despair",
    type: "quote" as const,
  },
  {
    content: `I love you without knowing how, or when, or from where.
I love you simply, without problems or pride:
I love you in this way because I do not know any other way of loving
but this, in which there is no I or you,
so intimate that your hand upon my chest is my hand,
so intimate that when I fall asleep your eyes close.`,
    author: "Pablo Neruda",
    source: "100 Love Sonnets",
    type: "poetry" as const,
  },

  // Rumi
  {
    content: `Out beyond ideas of wrongdoing and rightdoing,
there is a field. I'll meet you there.

When the soul lies down in that grass,
the world is too full to talk about.
Ideas, language, even the phrase "each other"
doesn't make any sense.`,
    author: "Rumi",
    source: "A Great Wagon",
    type: "poetry" as const,
  },
  {
    content: `The wound is the place where the Light enters you.`,
    author: "Rumi",
    source: null,
    type: "quote" as const,
  },
  {
    content: `What you seek is seeking you.`,
    author: "Rumi",
    source: null,
    type: "quote" as const,
  },
  {
    content: `You are not a drop in the ocean. You are the entire ocean in a drop.`,
    author: "Rumi",
    source: null,
    type: "quote" as const,
  },
  {
    content: `Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.`,
    author: "Rumi",
    source: null,
    type: "quote" as const,
  },

  // Edgar Allan Poe
  {
    content: `Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
While I nodded, nearly napping, suddenly there came a tapping,
As of some one gently rapping, rapping at my chamber door.
"'Tis some visitor," I muttered, "tapping at my chamber door—
Only this and nothing more."`,
    author: "Edgar Allan Poe",
    source: "The Raven",
    type: "poetry" as const,
  },
  {
    content: `Deep into that darkness peering, long I stood there wondering, fearing,
Doubting, dreaming dreams no mortal ever dared to dream before.`,
    author: "Edgar Allan Poe",
    source: "The Raven",
    type: "poetry" as const,
  },

  // Walt Whitman
  {
    content: `I celebrate myself, and sing myself,
And what I assume you shall assume,
For every atom belonging to me as good belongs to you.`,
    author: "Walt Whitman",
    source: "Song of Myself",
    type: "poetry" as const,
  },
  {
    content: `Do I contradict myself?
Very well then I contradict myself,
(I am large, I contain multitudes.)`,
    author: "Walt Whitman",
    source: "Song of Myself",
    type: "poetry" as const,
  },
  {
    content: `Keep your face always toward the sunshine—and shadows will fall behind you.`,
    author: "Walt Whitman",
    source: null,
    type: "quote" as const,
  },

  // Maya Angelou
  {
    content: `You may write me down in history
With your bitter, twisted lies,
You may trod me in the very dirt
But still, like dust, I'll rise.`,
    author: "Maya Angelou",
    source: "Still I Rise",
    type: "poetry" as const,
  },
  {
    content: `There is no greater agony than bearing an untold story inside you.`,
    author: "Maya Angelou",
    source: "I Know Why the Caged Bird Sings",
    type: "quote" as const,
  },
  {
    content: `I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.`,
    author: "Maya Angelou",
    source: null,
    type: "quote" as const,
  },

  // Langston Hughes
  {
    content: `What happens to a dream deferred?

Does it dry up
like a raisin in the sun?
Or fester like a sore—
And then run?
Does it stink like rotten meat?
Or crust and sugar over—
like a syrupy sweet?

Maybe it just sags
like a heavy load.

Or does it explode?`,
    author: "Langston Hughes",
    source: "Harlem",
    type: "poetry" as const,
  },
  {
    content: `Hold fast to dreams
For if dreams die
Life is a broken-winged bird
That cannot fly.

Hold fast to dreams
For when dreams go
Life is a barren field
Frozen with snow.`,
    author: "Langston Hughes",
    source: "Dreams",
    type: "poetry" as const,
  },

  // T.S. Eliot
  {
    content: `Let us go then, you and I,
When the evening is spread out against the sky
Like a patient etherized upon a table.`,
    author: "T.S. Eliot",
    source: "The Love Song of J. Alfred Prufrock",
    type: "poetry" as const,
  },
  {
    content: `I have measured out my life with coffee spoons.`,
    author: "T.S. Eliot",
    source: "The Love Song of J. Alfred Prufrock",
    type: "quote" as const,
  },
  {
    content: `This is the way the world ends
Not with a bang but a whimper.`,
    author: "T.S. Eliot",
    source: "The Hollow Men",
    type: "poetry" as const,
  },

  // Sylvia Plath
  {
    content: `I took a deep breath and listened to the old brag of my heart. I am, I am, I am.`,
    author: "Sylvia Plath",
    source: "The Bell Jar",
    type: "quote" as const,
  },
  {
    content: `I shut my eyes and all the world drops dead;
I lift my lids and all is born again.
(I think I made you up inside my head.)`,
    author: "Sylvia Plath",
    source: "Mad Girl's Love Song",
    type: "poetry" as const,
  },

  // Virginia Woolf
  {
    content: `One cannot think well, love well, sleep well, if one has not dined well.`,
    author: "Virginia Woolf",
    source: "A Room of One's Own",
    type: "quote" as const,
  },
  {
    content: `You cannot find peace by avoiding life.`,
    author: "Virginia Woolf",
    source: "The Hours",
    type: "quote" as const,
  },
  {
    content: `Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.`,
    author: "Virginia Woolf",
    source: "A Room of One's Own",
    type: "quote" as const,
  },

  // Franz Kafka
  {
    content: `A book must be the axe for the frozen sea within us.`,
    author: "Franz Kafka",
    source: "Letters to Oskar Pollak",
    type: "quote" as const,
  },
  {
    content: `I am a cage, in search of a bird.`,
    author: "Franz Kafka",
    source: "Aphorisms",
    type: "quote" as const,
  },

  // Albert Camus
  {
    content: `In the midst of winter, I found there was, within me, an invincible summer.`,
    author: "Albert Camus",
    source: "Return to Tipasa",
    type: "quote" as const,
  },
  {
    content: `The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.`,
    author: "Albert Camus",
    source: null,
    type: "quote" as const,
  },
  {
    content: `Should I kill myself, or have a cup of coffee?`,
    author: "Albert Camus",
    source: "A Happy Death",
    type: "quote" as const,
  },

  // Friedrich Nietzsche
  {
    content: `He who has a why to live can bear almost any how.`,
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    type: "quote" as const,
  },
  {
    content: `And those who were seen dancing were thought to be insane by those who could not hear the music.`,
    author: "Friedrich Nietzsche",
    source: null,
    type: "quote" as const,
  },
  {
    content: `Without music, life would be a mistake.`,
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    type: "quote" as const,
  },

  // Marcus Aurelius
  {
    content: `You have power over your mind — not outside events. Realize this, and you will find strength.`,
    author: "Marcus Aurelius",
    source: "Meditations",
    type: "quote" as const,
  },
  {
    content: `The happiness of your life depends upon the quality of your thoughts.`,
    author: "Marcus Aurelius",
    source: "Meditations",
    type: "quote" as const,
  },
  {
    content: `Waste no more time arguing about what a good man should be. Be one.`,
    author: "Marcus Aurelius",
    source: "Meditations",
    type: "quote" as const,
  },

  // Fyodor Dostoevsky
  {
    content: `The soul is healed by being with children.`,
    author: "Fyodor Dostoevsky",
    source: "The Idiot",
    type: "quote" as const,
  },
  {
    content: `Pain and suffering are always inevitable for a large intelligence and a deep heart.`,
    author: "Fyodor Dostoevsky",
    source: "Crime and Punishment",
    type: "quote" as const,
  },
  {
    content: `To go wrong in one's own way is better than to go right in someone else's.`,
    author: "Fyodor Dostoevsky",
    source: "Crime and Punishment",
    type: "quote" as const,
  },

  // Leo Tolstoy
  {
    content: `All happy families are alike; each unhappy family is unhappy in its own way.`,
    author: "Leo Tolstoy",
    source: "Anna Karenina",
    type: "quote" as const,
  },
  {
    content: `Everyone thinks of changing the world, but no one thinks of changing himself.`,
    author: "Leo Tolstoy",
    source: null,
    type: "quote" as const,
  },

  // Khalil Gibran
  {
    content: `Your children are not your children.
They are the sons and daughters of Life's longing for itself.
They come through you but not from you,
And though they are with you yet they belong not to you.`,
    author: "Khalil Gibran",
    source: "The Prophet",
    type: "poetry" as const,
  },
  {
    content: `Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.`,
    author: "Khalil Gibran",
    source: "Broken Wings",
    type: "quote" as const,
  },

  // Mary Oliver
  {
    content: `Tell me, what is it you plan to do
with your one wild and precious life?`,
    author: "Mary Oliver",
    source: "The Summer Day",
    type: "poetry" as const,
  },
  {
    content: `Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift.`,
    author: "Mary Oliver",
    source: "Thirst",
    type: "poetry" as const,
  },
  {
    content: `Instructions for living a life:
Pay attention.
Be astonished.
Tell about it.`,
    author: "Mary Oliver",
    source: "Sometimes",
    type: "poetry" as const,
  },

  // W.B. Yeats
  {
    content: `Had I the heavens' embroidered cloths,
Enwrought with golden and silver light,
The blue and the dim and the dark cloths
Of night and light and the half light,
I would spread the cloths under your feet:
But I, being poor, have only my dreams;
I have spread my dreams under your feet;
Tread softly because you tread on my dreams.`,
    author: "W.B. Yeats",
    source: "He Wishes for the Cloths of Heaven",
    type: "poetry" as const,
  },
  {
    content: `Things fall apart; the centre cannot hold;
Mere anarchy is loosed upon the world.`,
    author: "W.B. Yeats",
    source: "The Second Coming",
    type: "poetry" as const,
  },

  // E.E. Cummings
  {
    content: `i carry your heart with me(i carry it in
my heart)i am never without it(anywhere
i go you go,my dear;and whatever is done
by only me is your doing,my darling)`,
    author: "E.E. Cummings",
    source: "i carry your heart with me",
    type: "poetry" as const,
  },
  {
    content: `To be nobody but yourself in a world which is doing its best, night and day, to make you everybody else means to fight the hardest battle which any human being can fight; and never stop fighting.`,
    author: "E.E. Cummings",
    source: null,
    type: "quote" as const,
  },

  // Jorge Luis Borges
  {
    content: `I have always imagined that Paradise will be a kind of library.`,
    author: "Jorge Luis Borges",
    source: "Poem of the Gifts",
    type: "quote" as const,
  },

  // Haruki Murakami
  {
    content: `And once the storm is over, you won't remember how you made it through, how you managed to survive. You won't even be sure, whether the storm is really over. But one thing is certain. When you come out of the storm, you won't be the same person who walked in.`,
    author: "Haruki Murakami",
    source: "Kafka on the Shore",
    type: "prose" as const,
  },
  {
    content: `If you only read the books that everyone else is reading, you can only think what everyone else is thinking.`,
    author: "Haruki Murakami",
    source: "Norwegian Wood",
    type: "quote" as const,
  },

  // Anaïs Nin
  {
    content: `We don't see things as they are, we see them as we are.`,
    author: "Anaïs Nin",
    source: "Seduction of the Minotaur",
    type: "quote" as const,
  },
  {
    content: `Life shrinks or expands in proportion to one's courage.`,
    author: "Anaïs Nin",
    source: "The Diary of Anaïs Nin",
    type: "quote" as const,
  },

  // Gabriel García Márquez
  {
    content: `It is not true that people stop pursuing dreams because they grow old, they grow old because they stop pursuing dreams.`,
    author: "Gabriel García Márquez",
    source: null,
    type: "quote" as const,
  },
  {
    content: `No matter what, nobody can take away the dances you've already had.`,
    author: "Gabriel García Márquez",
    source: "Memories of My Melancholy Whores",
    type: "quote" as const,
  },

  // Hermann Hesse
  {
    content: `I have been and still am a seeker, but I have ceased to question stars and books; I have begun to listen to the teaching my blood whispers to me.`,
    author: "Hermann Hesse",
    source: "Demian",
    type: "prose" as const,
  },
  {
    content: `Some of us think holding on makes us strong, but sometimes it is letting go.`,
    author: "Hermann Hesse",
    source: null,
    type: "quote" as const,
  },

  // Antoine de Saint-Exupéry
  {
    content: `And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is invisible to the eye.`,
    author: "Antoine de Saint-Exupéry",
    source: "The Little Prince",
    type: "quote" as const,
  },
  {
    content: `You become responsible, forever, for what you have tamed.`,
    author: "Antoine de Saint-Exupéry",
    source: "The Little Prince",
    type: "quote" as const,
  },

  // Ralph Waldo Emerson
  {
    content: `To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.`,
    author: "Ralph Waldo Emerson",
    source: null,
    type: "quote" as const,
  },
  {
    content: `What lies behind us and what lies before us are tiny matters compared to what lies within us.`,
    author: "Ralph Waldo Emerson",
    source: null,
    type: "quote" as const,
  },

  // Henry David Thoreau
  {
    content: `I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.`,
    author: "Henry David Thoreau",
    source: "Walden",
    type: "prose" as const,
  },
  {
    content: `Not until we are lost do we begin to understand ourselves.`,
    author: "Henry David Thoreau",
    source: "Walden",
    type: "quote" as const,
  },

  // Seneca
  {
    content: `We suffer more often in imagination than in reality.`,
    author: "Seneca",
    source: "Letters from a Stoic",
    type: "quote" as const,
  },
  {
    content: `It is not that we have a short time to live, but that we waste a lot of it.`,
    author: "Seneca",
    source: "On the Shortness of Life",
    type: "quote" as const,
  },
  {
    content: `Luck is what happens when preparation meets opportunity.`,
    author: "Seneca",
    source: null,
    type: "quote" as const,
  },

  // Epictetus
  {
    content: `It's not what happens to you, but how you react to it that matters.`,
    author: "Epictetus",
    source: "Enchiridion",
    type: "quote" as const,
  },
  {
    content: `First say to yourself what you would be; and then do what you have to do.`,
    author: "Epictetus",
    source: "Discourses",
    type: "quote" as const,
  },

  // Søren Kierkegaard
  {
    content: `Life can only be understood backwards; but it must be lived forwards.`,
    author: "Søren Kierkegaard",
    source: null,
    type: "quote" as const,
  },
  {
    content: `Anxiety is the dizziness of freedom.`,
    author: "Søren Kierkegaard",
    source: "The Concept of Anxiety",
    type: "quote" as const,
  },
];

async function seed() {
  console.log("Seeding database with literature...");

  const postsToInsert = seedData.map((item) => ({
    content: item.content,
    author: item.author,
    source: item.source,
    type: item.type,
    isSeeded: 1,
    likesCount: Math.floor(Math.random() * 500) + 50,
    commentsCount: Math.floor(Math.random() * 30),
  }));

  try {
    // Insert in batches of 5 to avoid parameter limits
    const batchSize = 5;
    for (let i = 0; i < postsToInsert.length; i += batchSize) {
      const batch = postsToInsert.slice(i, i + batchSize);
      await db.insert(posts).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(postsToInsert.length / batchSize)}`);
    }
    console.log(`Successfully seeded ${postsToInsert.length} posts!`);
  } catch (error) {
    console.error("Seeding error:", error);
  }

  process.exit(0);
}

seed();
