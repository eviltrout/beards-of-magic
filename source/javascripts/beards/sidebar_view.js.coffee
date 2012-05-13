window.Beards.Sidebar = Ember.View.extend
  templateName: 'beards_templates_sidebar'

  inventoryBinding: 'Beards.Inventory'

  mute: ->
    Beards.set('mute', true)
    false

  unmute: ->
    Beards.set('mute', false)
    false    