class AddFeaturedToPoems < ActiveRecord::Migration[7.1]
  def change
    add_column :poems, :featured, :boolean, default: false
  end
end