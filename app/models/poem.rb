class Poem < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { maximum: 100 }
  validates :content, presence: true, length: { maximum: 5000 }
end