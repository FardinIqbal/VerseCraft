# config/routes.rb

# VerseCraft Application Routes
# Simplified routing for the initial version of our literary social platform.

Rails.application.routes.draw do
  #-----------------
  # Authentication
  #-----------------
  # Devise handles user registration, login, and account management
  devise_for :users

  #-----------------
  # Root Route
  #-----------------
  # Set the root path to the poems index page
  root 'poems#index'

  #-----------------
  # Poems Routes
  #-----------------
  # Routes for composing, viewing, and listing poems
  resources :poems, only: [:index, :new, :create, :show]

  #-----------------
  # Users Routes
  #-----------------
  # Basic user profiles
  resources :users, only: [:show]
end
