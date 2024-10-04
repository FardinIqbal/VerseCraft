class PoemsController < ApplicationController
  # Callbacks for setting poem object and ensuring authentication for protected actions
  before_action :set_poem, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show]

  # GET /poems
  # Fetches all poems, including the associated user, to avoid N+1 query issues
  def index
    @poems = Poem.includes(:user).order(created_at: :desc)
  end


  # GET /poems/:id
  # Displays a specific poem
  def show
  end

  # GET /poems/new
  # Prepares a new poem object for the form, scoped to the current user
  def new
    @poem = current_user.poems.build
  end

  # POST /poems
  # Creates a new poem with the provided parameters, scoped to the current user
  def create
    @poem = current_user.poems.build(poem_params)
    if @poem.save
      # Redirect to poem show page with success message
      redirect_to @poem, notice: 'Poem was successfully created.'
    else
      # Render the new form again if validation fails
      render :new
    end
  end

  # GET /poems/:id/edit
  # Loads poem for editing (already handled by `set_poem`)
  def edit
  end

  # PATCH/PUT /poems/:id
  # Updates the poem with provided params if valid, otherwise renders the edit form again
  def update
    if @poem.update(poem_params)
      redirect_to @poem, notice: 'Poem was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /poems/:id
  # Deletes the poem and redirects to the index page with a success message
  def destroy
    @poem.destroy
    redirect_to poems_url, notice: 'Poem was successfully destroyed.'
  end

  # Fetches featured poems (can be used for showing featured poems separately)
  def featured
    @featured_poems = Poem.featured.includes(:user).order(created_at: :desc)
  end

  private

  # Set the poem object based on the ID passed in params (used in show, edit, update, destroy)
  def set_poem
    @poem = Poem.find(params[:id])
  end

  # Strong parameters for poem creation and updates
  def poem_params
    params.require(:poem).permit(:title, :content)
  end
end
