class AddSophisticatedFieldsToPoems < ActiveRecord::Migration[7.1]
  def change
    add_column :poems, :form_type, :string
    add_column :poems, :collection_id, :integer
    add_column :poems, :appreciation_count, :integer
    add_column :poems, :annotation_count, :integer
    add_column :poems, :featured_date, :datetime
  end
end
