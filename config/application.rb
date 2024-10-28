# config/application.rb

require_relative "boot"
require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module VerseCraft
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configure asset pipeline
    config.assets.enabled = true
    config.assets.version = '1.0'

    # Configure Sprockets
    config.assets.initialize_on_precompile = false

    # Configure JavaScript modules
    config.javascript_path = 'javascript'
  end
end