Rails.application.routes.draw do
  # Devise routes for users
  devise_for :users

  # Root route
  root 'pages#home'

  # Pages routes
  get 'pages/home'

  # Poem resource routes, automatically generating index, show, new, create, edit, update, and destroy actions
  resources :poems

  # Health check route
  get 'up' => 'rails/health#show', as: :rails_health_check
end
