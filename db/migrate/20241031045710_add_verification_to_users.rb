class AddVerificationToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :verified, :boolean
    add_column :users, :verification_type, :string
    add_column :users, :literary_credentials, :text
    add_column :users, :historical_figure, :boolean
  end
end
