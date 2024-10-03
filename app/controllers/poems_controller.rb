class PoemsController < ApplicationController
  before_action :set_poem, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show, :featured]

  def index
    @poems = Poem.all
  end

  def show
  end

  def new
    @poem = current_user.poems.build
  end

  def create
    @poem = current_user.poems.build(poem_params)
    if @poem.save
      redirect_to @poem, notice: 'Poem was successfully created.'
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @poem.update(poem_params)
      redirect_to @poem, notice: 'Poem was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @poem.destroy
    redirect_to poems_url, notice: 'Poem was successfully destroyed.'
  end

  private

  def set_poem
    @poem = Poem.find(params[:id])
  end

  def poem_params
    params.require(:poem).permit(:title, :content)
  end

  def featured
    @featured_poems = Poem.featured.includes(:user).order(created_at: :desc).limit(5)
  end
end