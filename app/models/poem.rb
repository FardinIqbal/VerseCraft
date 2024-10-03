class Poem < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { maximum: 100 }
  validates :content, presence: true, length: { maximum: 5000 }

  has_many :likes
  has_many :liking_users, through: :likes, source: :user

  def liked_by?(user)
    likes.where(user: user).exists?
  end
end