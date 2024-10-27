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
    begin
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
      puts "\nSuccessfully seeded #{sonnets.count} sonnets!"
    rescue JSON::ParserError => e
      puts "Error parsing sonnets.json: #{e.message}"
    rescue Errno::ENOENT => e
      puts "Error: sonnets.json file not found. Please ensure it exists at lib/assets/shakespeare/sonnets.json"
    rescue => e
      puts "Unexpected error: #{e.message}"
    end

    puts "\nCompleted seeding Shakespeare's poetry!"
  end
end