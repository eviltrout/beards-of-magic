(function() {

  window.Beards.Sidebar = Ember.View.extend({
    templateName: 'beards_templates_sidebar',
    inventoryBinding: 'Beards.Inventory',
    mute: function() {
      Beards.set('mute', true);
      return false;
    },
    unmute: function() {
      Beards.set('mute', false);
      return false;
    }
  });

}).call(this);
