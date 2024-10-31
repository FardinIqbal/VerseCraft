# config/routes.rb

# This file defines all the routes for the VerseCraft application.
# It includes routes for authentication, user profiles, poems,
# social features (likes, comments), and admin functionality.
Rails.application.routes.draw do
  #-----------------
  # Authentication
  #-----------------
  # Provides routes for user registration, login, and account management
  devise_for :users

  #-----------------
  # Public Routes
  #-----------------
  # Root path - Featured poems displayed on homepage
  root 'pages#home'

  # User profile management
  # Allows viewing and editing user profiles
  resources :users, only: [:show, :edit, :update]

  # Poem management and interaction
  # Includes nested routes for social features
  resources :poems do
    # Collection routes for poem features
    collection do
      get 'form_guidelines/:form', to: 'poems#form_guidelines'
      get 'scroll', to: 'poems#scroll'  # New infinite scroll feature
      get 'fetch_next', to: 'poems#fetch_next'  # AJAX endpoint for loading more poems
    end

    # Social interaction routes
    resources :likes, only: [:create, :destroy]
    resources :comments, only: [:create, :destroy]
  end

  #-----------------
  # Admin Routes
  #-----------------
  # Namespaced admin routes for content management
  namespace :admin do
    resources :poems, only: [:index] do
      member do
        # Toggle featured status of poems
        patch :toggle_featured
      end
    end
  end

  #-----------------
  # System Routes
  #-----------------
  # Health check endpoint for monitoring
  get 'up', to: 'rails/health#show', as: :rails_health_check
end