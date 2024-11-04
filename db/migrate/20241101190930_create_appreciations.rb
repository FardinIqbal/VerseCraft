class CreateAppreciations < ActiveRecord::Migration[7.1]
  def change
    create_table :appreciations do |t|
      t.references :user, null: false, foreign_key: true
      t.references :poem, null: false, foreign_key: true

      t.timestamps
    end
  end
end
