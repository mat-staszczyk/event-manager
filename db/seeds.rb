json = ActiveSupport::JSON.decode(File.read('db/seeds/events.json'))
json.each { |record| Event.create!(record) }

