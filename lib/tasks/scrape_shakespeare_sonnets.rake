require 'nokogiri'
require 'httparty'

namespace :sonnets do
  desc "Scrape Shakespeare's sonnets and save them to a file"
  task :scrape => :environment do
    url = "http://shakespeare.mit.edu/Poetry/sonnets.html"
    response = HTTParty.get(url)
    doc = Nokogiri::HTML(response.body)

    sonnets = []
    current_sonnet = { number: 0, content: "" }

    doc.css('blockquote').each do |blockquote|
      text = blockquote.text.strip

      if text.match(/^Sonnet (\d+)$/)
        if current_sonnet[:number] > 0
          sonnets << current_sonnet
        end
        current_sonnet = { number: $1.to_i, content: "" }
      else
        current_sonnet[:content] += text + "\n"
      end
    end
    sonnets << current_sonnet if current_sonnet[:number] > 0

    File.open(Rails.root.join('lib', 'assets', 'shakespeare_sonnets.rb'), 'w') do |file|
      file.puts "module ShakespeareSonnets"
      file.puts "  SONNETS = ["
      sonnets.each do |sonnet|
        file.puts "    {"
        file.puts "      number: #{sonnet[:number]},"
        file.puts "      content: #{sonnet[:content].strip.inspect}"
        file.puts "    },"
      end
      file.puts "  ]"
      file.puts "end"
    end

    puts "Scraped #{sonnets.count} sonnets and saved to lib/assets/shakespeare_sonnets.rb"
  end
end