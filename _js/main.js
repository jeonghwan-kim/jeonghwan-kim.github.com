import googleAnalytics from './googleAnalytics';

const tag = '[app]'

const onload = () => {
  console.log(tag, 'DOMContentLoaded')
  googleAnalytics.init(window, document)

  const post = document.querySelector('#post')
  const postList = document.querySelector('#post-list')
  if (post || postList) {
    const el = post || postList
    el.addEventListener('click', evt => {
      googleAnalytics.sendEvent({
        category: 'tag',
        action: 'click',
        label: post ? 'in post' : 'in post list',
        value: evt.target.dataset.gaValue
      })
    })
  }
};

document.addEventListener('DOMContentLoaded', onload);

