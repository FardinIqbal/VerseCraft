class Poem < ApplicationRecord
  belongs_to :user
  has_many :likes
  has_many :liking_users, through: :likes, source: :user

  validates :title, presence: true, length: { maximum: 100 }
  validates :content, presence: true, length: { maximum: 5000 }

  scope :featured, -> { where(featured: true) }

  def liked_by?(user)
    likes.where(user: user).exists?
  end
end