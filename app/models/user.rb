# app/models/user.rb

class User < ApplicationRecord
  # Include default devise modules if using Devise for authentication
  # devise :database_authenticatable, :registerable, ...
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable, and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :poems, dependent: :destroy
end
