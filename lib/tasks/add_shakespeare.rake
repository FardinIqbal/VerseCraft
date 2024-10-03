require_relative '../assets/shakespeare_sonnets'

namespace :db do
  desc "Add William Shakespeare as a user and create all his sonnets"
  task add_shakespeare: :environment do
    # Create Shakespeare user
    shakespeare = User.find_or_create_by!(email: 'william.shakespeare@example.com') do |user|
      user.password = SecureRandom.hex(10)  # Random password
      user.bio = "William Shakespeare (1564-1616) was an English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world's greatest dramatist."
    end

    puts "Shakespeare user created or found with id: #{shakespeare.id}"

    # Add all sonnets
    ShakespeareSonnets::SONNETS.each do |sonnet|
      poem = Poem.find_or_create_by!(
        user: shakespeare,
        title: "Sonnet #{sonnet[:number]}"
      ) do |p|
        p.content = sonnet[:content]
        p.featured = [true, false].sample  # Randomly feature some sonnets
      end
      print "."  # Progress indicator
    end
    puts "\nAll #{ShakespeareSonnets::SONNETS.count} sonnets have been added or updated."
  end
end