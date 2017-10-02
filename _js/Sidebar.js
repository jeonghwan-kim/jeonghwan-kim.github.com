const initSidebar = () => {
  const sidebarOpenBtn = Object.create(EventBinder);
  sidebarOpenBtn.init('.btn-open-sidebar');
  sidebarOpenBtn.bindEvent('click', () => {
    sidebarOpenBtn.openSidebar('.sidebar');
  });

  const sidebarCloseBtn = Object.create(EventBinder);
  sidebarCloseBtn.init('.btn-close-sidebar');
  sidebarCloseBtn.bindEvent('click', () => {
    sidebarCloseBtn.closeSidebar('.sidebar');
  });
};
