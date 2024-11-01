# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_11_01_190930) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "appreciations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "poem_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["poem_id"], name: "index_appreciations_on_poem_id"
    t.index ["user_id"], name: "index_appreciations_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.bigint "user_id", null: false
    t.bigint "poem_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["poem_id"], name: "index_comments_on_poem_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "poem_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["poem_id"], name: "index_likes_on_poem_id"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "poems", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "featured", default: false
    t.string "source"
    t.string "source_url"
    t.integer "published_year"
    t.boolean "public_domain", default: false
    t.string "form"
    t.string "default_font"
    t.boolean "custom_spacing"
    t.integer "likes_count", default: 0, null: false
    t.string "form_type"
    t.integer "collection_id"
    t.integer "appreciation_count"
    t.integer "annotation_count"
    t.datetime "featured_date"
    t.integer "share_count"
    t.integer "save_count"
    t.datetime "featured_at"
    t.index ["user_id"], name: "index_poems_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "bio"
    t.string "location"
    t.boolean "admin"
    t.string "pen_name"
    t.text "literary_bio"
    t.string "website"
    t.boolean "featured_poet"
    t.boolean "verified"
    t.string "verification_type"
    t.text "literary_credentials"
    t.boolean "historical_figure"
    t.string "username"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "appreciations", "poems"
  add_foreign_key "appreciations", "users"
  add_foreign_key "comments", "poems"
  add_foreign_key "comments", "users"
  add_foreign_key "likes", "poems"
  add_foreign_key "likes", "users"
  add_foreign_key "poems", "users"
end
