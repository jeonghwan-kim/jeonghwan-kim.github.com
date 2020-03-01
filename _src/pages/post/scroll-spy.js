const scrollSpy = {
  init(menuElements, refs) {
    this.menus = Array.from(menuElements.querySelectorAll("a"));
    this.refs = refs;

    window.addEventListener("scroll", scrollSpy.onScroll);
  },

  onScroll: function() {
    var firstEl = scrollSpy.refs[0];
    if (document.documentElement.scrollTop - firstEl.offsetTop < -10) {
      scrollSpy.removeClassAll();
    }

    scrollSpy.refs.forEach(function(ref) {
      if (document.documentElement.scrollTop - ref.offsetTop >= -10) {
        scrollSpy.removeClassAll();
        scrollSpy.findRefAndAddClass(ref.id, "active");
      }
    });
  },

  removeClassAll: function() {
    scrollSpy.menus.forEach(function(a) {
      a.classList.remove("active");
    });
  },

  findRefAndAddClass: function(id, className) {
    var found = scrollSpy.menus.filter(function(a) {
      return a.dataset.targetId === id;
    })[0];

    if (found) {
      found.classList.add(className);
    }
  }
};

export default scrollSpy;
