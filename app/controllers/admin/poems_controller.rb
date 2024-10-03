module Admin
  class PoemsController < ApplicationController
    before_action :authenticate_user!
    before_action :require_admin
    before_action :set_poem, only: [:toggle_featured]

    def index
      @poems = Poem.includes(:user).order(created_at: :desc)
    end

    def toggle_featured
      @poem.update(featured: !@poem.featured)
      redirect_to admin_poems_path, notice: "#{@poem.title} has been #{@poem.featured? ? 'featured' : 'unfeatured'}."
    end

    private

    def set_poem
      @poem = Poem.find(params[:id])
    end

    def require_admin
      redirect_to root_path, alert: 'Access denied.' unless current_user.admin?
    end
  end
end