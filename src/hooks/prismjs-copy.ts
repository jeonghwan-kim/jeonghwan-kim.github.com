import Clipboard from "clipboard"
import "./prismjs-copy.scss"

const prismjsCopy = () => {
  // al pre tags on the page
  const pres = document.getElementsByTagName("pre")

  // reformat html of pre tags
  if (pres !== null) {
    for (let i = 0; i < pres.length; i++) {
      // check if its a pre tag with a prism class
      if (isPrismClass(pres[i])) {
        // insert code and copy element
        pres[
          i
        ].innerHTML = `<button class="btn btn-secondary copy">복사</button>${pres[i].innerHTML}`
      }
    }
  }

  //
  // create clipboard for every copy element
  const clipboard = new Clipboard(".copy", {
    target: trigger => {
      return trigger.nextElementSibling
    },
  })

  //
  // do stuff when copy is clicked
  clipboard.on("success", event => {
    event.trigger.textContent = "복사함!"
    setTimeout(() => {
      event.clearSelection()
      event.trigger.textContent = "복사"
    }, 2000)
  })

  //
  // helper function
  function isPrismClass(preTag) {
    return preTag.className.substring(0, 8) === "language"
  }
}

export default prismjsCopy
