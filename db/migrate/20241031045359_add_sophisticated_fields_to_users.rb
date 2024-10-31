class AddSophisticatedFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :pen_name, :string
    add_column :users, :literary_bio, :text
    add_column :users, :website, :string
    add_column :users, :featured_poet, :boolean
  end
end
