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

  hasItem: (itemId) ->
    for item in @get('items')
      return true if item.id == itemId
    false

  # If we have an item, destroy it and return true.
  useItem: (itemId) ->
    items = @get('items')
    index = 0
    for item in items
      if item.id == itemId
        items.removeAt(index)
        return true
      index++
    false

  addItem: (item) ->
    @get('itemTypes')[item.id] = item
    @get('items').pushObject(item)
