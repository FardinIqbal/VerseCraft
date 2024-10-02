class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :poems, dependent: :destroy

  validates :bio, length: { maximum: 500 }
  validates :location, length: { maximum: 100 }
end