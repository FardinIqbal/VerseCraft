require "test_helper"

class PoemsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get poems_index_url
    assert_response :success
  end

  test "should get show" do
    get poems_show_url
    assert_response :success
  end

  test "should get new" do
    get poems_new_url
    assert_response :success
  end

  test "should get create" do
    get poems_create_url
    assert_response :success
  end

  test "should get edit" do
    get poems_edit_url
    assert_response :success
  end

  test "should get update" do
    get poems_update_url
    assert_response :success
  end

  test "should get destroy" do
    get poems_destroy_url
    assert_response :success
  end
end
