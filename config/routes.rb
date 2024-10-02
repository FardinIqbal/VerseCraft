Rails.application.routes.draw do
  # Devise routes for users
  devise_for :users

  # Root route
  root 'pages#home'

  # Poem resource routes
  resources :poems

  # Health check route
  get 'up' => 'rails/health#show', as: :rails_health_check
end
