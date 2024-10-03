class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :poems, dependent: :destroy
  has_many :likes
  has_many :liked_poems, through: :likes, source: :poem

  validates :bio, length: { maximum: 500 }
  validates :location, length: { maximum: 100 }

  def admin?
    admin
  end
end