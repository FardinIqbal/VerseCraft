Rails.application.routes.draw do
  # Devise routes for user authentication (sign up, sign in, etc.)
  devise_for :users

  # RESTful routes for user profile (only show, edit, and update actions)
  resources :users, only: [:show, :edit, :update]

  # Root path (homepage)
  root 'pages#home'

  # RESTful routes for Poem resources (index, show, create, update, delete)
  resources :poems

  # Health check route (useful for monitoring the app's status)
  get 'up', to: 'rails/health#show', as: :rails_health_check
end
