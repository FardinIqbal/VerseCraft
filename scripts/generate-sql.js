const seedData = [
  { content: `Hope is the thing with feathers\nThat perches in the soul,\nAnd sings the tune without the words,\nAnd never stops at all,\n\nAnd sweetest in the gale is heard;\nAnd sore must be the storm\nThat could abash the little bird\nThat kept so many warm.\n\nI've heard it in the chillest land,\nAnd on the strangest sea;\nYet, never, in extremity,\nIt asked a crumb of me.`, author: "Emily Dickinson", source: "Hope is the thing with feathers", type: "poetry" },
  { content: `Because I could not stop for Death –\nHe kindly stopped for me –\nThe Carriage held but just Ourselves –\nAnd Immortality.`, author: "Emily Dickinson", source: "Because I could not stop for Death", type: "poetry" },
  { content: `I'm nobody! Who are you?\nAre you nobody, too?\nThen there's a pair of us — don't tell!\nThey'd banish us, you know.\n\nHow dreary to be somebody!\nHow public, like a frog\nTo tell your name the livelong day\nTo an admiring bog!`, author: "Emily Dickinson", source: "I'm Nobody! Who are you?", type: "poetry" },
  { content: `Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nThen took the other, as just as fair,\nAnd having perhaps the better claim,\nBecause it was grassy and wanted wear;\nThough as for that the passing there\nHad worn them really about the same,\n\nAnd both that morning equally lay\nIn leaves no step had trodden black.\nOh, I kept the first for another day!\nYet knowing how way leads on to way,\nI doubted if I should ever come back.\n\nI shall be telling this with a sigh\nSomewhere ages and ages hence:\nTwo roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.`, author: "Robert Frost", source: "The Road Not Taken", type: "poetry" },
  { content: `The woods are lovely, dark and deep,\nBut I have promises to keep,\nAnd miles to go before I sleep,\nAnd miles to go before I sleep.`, author: "Robert Frost", source: "Stopping by Woods on a Snowy Evening", type: "poetry" },
  { content: `Nature's first green is gold,\nHer hardest hue to hold.\nHer early leaf's a flower;\nBut only so an hour.\nThen leaf subsides to leaf.\nSo Eden sank to grief,\nSo dawn goes down to day.\nNothing gold can stay.`, author: "Robert Frost", source: "Nothing Gold Can Stay", type: "poetry" },
  { content: `Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date.`, author: "William Shakespeare", source: "Sonnet 18", type: "poetry" },
  { content: `To be, or not to be, that is the question:\nWhether 'tis nobler in the mind to suffer\nThe slings and arrows of outrageous fortune,\nOr to take arms against a sea of troubles\nAnd by opposing end them.`, author: "William Shakespeare", source: "Hamlet", type: "prose" },
  { content: `All the world's a stage,\nAnd all the men and women merely players;\nThey have their exits and their entrances,\nAnd one man in his time plays many parts.`, author: "William Shakespeare", source: "As You Like It", type: "poetry" },
  { content: `To live is the rarest thing in the world. Most people exist, that is all.`, author: "Oscar Wilde", source: "The Soul of Man Under Socialism", type: "quote" },
  { content: `We are all in the gutter, but some of us are looking at the stars.`, author: "Oscar Wilde", source: "Lady Windermere's Fan", type: "quote" },
  { content: `Be yourself; everyone else is already taken.`, author: "Oscar Wilde", source: null, type: "quote" },
  { content: `I have the simplest tastes. I am always satisfied with the best.`, author: "Oscar Wilde", source: null, type: "quote" },
  { content: `I want to do with you what spring does with the cherry trees.`, author: "Pablo Neruda", source: "Twenty Love Poems and a Song of Despair", type: "quote" },
  { content: `I love you without knowing how, or when, or from where.\nI love you simply, without problems or pride:\nI love you in this way because I do not know any other way of loving\nbut this, in which there is no I or you,\nso intimate that your hand upon my chest is my hand,\nso intimate that when I fall asleep your eyes close.`, author: "Pablo Neruda", source: "100 Love Sonnets", type: "poetry" },
  { content: `Out beyond ideas of wrongdoing and rightdoing,\nthere is a field. I'll meet you there.\n\nWhen the soul lies down in that grass,\nthe world is too full to talk about.\nIdeas, language, even the phrase "each other"\ndoesn't make any sense.`, author: "Rumi", source: "A Great Wagon", type: "poetry" },
  { content: `The wound is the place where the Light enters you.`, author: "Rumi", source: null, type: "quote" },
  { content: `What you seek is seeking you.`, author: "Rumi", source: null, type: "quote" },
  { content: `You are not a drop in the ocean. You are the entire ocean in a drop.`, author: "Rumi", source: null, type: "quote" },
  { content: `Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.`, author: "Rumi", source: null, type: "quote" },
  { content: `Once upon a midnight dreary, while I pondered, weak and weary,\nOver many a quaint and curious volume of forgotten lore—\nWhile I nodded, nearly napping, suddenly there came a tapping,\nAs of some one gently rapping, rapping at my chamber door.\n"'Tis some visitor," I muttered, "tapping at my chamber door—\nOnly this and nothing more."`, author: "Edgar Allan Poe", source: "The Raven", type: "poetry" },
  { content: `Deep into that darkness peering, long I stood there wondering, fearing,\nDoubting, dreaming dreams no mortal ever dared to dream before.`, author: "Edgar Allan Poe", source: "The Raven", type: "poetry" },
  { content: `I celebrate myself, and sing myself,\nAnd what I assume you shall assume,\nFor every atom belonging to me as good belongs to you.`, author: "Walt Whitman", source: "Song of Myself", type: "poetry" },
  { content: `Do I contradict myself?\nVery well then I contradict myself,\n(I am large, I contain multitudes.)`, author: "Walt Whitman", source: "Song of Myself", type: "poetry" },
  { content: `Keep your face always toward the sunshine—and shadows will fall behind you.`, author: "Walt Whitman", source: null, type: "quote" },
  { content: `You may write me down in history\nWith your bitter, twisted lies,\nYou may trod me in the very dirt\nBut still, like dust, I'll rise.`, author: "Maya Angelou", source: "Still I Rise", type: "poetry" },
  { content: `There is no greater agony than bearing an untold story inside you.`, author: "Maya Angelou", source: "I Know Why the Caged Bird Sings", type: "quote" },
  { content: `I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.`, author: "Maya Angelou", source: null, type: "quote" },
  { content: `What happens to a dream deferred?\n\nDoes it dry up\nlike a raisin in the sun?\nOr fester like a sore—\nAnd then run?\nDoes it stink like rotten meat?\nOr crust and sugar over—\nlike a syrupy sweet?\n\nMaybe it just sags\nlike a heavy load.\n\nOr does it explode?`, author: "Langston Hughes", source: "Harlem", type: "poetry" },
  { content: `Hold fast to dreams\nFor if dreams die\nLife is a broken-winged bird\nThat cannot fly.\n\nHold fast to dreams\nFor when dreams go\nLife is a barren field\nFrozen with snow.`, author: "Langston Hughes", source: "Dreams", type: "poetry" },
  { content: `Let us go then, you and I,\nWhen the evening is spread out against the sky\nLike a patient etherized upon a table.`, author: "T.S. Eliot", source: "The Love Song of J. Alfred Prufrock", type: "poetry" },
  { content: `I have measured out my life with coffee spoons.`, author: "T.S. Eliot", source: "The Love Song of J. Alfred Prufrock", type: "quote" },
  { content: `This is the way the world ends\nNot with a bang but a whimper.`, author: "T.S. Eliot", source: "The Hollow Men", type: "poetry" },
  { content: `I took a deep breath and listened to the old brag of my heart. I am, I am, I am.`, author: "Sylvia Plath", source: "The Bell Jar", type: "quote" },
  { content: `I shut my eyes and all the world drops dead;\nI lift my lids and all is born again.\n(I think I made you up inside my head.)`, author: "Sylvia Plath", source: "Mad Girl's Love Song", type: "poetry" },
  { content: `One cannot think well, love well, sleep well, if one has not dined well.`, author: "Virginia Woolf", source: "A Room of One's Own", type: "quote" },
  { content: `You cannot find peace by avoiding life.`, author: "Virginia Woolf", source: "The Hours", type: "quote" },
  { content: `Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.`, author: "Virginia Woolf", source: "A Room of One's Own", type: "quote" },
  { content: `A book must be the axe for the frozen sea within us.`, author: "Franz Kafka", source: "Letters to Oskar Pollak", type: "quote" },
  { content: `I am a cage, in search of a bird.`, author: "Franz Kafka", source: "Aphorisms", type: "quote" },
  { content: `In the midst of winter, I found there was, within me, an invincible summer.`, author: "Albert Camus", source: "Return to Tipasa", type: "quote" },
  { content: `The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.`, author: "Albert Camus", source: null, type: "quote" },
  { content: `Should I kill myself, or have a cup of coffee?`, author: "Albert Camus", source: "A Happy Death", type: "quote" },
  { content: `He who has a why to live can bear almost any how.`, author: "Friedrich Nietzsche", source: "Twilight of the Idols", type: "quote" },
  { content: `And those who were seen dancing were thought to be insane by those who could not hear the music.`, author: "Friedrich Nietzsche", source: null, type: "quote" },
  { content: `Without music, life would be a mistake.`, author: "Friedrich Nietzsche", source: "Twilight of the Idols", type: "quote" },
  { content: `You have power over your mind — not outside events. Realize this, and you will find strength.`, author: "Marcus Aurelius", source: "Meditations", type: "quote" },
  { content: `The happiness of your life depends upon the quality of your thoughts.`, author: "Marcus Aurelius", source: "Meditations", type: "quote" },
  { content: `Waste no more time arguing about what a good man should be. Be one.`, author: "Marcus Aurelius", source: "Meditations", type: "quote" },
  { content: `The soul is healed by being with children.`, author: "Fyodor Dostoevsky", source: "The Idiot", type: "quote" },
  { content: `Pain and suffering are always inevitable for a large intelligence and a deep heart.`, author: "Fyodor Dostoevsky", source: "Crime and Punishment", type: "quote" },
  { content: `To go wrong in one's own way is better than to go right in someone else's.`, author: "Fyodor Dostoevsky", source: "Crime and Punishment", type: "quote" },
  { content: `All happy families are alike; each unhappy family is unhappy in its own way.`, author: "Leo Tolstoy", source: "Anna Karenina", type: "quote" },
  { content: `Everyone thinks of changing the world, but no one thinks of changing himself.`, author: "Leo Tolstoy", source: null, type: "quote" },
  { content: `Your children are not your children.\nThey are the sons and daughters of Life's longing for itself.\nThey come through you but not from you,\nAnd though they are with you yet they belong not to you.`, author: "Khalil Gibran", source: "The Prophet", type: "poetry" },
  { content: `Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.`, author: "Khalil Gibran", source: "Broken Wings", type: "quote" },
  { content: `Tell me, what is it you plan to do\nwith your one wild and precious life?`, author: "Mary Oliver", source: "The Summer Day", type: "poetry" },
  { content: `Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift.`, author: "Mary Oliver", source: "Thirst", type: "poetry" },
  { content: `Instructions for living a life:\nPay attention.\nBe astonished.\nTell about it.`, author: "Mary Oliver", source: "Sometimes", type: "poetry" },
  { content: `Had I the heavens' embroidered cloths,\nEnwrought with golden and silver light,\nThe blue and the dim and the dark cloths\nOf night and light and the half light,\nI would spread the cloths under your feet:\nBut I, being poor, have only my dreams;\nI have spread my dreams under your feet;\nTread softly because you tread on my dreams.`, author: "W.B. Yeats", source: "He Wishes for the Cloths of Heaven", type: "poetry" },
  { content: `Things fall apart; the centre cannot hold;\nMere anarchy is loosed upon the world.`, author: "W.B. Yeats", source: "The Second Coming", type: "poetry" },
  { content: `i carry your heart with me(i carry it in\nmy heart)i am never without it(anywhere\ni go you go,my dear;and whatever is done\nby only me is your doing,my darling)`, author: "E.E. Cummings", source: "i carry your heart with me", type: "poetry" },
  { content: `To be nobody but yourself in a world which is doing its best, night and day, to make you everybody else means to fight the hardest battle which any human being can fight; and never stop fighting.`, author: "E.E. Cummings", source: null, type: "quote" },
  { content: `I have always imagined that Paradise will be a kind of library.`, author: "Jorge Luis Borges", source: "Poem of the Gifts", type: "quote" },
  { content: `And once the storm is over, you won't remember how you made it through, how you managed to survive. You won't even be sure, whether the storm is really over. But one thing is certain. When you come out of the storm, you won't be the same person who walked in.`, author: "Haruki Murakami", source: "Kafka on the Shore", type: "prose" },
  { content: `If you only read the books that everyone else is reading, you can only think what everyone else is thinking.`, author: "Haruki Murakami", source: "Norwegian Wood", type: "quote" },
  { content: `We don't see things as they are, we see them as we are.`, author: "Anaïs Nin", source: "Seduction of the Minotaur", type: "quote" },
  { content: `Life shrinks or expands in proportion to one's courage.`, author: "Anaïs Nin", source: "The Diary of Anaïs Nin", type: "quote" },
  { content: `It is not true that people stop pursuing dreams because they grow old, they grow old because they stop pursuing dreams.`, author: "Gabriel García Márquez", source: null, type: "quote" },
  { content: `No matter what, nobody can take away the dances you've already had.`, author: "Gabriel García Márquez", source: "Memories of My Melancholy Whores", type: "quote" },
  { content: `I have been and still am a seeker, but I have ceased to question stars and books; I have begun to listen to the teaching my blood whispers to me.`, author: "Hermann Hesse", source: "Demian", type: "prose" },
  { content: `Some of us think holding on makes us strong, but sometimes it is letting go.`, author: "Hermann Hesse", source: null, type: "quote" },
  { content: `And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is invisible to the eye.`, author: "Antoine de Saint-Exupéry", source: "The Little Prince", type: "quote" },
  { content: `You become responsible, forever, for what you have tamed.`, author: "Antoine de Saint-Exupéry", source: "The Little Prince", type: "quote" },
  { content: `To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.`, author: "Ralph Waldo Emerson", source: null, type: "quote" },
  { content: `What lies behind us and what lies before us are tiny matters compared to what lies within us.`, author: "Ralph Waldo Emerson", source: null, type: "quote" },
  { content: `I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.`, author: "Henry David Thoreau", source: "Walden", type: "prose" },
  { content: `Not until we are lost do we begin to understand ourselves.`, author: "Henry David Thoreau", source: "Walden", type: "quote" },
  { content: `We suffer more often in imagination than in reality.`, author: "Seneca", source: "Letters from a Stoic", type: "quote" },
  { content: `It is not that we have a short time to live, but that we waste a lot of it.`, author: "Seneca", source: "On the Shortness of Life", type: "quote" },
  { content: `Luck is what happens when preparation meets opportunity.`, author: "Seneca", source: null, type: "quote" },
  { content: `It's not what happens to you, but how you react to it that matters.`, author: "Epictetus", source: "Enchiridion", type: "quote" },
  { content: `First say to yourself what you would be; and then do what you have to do.`, author: "Epictetus", source: "Discourses", type: "quote" },
  { content: `Life can only be understood backwards; but it must be lived forwards.`, author: "Søren Kierkegaard", source: null, type: "quote" },
  { content: `Anxiety is the dizziness of freedom.`, author: "Søren Kierkegaard", source: "The Concept of Anxiety", type: "quote" },
];

function escapeSQL(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

let sql = '-- VerseCraft Seed Data\n-- Run this in Supabase SQL Editor\n\n';
sql += 'INSERT INTO posts (content, author, source, type, is_seeded, likes_count, comments_count) VALUES\n';

const values = seedData.map((item) => {
  const likes = Math.floor(Math.random() * 500) + 50;
  const comments = Math.floor(Math.random() * 30);
  const source = item.source ? escapeSQL(item.source) : 'NULL';
  return `(${escapeSQL(item.content)}, ${escapeSQL(item.author)}, ${source}, '${item.type}', 1, ${likes}, ${comments})`;
});

sql += values.join(',\n') + ';';

console.log(sql);
