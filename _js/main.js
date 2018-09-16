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
      const {tagName} = evt.target.dataset
      if (!tagName) return

      googleAnalytics.sendEvent({
        category: 'Tag',
        action: `Click in ${post ? 'post' : 'post list'}`,
        label: tagName
      })
    })
  }
};

document.addEventListener('DOMContentLoaded', onload);

