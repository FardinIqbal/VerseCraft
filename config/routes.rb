Rails.application.routes.draw do
  # Authentication routes
  devise_for :users

  # Root path (homepage)
  # This is where featured poems will be displayed
  root 'pages#home'

  # User profile routes
  resources :users, only: [:show, :edit, :update]

  # Poem routes with nested routes for likes and comments
  resources :poems do
    resources :likes, only: [:create, :destroy]
    resources :comments, only: [:create, :update, :destroy]
  end

  # Admin namespace
  namespace :admin do
    resources :poems, only: [:index] do
      member do
        patch :toggle_featured
      end
    end
  end

  # Health check route
  get 'up', to: 'rails/health#show', as: :rails_health_check

  # For details on the DSL available within this file, see:
  # https://guides.rubyonrails.org/routing.html
end