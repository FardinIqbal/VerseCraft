class AddEngagementToPoems < ActiveRecord::Migration[7.1]
  def change
    add_column :poems, :appreciation_count, :integer
    add_column :poems, :annotation_count, :integer
    add_column :poems, :share_count, :integer
    add_column :poems, :save_count, :integer
    add_column :poems, :featured_at, :datetime
  end
end
