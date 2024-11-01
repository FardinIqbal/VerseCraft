# app/controllers/users_controller.rb

class UsersController < ApplicationController
  before_action :set_user
  before_action :authenticate_user!, except: [:show, :anthology]
  before_action :authorize_user, only: [:edit, :update]

  def show
    @poems = @user.poems.includes(:appreciations, :annotations)
                  .order(created_at: :desc)
                  .limit(10)
    @collections = @user.collections.with_poems.limit(3)
    @recent_activity = @user.recent_activity.limit(5)
  end

  def edit
  end

  def update
    if @user.update(user_params)
      if params[:user][:avatar].present?
        @user.avatar.attach(params[:user][:avatar])
      end

      redirect_to @user, notice: 'Profile updated successfully.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def anthology
    @poems = @user.poems.includes(:appreciations)
                  .order(created_at: :desc)
                  .page(params[:page])
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def authorize_user
    unless @user == current_user
      redirect_to root_path, alert: 'Not authorized.'
    end
  end

  def user_params
    params.require(:user).permit(
      :pen_name,
      :bio,
      :location,
      :website,
      :literary_background,
      :influences,
      :avatar
    )
  end
end