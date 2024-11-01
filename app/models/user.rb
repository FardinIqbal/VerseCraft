class User < ApplicationRecord
  # Devise authentication setup
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Enable avatar attachment with Active Storage
  has_one_attached :avatar

  # Additional associations and validations
  has_many :poems, dependent: :destroy
  has_many :appreciations, dependent: :destroy

  # Optional fields and methods
  validates :pen_name, length: { maximum: 50 }
  has_many :appreciations, dependent: :destroy

end
