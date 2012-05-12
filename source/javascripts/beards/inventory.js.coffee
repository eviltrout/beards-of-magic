window.Beards.Inventory = Ember.Object.create
  
  items: []
  itemTypes: {}

  itemCount: (->
    @get('items').length
  ).property('items.@each')

  itemsGrouped: (->

    counts = {}
    @get('items').each (i) =>
      counts[i.id] = (counts[i.id] || 0) + 1
      true

    itemTypes = @get("itemTypes")
    Object.keys(counts).map (key) ->
      "#{counts[key]} x #{itemTypes[key].get('name')}"
    
  ).property('items.@each')

  addItem: (item) ->
    @get('itemTypes')[item.id] = item
    @get('items').pushObject(item)
