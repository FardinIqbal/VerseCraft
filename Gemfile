source "https://rubygems.org"

ruby "3.2.2"

# Rails Framework
gem "rails", "~> 7.1.4"

# The original asset pipeline for Rails
gem "sprockets-rails"

# Use the Puma web server
gem "puma", ">= 5.0"

# Use JavaScript with ESM import maps
gem "importmap-rails"

# Hotwire's SPA-like page accelerator
gem "turbo-rails"

# Hotwire's modest JavaScript framework
gem "stimulus-rails"

# Build JSON APIs with ease
gem "jbuilder"

# Use PostgreSQL as the database for Active Record
gem "pg"

# Use the Devise authentication library
gem "devise", "~> 4.9"

# Use Bullet for detecting N+1 queries in development
gem "bullet", "~> 7.2", group: :development

# Use SassC for SCSS compilation
gem "sassc-rails", "~> 2.1"

# Use Nokogiri for XML and HTML parsing
gem "nokogiri", "~> 1.16"

# Use HTTParty for making HTTP requests
gem "httparty", "~> 0.22.0"

# Reduces boot times through caching
gem "bootsnap", require: false

# Use Active Storage variants for image processing
# gem "image_processing", "~> 1.2"

# Windows-specific configuration for timezone data
gem "tzinfo-data", platforms: %i[windows jruby]

group :development, :test do
  # Debugging tools
  gem "debug", platforms: %i[mri windows]
end

group :development do
  # Use console on exceptions pages
  gem "web-console"

  # Add speed badges
  # gem "rack-mini-profiler"

  # Speed up commands on slow machines/big apps
  # gem "spring"
end

group :test do
  # Use system testing
  gem "capybara"
  gem "selenium-webdriver"
end
