class AddLikesCounterCacheToPoems < ActiveRecord::Migration[7.1]
  def change
    add_column :poems, :likes_count, :integer, default: 0, null: false

    # Reset counter cache
    reversible do |dir|
      dir.up do
        Poem.find_each do |poem|
          Poem.reset_counters(poem.id, :likes)
        end
      end
    end
  end
end