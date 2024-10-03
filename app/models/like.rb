class Like < ApplicationRecord
  belongs_to :user
  belongs_to :poem
  validates :user_id, uniqueness: { scope: :poem_id }
end