# config/initializers/devise.rb
Devise.setup do |config|
  config.secret_key = ENV['DEVISE_SECRET_KEY'] || '44a211b60ae274b93de4d2dcd384732e'
end
