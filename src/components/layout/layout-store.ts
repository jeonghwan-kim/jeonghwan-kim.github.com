import { EventEmitter } from "events"
import Modal from "../modal"
import { ReactElement } from "react"

class LayoutStore extends EventEmitter {
  modals: ReactElement<Modal>[] = []

  pushModal(modal: ReactElement<Modal>) {
    this.modals.push(modal)
    this.emit("modalChanged", this.modals)
  }

  popModal() {
    this.modals.pop()
    this.emit("modalChanged", this.modals)
  }
}

export default new LayoutStore()
