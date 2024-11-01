# app/controllers/poems_controller.rb

class PoemsController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]

  def index
    @poems = Poem.includes(:user).order(created_at: :desc)
  end

  def new
    @poem = Poem.new
  end

  def create
    @poem = current_user.poems.build(poem_params)
    if @poem.save
      redirect_to @poem, notice: 'Your poem has been published!'
    else
      render :new
    end
  end

  def show
    @poem = Poem.find(params[:id])
  end

  private

  def poem_params
    params.require(:poem).permit(:title, :content)
  end
end
