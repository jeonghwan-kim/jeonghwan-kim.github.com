import React, { ReactElement } from "react"
import modalStore from "./layout/layout-store"

import "./modal.scss"

interface P {
  className?: string
}

interface S {
  hide: boolean
}

export default class Modal extends React.Component<P, S> {
  constructor(p: P) {
    super(p)
    this.state = {
      hide: false,
    }
  }

  onClose(e: React.MouseEvent<HTMLElement>) {
    if (e.target !== e.currentTarget) return

    this.setState({ hide: true })

    setTimeout(() => Modal.close(), 300)
  }

  render() {
    return (
      <div
        className={`backdrop ${this.state.hide ? "hide" : ""}`}
        onClick={this.onClose.bind(this)}
      >
        <div
          className={`${this.props.className} modal ${
            this.state.hide ? "hide" : ""
          }`}
        >
          {this.props.children}
        </div>
      </div>
    )
  }

  static open(modal: ReactElement<Modal>) {
    modalStore.pushModal(modal)
  }

  static close() {
    modalStore.popModal()
  }
}
