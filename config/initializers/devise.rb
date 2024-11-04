# config/initializers/devise.rb
Devise.setup do |config|
  # Use environment secret key in production
  if Rails.env.production?
    config.secret_key = ENV['DEVISE_SECRET_KEY']
  end

  # Default configurations
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
end
