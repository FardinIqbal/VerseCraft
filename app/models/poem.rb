# app/models/poem.rb

# The Poem model represents a single poem in the system.
# It belongs to a user (author) and can be liked by multiple users.
# Poems can be featured for special display on the platform.
class Poem < ApplicationRecord
  #-----------------
  # Constants
  #-----------------
  # Available poetry forms
  FORMS = {
    'free_verse' => 'Free Verse',
    'sonnet' => 'Sonnet',
    'haiku' => 'Haiku',
    'tanka' => 'Tanka',
    'limerick' => 'Limerick'
  }.freeze

  #-----------------
  # Associations
  #-----------------
  # Each poem must have an author (user)
  belongs_to :user

  # Poems can have multiple likes from different users
  # Counter cache enabled for performance
  has_many :likes, dependent: :destroy, counter_cache: true

  # Users who have liked this poem, accessed through the likes table
  has_many :liking_users, through: :likes, source: :user

  # Comments on this poem
  has_many :comments, dependent: :destroy

  #-----------------
  # Validations
  #-----------------
  validates :title,
            presence: true,
            length: { maximum: 100,
                      message: "must be less than 100 characters" }

  validates :content,
            presence: true,
            length: { maximum: 10000, # Increased from 5000 to accommodate longer poems
                      message: "must be less than 10,000 characters" }

  # Add validations for new source fields
  validates :source,
            length: { maximum: 255 },
            allow_blank: true

  validates :source_url,
            length: { maximum: 2048 }, # Standard max URL length
            allow_blank: true

  validates :published_year,
            numericality: {
              only_integer: true,
              greater_than: 0,
              less_than_or_equal_to: -> { Time.current.year }
            },
            allow_nil: true

  # Form validation
  validates :form, inclusion: { in: FORMS.keys }, allow_nil: true

  #-----------------
  # Scopes
  #-----------------
  # Returns featured poems for homepage display
  scope :featured, -> { where(featured: true) }

  # Returns all poems that are in the public domain
  scope :public_domain, -> { where(public_domain: true) }

  # Returns poems ordered by most recent first
  scope :most_recent, -> { order(created_at: :desc) }

  # Returns poems with their associated likes count
  # Note: This scope is kept for backwards compatibility
  # but likes_count column should be used directly
  scope :with_likes_count, -> {
    select('poems.*, COALESCE(poems.likes_count, 0) as likes_count')
  }

  # Returns poems of a specific form
  scope :by_form, ->(form) { where(form: form) }

  #-----------------
  # Instance Methods
  #-----------------
  # Returns the number of likes for the poem
  # @return [Integer] the number of likes
  def likes_count
    self[:likes_count] || 0
  end

  # Checks if a given user has liked this poem
  # @param user [User] the user to check for
  # @return [Boolean] true if the user has liked the poem, false otherwise
  def liked_by?(user)
    return false unless user
    likes.where(user: user).exists?
  end

  # Generates attribution text for the poem
  # @return [String, nil] attribution text if the poem is public domain, nil otherwise
  def attribution_text
    return unless public_domain

    text = []
    text << "Source: #{source}" if source.present?
    text << "Originally published: #{published_year}" if published_year.present?
    text << "This work is in the public domain."

    text.join("\n")
  end

  # Returns a truncated version of the poem content
  # @param length [Integer] maximum length of the preview
  # @return [String] truncated content with ellipsis
  def preview(length: 200)
    content.truncate(length, separator: ' ')
  end

  # Returns the display name for the poem's form
  # @return [String, nil] the human-readable form name if form is present
  def form_name
    FORMS[form] if form.present?
  end

  # Determines if the poem follows standard form rules
  # @return [Boolean] true if the poem matches its form's requirements
  def valid_form?
    case form
    when 'haiku'
      validate_haiku
    when 'sonnet'
      validate_sonnet
    when 'limerick'
      validate_limerick
    else
      true # Free verse and other forms have no strict rules
    end
  end

  #-----------------
  # Private Methods
  #-----------------
  private

  # Validates haiku structure (3 lines, 5-7-5 syllables)
  def validate_haiku
    lines = content.split("\n").reject(&:blank?)
    lines.count == 3
    # Note: Syllable counting would require additional gem/logic
  end

  # Validates sonnet structure (14 lines)
  def validate_sonnet
    lines = content.split("\n").reject(&:blank?)
    lines.count == 14
  end

  # Validates limerick structure (5 lines)
  def validate_limerick
    lines = content.split("\n").reject(&:blank?)
    lines.count == 5
  end
end