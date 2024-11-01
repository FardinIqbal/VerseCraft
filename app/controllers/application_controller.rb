# app/controllers/application_controller.rb

class ApplicationController < ActionController::Base
  # Enforce authentication for all actions by default
  before_action :authenticate_user!

  # Run this before any Devise controller action to permit additional parameters
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  # Permit additional parameters for Devise, including avatar
  def configure_permitted_parameters
    added_attrs = [:avatar, :email, :password, :password_confirmation, :current_password]
    devise_parameter_sanitizer.permit(:sign_up, keys: added_attrs)
    devise_parameter_sanitizer.permit(:account_update, keys: added_attrs)
  end

  # Redirect users after sign-in
  def after_sign_in_path_for(resource)
    poems_path
  end

  # Redirect users after sign-out
  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end
end
