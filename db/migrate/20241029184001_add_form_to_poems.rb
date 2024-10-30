class AddFormToPoems < ActiveRecord::Migration[7.1]
  def change
    unless column_exists?(:poems, :form)
      add_column :poems, :form, :string
    end
  end
end
