# db/migrate/[timestamp]_add_source_fields_to_poems.rb
class AddSourceFieldsToPoems < ActiveRecord::Migration[7.0]
  def change
    add_column :poems, :source, :string
    add_column :poems, :source_url, :string
    add_column :poems, :published_year, :integer
    add_column :poems, :public_domain, :boolean, default: false
  end
end