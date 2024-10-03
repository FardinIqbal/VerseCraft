class LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :find_poem

  def create
    @poem.likes.create(user: current_user)
    redirect_to @poem
  end

  def destroy
    @poem.likes.where(user: current_user).destroy_all
    redirect_to @poem
  end

  private

  def find_poem
    @poem = Poem.find(params[:poem_id])
  end
end