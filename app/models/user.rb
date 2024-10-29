# app/models/user.rb

# The User model represents a user of the platform.
# Users can write poems, like other poems, and leave comments.
# Some users can have admin privileges for moderation.
class User < ApplicationRecord
  #-----------------
  # Authentication
  #-----------------
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  #-----------------
  # Associations
  #-----------------
  # User's created poems
  has_many :poems, dependent: :destroy
  # User's likes on poems
  has_many :likes
  # Poems that the user has liked
  has_many :liked_poems, through: :likes, source: :poem
  # Comments made by the user
  has_many :comments, dependent: :destroy

  #-----------------
  # Validations
  #-----------------
  validates :bio, length: { maximum: 500 }
  validates :location, length: { maximum: 100 }

  #-----------------
  # Instance Methods
  #-----------------
  # Checks if the user has admin privileges
  # @return [Boolean] true if user is an admin, false otherwise
  def admin?
    admin
  end
end