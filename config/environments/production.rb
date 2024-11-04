# config/environments/production.rb
Rails.application.configure do
  config.require_master_key = true
  config.eager_load = true
  config.secret_key_base = ENV['SECRET_KEY_BASE'] || Rails.application.credentials.secret_key_base
end
