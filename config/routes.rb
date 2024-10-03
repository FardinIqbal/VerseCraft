Rails.application.routes.draw do
  # Authentication routes
  devise_for :users

  # User profile routes
  # Only allowing show, edit, and update actions for user profiles
  resources :users, only: [:show, :edit, :update]

  # Root path (homepage)
  root 'pages#home'

  # Poem routes with nested routes for likes and comments
  resources :poems do
    # Nested resource for likes
    # Only allowing create and destroy actions for likes
    resources :likes, only: [:create, :destroy]

    # Nested resource for comments
    # Allowing create, update, and destroy actions for comments
    resources :comments, only: [:create, :update, :destroy]
  end

  # Health check route
  # Useful for monitoring the application's status
  get 'up', to: 'rails/health#show', as: :rails_health_check

  # Example of a custom route (commented out for now)
  # get 'custom_path', to: 'controller#action', as: :custom_route_name

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end