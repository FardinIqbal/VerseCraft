# app/controllers/poems_controller.rb
class PoemsController < ApplicationController
  # Callbacks for setting poem object and ensuring authentication for protected actions
  before_action :set_poem, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show, :form_guidelines, :scroll, :fetch_next]

  #-----------------
  # Standard CRUD Actions
  #-----------------

  def index
    @poems = Poem.includes(:user).order(created_at: :desc)
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

  #-----------------
  # Additional Actions
  #-----------------

  def scroll
    @initial_poems = Poem.includes(:user)
                         .order(created_at: :desc)
                         .limit(5)
    cookies[:seen_touch_hint] ||= true
  end


  def fetch_next
    last_id = params[:last_id].to_i
    return head :bad_request if last_id.zero?

    poems = Poem.includes(:user)
                .where("id < ?", last_id)
                .order(created_at: :desc)
                .limit(5)

    render json: {
      poems: poems.map { |poem|
        {
          id: poem.id,
          title: poem.title,
          content: poem.content,
          user_id: poem.user.id,
          author: poem.user.email,
          likes_count: poem.likes_count,
          liked_by_current_user: user_signed_in? ? poem.liked_by?(current_user) : false,
          created_at: poem.created_at.strftime("%B %d, %Y")
        }
      }
    }
  end

  def form_guidelines
    @form = params[:form]
    if Poem::FORMS.key?(@form)
      render partial: "poems/form_guidelines/#{@form}", layout: false
    else
      head :not_found
    end
  end

  def featured
    @featured_poems = Poem.featured.includes(:user).order(created_at: :desc)
  end

  private

  def set_poem
    @poem = Poem.find(params[:id])
  end

  def poem_params
    params.require(:poem).permit(:title, :content, :form)
  end
end