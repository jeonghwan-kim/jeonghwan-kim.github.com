"use strict";

var PopupManager = (function() {
  function PopupManager(el) {
    if (!el) throw new Error('Need popup element');
    this.el = el;
  }
  PopupManager.prototype.hide = function() { this.el.style.display = 'none'; };
  PopupManager.prototype.show = function() { this.el.style.display = 'block'; };
  PopupManager.prototype.isShow = function() { return !!(this.el.style.display === 'block'); };
  PopupManager.prototype.toggle = function() {
    this.el.style.display = this.isShow() ? this.hide() : this.show();
  };
  return PopupManager;
})();

var NotPopupAreaDOM = (function() {
  function NotPopupAreaDOM(el) {
    if (!el) throw new Error('Need popup element');
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.display = 'none';
    el.style['z-index'] = '1';
    el.style['background-color'] = 'rgba(0,0,0,0.5)';
    this.el = el;
    return this;
  }
  NotPopupAreaDOM.prototype.mount = function (el) { el.appendChild(this.el); this.parentEl = el; return this;};
  NotPopupAreaDOM.prototype.unmount = function (el) { this.parentEl.removeChild(this.el); return this;};
  NotPopupAreaDOM.prototype.show = function () {
    this.el.style.display = 'block';
    return this;
  };
  NotPopupAreaDOM.prototype.hide = function () {
    this.el.style.display = 'none';
    return this;
  };
  NotPopupAreaDOM.prototype.isShow = function () {
    return !(this.el.style.display === 'none');
  };
  NotPopupAreaDOM.prototype.toggle = function () {
    this.el.style.display = this.isShow() ? 'none' : 'block';
    return this;
  };
  NotPopupAreaDOM.prototype.onClick = function (fn) { this.el.onclick = fn; return this;};
  return NotPopupAreaDOM;
})();

var EventBinder = {
    init: function (selector) {
        this.el = document.querySelector(selector);
        if (!this.el) throw Error(selector + ' 로 엘레멘트를 찾을 수 없음');
    },
    bindEvent: function (eventName, eventHandler) {
        if (!this.el) throw Error('init()을 먼저 실행하세요')
        this.el.addEventListener(eventName, eventHandler.bind(this))
    },
    openSidebar: function (selector) {
        var targetEl = document.querySelector(selector);
        if (!targetEl) throw Error(selector + ' 로 엘레멘트를 찾을 수 없음');
        targetEl.className = targetEl.className.replace('hide', '')
    },
    closeSidebar: function (selector) {
        var targetEl = document.querySelector(selector);
        if (!targetEl) throw Error(selector + ' 로 엘레멘트를 찾을 수 없음');
        targetEl.className = targetEl.className + ' hide'
    }
};

var initPopup = function() {
    var popupMng,
        popup = document.getElementById('category-popup'),
        popupClosebtn = document.getElementById('category-popup-close'),
        notPopupArea = new NotPopupAreaDOM(document.createElement('div')).mount(document.body),
        ctgyBtn = document.getElementById('category-pupup-btn');

    if (ctgyBtn && popup && popupClosebtn) {
        popupMng = new PopupManager(popup);
        notPopupArea.mount(document.body);

        ctgyBtn.onclick = function onCategoryBtn() {
            notPopupArea
                .toggle()
                .onClick(function onClickNotPopupArea(){
                    notPopupArea.hide();
                    popupMng.hide();
                })
                .show();

            popupMng.toggle();
        };

        popupClosebtn.onclick = function onCategoryPopupClose(){
            notPopupArea.hide();
            popupMng.hide();
        };

        document.onkeydown = function(e) {
            if (e.key === 'Escape') {
                notPopupArea.hide();
                popupMng.hide();
            }
        }
    }
}
var initSidebar = function () {
  var sidebarOpenBtn,
      sidebarCloseBtn;

    sidebarOpenBtn = Object.create(EventBinder);
    sidebarOpenBtn.init('.btn-open-sidebar');
    sidebarOpenBtn.bindEvent('click', function (e) {
        sidebarOpenBtn.openSidebar('.sidebar');
    });

    sidebarCloseBtn = Object.create(EventBinder);
    sidebarCloseBtn.init('.btn-close-sidebar');
    sidebarCloseBtn.bindEvent('click', function (e) {
        sidebarCloseBtn.closeSidebar('.sidebar');
    });
};

document.addEventListener('DOMContentLoaded', function() {
  initPopup();
  initSidebar();
});
