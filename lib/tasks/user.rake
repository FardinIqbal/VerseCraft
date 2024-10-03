namespace :user do
  desc "Promote a user to admin status"
  task :promote_to_admin, [:email] => :environment do |t, args|
    if args[:email].blank?
      puts "Please provide an email address: rake user:promote_to_admin[user@example.com]"
    else
      user = User.find_by(email: args[:email])
      if user
        user.update(admin: true)
        puts "User #{user.email} has been promoted to admin."
      else
        puts "User with email #{args[:email]} not found."
      end
    end
  end
end