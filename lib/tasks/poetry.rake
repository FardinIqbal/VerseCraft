# lib/tasks/poetry.rake
namespace :poetry do
  desc "Seed Shakespeare's poetry into the database"
  task seed_shakespeare: :environment do
    puts "Starting Shakespeare poetry seeding..."

    # Create Shakespeare user
    shakespeare = User.find_or_create_by!(email: 'william.shakespeare@historical.com') do |user|
      user.password = SecureRandom.hex(10)
      user.bio = <<~BIO
        William Shakespeare (1564-1626) was an English playwright, poet, and actor. 
        He wrote approximately 37 plays and 154 sonnets, as well as other poems.
        He is often called England's national poet and the "Bard of Avon."
      BIO
      user.location = "Stratford-upon-Avon, England"
    end

    puts "Shakespeare user created or found."

    # Seed Sonnets
    puts "Seeding sonnets..."
    sonnets_data = File.read(Rails.root.join('lib', 'assets', 'shakespeare', 'sonnets.json'))
    sonnets = JSON.parse(sonnets_data)

    sonnets.each do |sonnet|
      shakespeare.poems.find_or_create_by!(title: "Sonnet #{sonnet['number']}") do |poem|
        poem.content = sonnet['text']
        poem.published_year = 1609
        poem.source = "Project Gutenberg"
        poem.source_url = "https://www.gutenberg.org/ebooks/1041"
        poem.public_domain = true
        print "."
      end
    end

    # Seed longer poems
    puts "\nSeeding longer poems..."
    longer_poems = [
      {
        title: "Venus and Adonis",
        published_year: 1593,
        file_name: 'venus_and_adonis.txt'
      },
      {
        title: "The Rape of Lucrece",
        published_year: 1594,
        file_name: 'rape_of_lucrece.txt'
      }
    ]

    longer_poems.each do |poem_data|
      content = File.read(Rails.root.join('lib', 'assets', 'shakespeare', poem_data[:file_name]))

      shakespeare.poems.find_or_create_by!(title: poem_data[:title]) do |poem|
        poem.content = content
        poem.published_year = poem_data[:published_year]
        poem.source = "Project Gutenberg"
        poem.source_url = "https://www.gutenberg.org/ebooks/1045"
        poem.public_domain = true
        puts "Created #{poem_data[:title]}"
      end
    end

    puts "\nCompleted seeding Shakespeare's poetry!"
  end

  desc "Add proper formatting to Shakespeare's poems"
  task format_poems: :environment do
    puts "Formatting Shakespeare's poems..."

    User.find_by(email: 'william.shakespeare@historical.com')&.poems&.find_each do |poem|
      formatted_content = format_poem_content(poem.content)
      poem.update(content: formatted_content)
      print "."
    end

    puts "\nCompleted formatting poems!"
  end

  private

  def format_poem_content(content)
    # Add proper line breaks and spacing
    content = content.gsub(/\r\n?/, "\n")

    # Add spacing between stanzas
    content = content.gsub(/\n\n+/, "\n\n")

    # Ensure content ends with a single newline
    content.strip + "\n"
  end
end