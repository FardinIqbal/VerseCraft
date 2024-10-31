# app/models/comment.rb

# The Comment model represents a user's comment on a poem.
# It belongs to both a user (commenter) and a poem.
# Comments are displayed beneath poems and contribute to community engagement.
class Comment < ApplicationRecord
  #-----------------
  # Associations
  #-----------------
  belongs_to :user  # The user who made the comment
  belongs_to :poem  # The poem being commented on

  #-----------------
  # Validations
  #-----------------
  validates :content,
            presence: true,
            length: { maximum: 1000,
                      message: "must be less than 1000 characters" }

  #-----------------
  # Scopes
  #-----------------
  # Returns comments in chronological order (oldest first)
  scope :chronological, -> { order(created_at: :asc) }

  # Returns most recent comments first
  scope :most_recent, -> { order(created_at: :desc) }

  #-----------------
  # Instance Methods
  #-----------------
  # Returns a formatted version of the comment timestamp
  # @return [String] formatted date and time
  def formatted_timestamp
    created_at.strftime("%B %d, %Y at %I:%M %p")
  end

  # Checks if a given user can delete this comment
  # @param user [User] the user to check permissions for
  # @return [Boolean] true if user can delete the comment
  def can_be_deleted_by?(user)
    return false unless user
    user.admin? || user_id == user.id
  end
end