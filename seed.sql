-- VerseCraft Seed Data
-- Run this in Supabase SQL Editor

INSERT INTO posts (content, author, source, type, is_seeded, likes_count, comments_count) VALUES
('Hope is the thing with feathers
That perches in the soul,
And sings the tune without the words,
And never stops at all,

And sweetest in the gale is heard;
And sore must be the storm
That could abash the little bird
That kept so many warm.

I''ve heard it in the chillest land,
And on the strangest sea;
Yet, never, in extremity,
It asked a crumb of me.', 'Emily Dickinson', 'Hope is the thing with feathers', 'poetry', 1, 58, 3),
('Because I could not stop for Death –
He kindly stopped for me –
The Carriage held but just Ourselves –
And Immortality.', 'Emily Dickinson', 'Because I could not stop for Death', 'poetry', 1, 270, 17),
('I''m nobody! Who are you?
Are you nobody, too?
Then there''s a pair of us — don''t tell!
They''d banish us, you know.

How dreary to be somebody!
How public, like a frog
To tell your name the livelong day
To an admiring bog!', 'Emily Dickinson', 'I''m Nobody! Who are you?', 'poetry', 1, 306, 14),
('Two roads diverged in a yellow wood,
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
And that has made all the difference.', 'Robert Frost', 'The Road Not Taken', 'poetry', 1, 548, 15),
('The woods are lovely, dark and deep,
But I have promises to keep,
And miles to go before I sleep,
And miles to go before I sleep.', 'Robert Frost', 'Stopping by Woods on a Snowy Evening', 'poetry', 1, 198, 15),
('Nature''s first green is gold,
Her hardest hue to hold.
Her early leaf''s a flower;
But only so an hour.
Then leaf subsides to leaf.
So Eden sank to grief,
So dawn goes down to day.
Nothing gold can stay.', 'Robert Frost', 'Nothing Gold Can Stay', 'poetry', 1, 483, 4),
('Shall I compare thee to a summer''s day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer''s lease hath all too short a date.', 'William Shakespeare', 'Sonnet 18', 'poetry', 1, 542, 10),
('To be, or not to be, that is the question:
Whether ''tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles
And by opposing end them.', 'William Shakespeare', 'Hamlet', 'prose', 1, 394, 17),
('All the world''s a stage,
And all the men and women merely players;
They have their exits and their entrances,
And one man in his time plays many parts.', 'William Shakespeare', 'As You Like It', 'poetry', 1, 369, 29),
('To live is the rarest thing in the world. Most people exist, that is all.', 'Oscar Wilde', 'The Soul of Man Under Socialism', 'quote', 1, 335, 21),
('We are all in the gutter, but some of us are looking at the stars.', 'Oscar Wilde', 'Lady Windermere''s Fan', 'quote', 1, 76, 3),
('Be yourself; everyone else is already taken.', 'Oscar Wilde', NULL, 'quote', 1, 56, 25),
('I have the simplest tastes. I am always satisfied with the best.', 'Oscar Wilde', NULL, 'quote', 1, 390, 18),
('I want to do with you what spring does with the cherry trees.', 'Pablo Neruda', 'Twenty Love Poems and a Song of Despair', 'quote', 1, 514, 6),
('I love you without knowing how, or when, or from where.
I love you simply, without problems or pride:
I love you in this way because I do not know any other way of loving
but this, in which there is no I or you,
so intimate that your hand upon my chest is my hand,
so intimate that when I fall asleep your eyes close.', 'Pablo Neruda', '100 Love Sonnets', 'poetry', 1, 453, 25),
('Out beyond ideas of wrongdoing and rightdoing,
there is a field. I''ll meet you there.

When the soul lies down in that grass,
the world is too full to talk about.
Ideas, language, even the phrase "each other"
doesn''t make any sense.', 'Rumi', 'A Great Wagon', 'poetry', 1, 252, 21),
('The wound is the place where the Light enters you.', 'Rumi', NULL, 'quote', 1, 110, 20),
('What you seek is seeking you.', 'Rumi', NULL, 'quote', 1, 526, 13),
('You are not a drop in the ocean. You are the entire ocean in a drop.', 'Rumi', NULL, 'quote', 1, 133, 19),
('Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.', 'Rumi', NULL, 'quote', 1, 297, 20),
('Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
While I nodded, nearly napping, suddenly there came a tapping,
As of some one gently rapping, rapping at my chamber door.
"''Tis some visitor," I muttered, "tapping at my chamber door—
Only this and nothing more."', 'Edgar Allan Poe', 'The Raven', 'poetry', 1, 540, 17),
('Deep into that darkness peering, long I stood there wondering, fearing,
Doubting, dreaming dreams no mortal ever dared to dream before.', 'Edgar Allan Poe', 'The Raven', 'poetry', 1, 360, 18),
('I celebrate myself, and sing myself,
And what I assume you shall assume,
For every atom belonging to me as good belongs to you.', 'Walt Whitman', 'Song of Myself', 'poetry', 1, 453, 28),
('Do I contradict myself?
Very well then I contradict myself,
(I am large, I contain multitudes.)', 'Walt Whitman', 'Song of Myself', 'poetry', 1, 490, 14),
('Keep your face always toward the sunshine—and shadows will fall behind you.', 'Walt Whitman', NULL, 'quote', 1, 134, 5),
('You may write me down in history
With your bitter, twisted lies,
You may trod me in the very dirt
But still, like dust, I''ll rise.', 'Maya Angelou', 'Still I Rise', 'poetry', 1, 373, 14),
('There is no greater agony than bearing an untold story inside you.', 'Maya Angelou', 'I Know Why the Caged Bird Sings', 'quote', 1, 527, 19),
('I''ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.', 'Maya Angelou', NULL, 'quote', 1, 208, 0),
('What happens to a dream deferred?

Does it dry up
like a raisin in the sun?
Or fester like a sore—
And then run?
Does it stink like rotten meat?
Or crust and sugar over—
like a syrupy sweet?

Maybe it just sags
like a heavy load.

Or does it explode?', 'Langston Hughes', 'Harlem', 'poetry', 1, 117, 4),
('Hold fast to dreams
For if dreams die
Life is a broken-winged bird
That cannot fly.

Hold fast to dreams
For when dreams go
Life is a barren field
Frozen with snow.', 'Langston Hughes', 'Dreams', 'poetry', 1, 62, 13),
('Let us go then, you and I,
When the evening is spread out against the sky
Like a patient etherized upon a table.', 'T.S. Eliot', 'The Love Song of J. Alfred Prufrock', 'poetry', 1, 521, 26),
('I have measured out my life with coffee spoons.', 'T.S. Eliot', 'The Love Song of J. Alfred Prufrock', 'quote', 1, 321, 29),
('This is the way the world ends
Not with a bang but a whimper.', 'T.S. Eliot', 'The Hollow Men', 'poetry', 1, 511, 18),
('I took a deep breath and listened to the old brag of my heart. I am, I am, I am.', 'Sylvia Plath', 'The Bell Jar', 'quote', 1, 527, 6),
('I shut my eyes and all the world drops dead;
I lift my lids and all is born again.
(I think I made you up inside my head.)', 'Sylvia Plath', 'Mad Girl''s Love Song', 'poetry', 1, 202, 13),
('One cannot think well, love well, sleep well, if one has not dined well.', 'Virginia Woolf', 'A Room of One''s Own', 'quote', 1, 73, 3),
('You cannot find peace by avoiding life.', 'Virginia Woolf', 'The Hours', 'quote', 1, 86, 11),
('Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.', 'Virginia Woolf', 'A Room of One''s Own', 'quote', 1, 438, 2),
('A book must be the axe for the frozen sea within us.', 'Franz Kafka', 'Letters to Oskar Pollak', 'quote', 1, 534, 5),
('I am a cage, in search of a bird.', 'Franz Kafka', 'Aphorisms', 'quote', 1, 482, 27),
('In the midst of winter, I found there was, within me, an invincible summer.', 'Albert Camus', 'Return to Tipasa', 'quote', 1, 166, 14),
('The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.', 'Albert Camus', NULL, 'quote', 1, 69, 26),
('Should I kill myself, or have a cup of coffee?', 'Albert Camus', 'A Happy Death', 'quote', 1, 404, 5),
('He who has a why to live can bear almost any how.', 'Friedrich Nietzsche', 'Twilight of the Idols', 'quote', 1, 261, 23),
('And those who were seen dancing were thought to be insane by those who could not hear the music.', 'Friedrich Nietzsche', NULL, 'quote', 1, 502, 25),
('Without music, life would be a mistake.', 'Friedrich Nietzsche', 'Twilight of the Idols', 'quote', 1, 274, 29),
('You have power over your mind — not outside events. Realize this, and you will find strength.', 'Marcus Aurelius', 'Meditations', 'quote', 1, 485, 15),
('The happiness of your life depends upon the quality of your thoughts.', 'Marcus Aurelius', 'Meditations', 'quote', 1, 402, 2),
('Waste no more time arguing about what a good man should be. Be one.', 'Marcus Aurelius', 'Meditations', 'quote', 1, 119, 4),
('The soul is healed by being with children.', 'Fyodor Dostoevsky', 'The Idiot', 'quote', 1, 175, 17),
('Pain and suffering are always inevitable for a large intelligence and a deep heart.', 'Fyodor Dostoevsky', 'Crime and Punishment', 'quote', 1, 320, 14),
('To go wrong in one''s own way is better than to go right in someone else''s.', 'Fyodor Dostoevsky', 'Crime and Punishment', 'quote', 1, 521, 28),
('All happy families are alike; each unhappy family is unhappy in its own way.', 'Leo Tolstoy', 'Anna Karenina', 'quote', 1, 222, 8),
('Everyone thinks of changing the world, but no one thinks of changing himself.', 'Leo Tolstoy', NULL, 'quote', 1, 311, 17),
('Your children are not your children.
They are the sons and daughters of Life''s longing for itself.
They come through you but not from you,
And though they are with you yet they belong not to you.', 'Khalil Gibran', 'The Prophet', 'poetry', 1, 275, 16),
('Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.', 'Khalil Gibran', 'Broken Wings', 'quote', 1, 399, 19),
('Tell me, what is it you plan to do
with your one wild and precious life?', 'Mary Oliver', 'The Summer Day', 'poetry', 1, 217, 19),
('Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift.', 'Mary Oliver', 'Thirst', 'poetry', 1, 505, 5),
('Instructions for living a life:
Pay attention.
Be astonished.
Tell about it.', 'Mary Oliver', 'Sometimes', 'poetry', 1, 292, 14),
('Had I the heavens'' embroidered cloths,
Enwrought with golden and silver light,
The blue and the dim and the dark cloths
Of night and light and the half light,
I would spread the cloths under your feet:
But I, being poor, have only my dreams;
I have spread my dreams under your feet;
Tread softly because you tread on my dreams.', 'W.B. Yeats', 'He Wishes for the Cloths of Heaven', 'poetry', 1, 365, 18),
('Things fall apart; the centre cannot hold;
Mere anarchy is loosed upon the world.', 'W.B. Yeats', 'The Second Coming', 'poetry', 1, 98, 8),
('i carry your heart with me(i carry it in
my heart)i am never without it(anywhere
i go you go,my dear;and whatever is done
by only me is your doing,my darling)', 'E.E. Cummings', 'i carry your heart with me', 'poetry', 1, 253, 14),
('To be nobody but yourself in a world which is doing its best, night and day, to make you everybody else means to fight the hardest battle which any human being can fight; and never stop fighting.', 'E.E. Cummings', NULL, 'quote', 1, 270, 4),
('I have always imagined that Paradise will be a kind of library.', 'Jorge Luis Borges', 'Poem of the Gifts', 'quote', 1, 217, 19),
('And once the storm is over, you won''t remember how you made it through, how you managed to survive. You won''t even be sure, whether the storm is really over. But one thing is certain. When you come out of the storm, you won''t be the same person who walked in.', 'Haruki Murakami', 'Kafka on the Shore', 'prose', 1, 223, 19),
('If you only read the books that everyone else is reading, you can only think what everyone else is thinking.', 'Haruki Murakami', 'Norwegian Wood', 'quote', 1, 381, 1),
('We don''t see things as they are, we see them as we are.', 'Anaïs Nin', 'Seduction of the Minotaur', 'quote', 1, 177, 17),
('Life shrinks or expands in proportion to one''s courage.', 'Anaïs Nin', 'The Diary of Anaïs Nin', 'quote', 1, 117, 9),
('It is not true that people stop pursuing dreams because they grow old, they grow old because they stop pursuing dreams.', 'Gabriel García Márquez', NULL, 'quote', 1, 111, 9),
('No matter what, nobody can take away the dances you''ve already had.', 'Gabriel García Márquez', 'Memories of My Melancholy Whores', 'quote', 1, 196, 11),
('I have been and still am a seeker, but I have ceased to question stars and books; I have begun to listen to the teaching my blood whispers to me.', 'Hermann Hesse', 'Demian', 'prose', 1, 203, 8),
('Some of us think holding on makes us strong, but sometimes it is letting go.', 'Hermann Hesse', NULL, 'quote', 1, 230, 2),
('And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is invisible to the eye.', 'Antoine de Saint-Exupéry', 'The Little Prince', 'quote', 1, 322, 20),
('You become responsible, forever, for what you have tamed.', 'Antoine de Saint-Exupéry', 'The Little Prince', 'quote', 1, 306, 16),
('To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.', 'Ralph Waldo Emerson', NULL, 'quote', 1, 377, 0),
('What lies behind us and what lies before us are tiny matters compared to what lies within us.', 'Ralph Waldo Emerson', NULL, 'quote', 1, 312, 28),
('I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.', 'Henry David Thoreau', 'Walden', 'prose', 1, 70, 27),
('Not until we are lost do we begin to understand ourselves.', 'Henry David Thoreau', 'Walden', 'quote', 1, 127, 10),
('We suffer more often in imagination than in reality.', 'Seneca', 'Letters from a Stoic', 'quote', 1, 316, 14),
('It is not that we have a short time to live, but that we waste a lot of it.', 'Seneca', 'On the Shortness of Life', 'quote', 1, 447, 0),
('Luck is what happens when preparation meets opportunity.', 'Seneca', NULL, 'quote', 1, 140, 20),
('It''s not what happens to you, but how you react to it that matters.', 'Epictetus', 'Enchiridion', 'quote', 1, 139, 24),
('First say to yourself what you would be; and then do what you have to do.', 'Epictetus', 'Discourses', 'quote', 1, 463, 28),
('Life can only be understood backwards; but it must be lived forwards.', 'Søren Kierkegaard', NULL, 'quote', 1, 430, 17),
('Anxiety is the dizziness of freedom.', 'Søren Kierkegaard', 'The Concept of Anxiety', 'quote', 1, 102, 18);
