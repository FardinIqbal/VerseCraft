# app/controllers/comments_controller.rb

# The CommentsController handles the creation and deletion of comments on poems.
# It ensures users are authenticated and authorized for relevant actions.
# Comments are designed to be unobtrusive and maintain focus on the poetry.
class CommentsController < ApplicationController
  # Ensure users are logged in for all actions
  before_action :authenticate_user!
  # Set @poem for all actions
  before_action :set_poem
  # Set @comment for destroy action
  before_action :set_comment, only: [:destroy]

  #-----------------
  # Actions
  #-----------------

  # POST /poems/:poem_id/comments
  # Creates a new comment on a poem
  def create
    @comment = @poem.comments.build(comment_params)
    @comment.user = current_user

    respond_to do |format|
      if @comment.save
        format.html { redirect_to @poem, notice: 'Comment added.' }
        format.turbo_stream # renders create.turbo_stream.erb
      else
        format.html {
          redirect_to @poem,
                      alert: 'Unable to add comment. Please ensure your comment isn\'t empty.'
        }
      end
    end
  end

  # DELETE /poems/:poem_id/comments/:id
  # Removes a comment from a poem
  def destroy
    if @comment.can_be_deleted_by?(current_user)
      @comment.destroy
      respond_to do |format|
        format.html { redirect_to @poem, notice: 'Comment removed.' }
        format.turbo_stream # renders destroy.turbo_stream.erb
      end
    else
      redirect_to @poem, alert: 'You are not authorized to remove this comment.'
    end
  end

  private

  #-----------------
  # Helper Methods
  #-----------------

  # Sets the poem for the current action
  def set_poem
    @poem = Poem.find(params[:poem_id])
  end

  # Sets the comment for destroy action
  def set_comment
    @comment = @poem.comments.find(params[:id])
  end

  # Permits allowed parameters for comment creation
  # @return [ActionController::Parameters] permitted parameters
  def comment_params
    params.require(:comment).permit(:content)
  end
end