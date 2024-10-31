# app/models/like.rb
class Like < ApplicationRecord
  belongs_to :user
  belongs_to :poem, counter_cache: true
  validates :user_id, uniqueness: { scope: :poem_id }
end