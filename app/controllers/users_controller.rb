class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:show]
  before_action :set_user

  def show
    @poems = @user.poems.order(created_at: :desc)
  end

  def edit
    authorize_user
  end

  def update
    authorize_user
    if @user.update(user_params)
      redirect_to @user, notice: 'Profile updated successfully.'
    else
      render :edit
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:bio, :location)
  end

  def authorize_user
    redirect_to root_path, alert: 'Not authorized.' unless @user == current_user
  end
end