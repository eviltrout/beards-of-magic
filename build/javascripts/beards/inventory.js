(function() {

  window.Beards.Inventory = Ember.Object.create({
    items: [],
    itemTypes: {},
    itemCount: (function() {
      return this.get('items').length;
    }).property('items.@each'),
    itemsGrouped: (function() {
      var counts, itemTypes,
        _this = this;
      counts = {};
      this.get('items').each(function(i) {
        counts[i.id] = (counts[i.id] || 0) + 1;
        return true;
      });
      itemTypes = this.get("itemTypes");
      return Object.keys(counts).map(function(key) {
        return "" + counts[key] + " x " + (itemTypes[key].get('name'));
      });
    }).property('items.@each'),
    hasItem: function(itemId) {
      var item, _i, _len, _ref;
      _ref = this.get('items');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.id === itemId) return true;
      }
      return false;
    },
    useItem: function(itemId) {
      var index, item, items, _i, _len;
      items = this.get('items');
      index = 0;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item.id === itemId) {
          items.removeAt(index);
          return true;
        }
        index++;
      }
      return false;
    },
    addItem: function(item) {
      this.get('itemTypes')[item.id] = item;
      return this.get('items').pushObject(item);
    }
  });

}).call(this);
