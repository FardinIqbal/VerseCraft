class UsersController < ApplicationController
  before_action :set_user
  before_action :authenticate_user!, except: [:show]
  before_action :authorize_user, only: [:edit, :update]

  def show
    @poems = @user.poems.order(created_at: :desc).limit(10)
    @appreciation_count = @user.appreciations.count
  end

  def update
    if @user.update(user_params)
      if params[:user][:avatar].present?
        @user.avatar.attach(params[:user][:avatar])
      end

      # Redirect to the user's profile page with a success message
      redirect_to @user, notice: 'Profile updated successfully.'
    else
      # Render the edit page with errors if the update fails
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def authorize_user
    redirect_to root_path, alert: 'Not authorized.' unless @user == current_user
  end

  def user_params
    params.require(:user).permit(:pen_name, :bio, :location, :website, :avatar)
  end
end
