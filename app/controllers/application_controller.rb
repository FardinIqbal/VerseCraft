# app/controllers/application_controller.rb

class ApplicationController < ActionController::Base
  # Run this before any Devise controller action
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!

  protected

  # Permit additional parameters for Devise, including the avatar
  def configure_permitted_parameters
    added_attrs = [:avatar, :email, :password, :password_confirmation, :current_password]
    devise_parameter_sanitizer.permit(:sign_up, keys: added_attrs)
    devise_parameter_sanitizer.permit(:account_update, keys: added_attrs)
  end
end
