class PagesController < ApplicationController
  def home
    @featured_poems = Poem.where(featured: true).includes(:user).order(created_at: :desc).limit(5)
  end
end