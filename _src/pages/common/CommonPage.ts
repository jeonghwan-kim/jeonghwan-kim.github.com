import Modal from "../../design-system/modal";
import Page from "../Page";
import {$} from '../../lib/dom'

export default class CommonPage extends Page {
  onMount() {
    const trigger = $("#category-btn");
    const modal = $("#category-modal");
    
    if (trigger && modal) {
      new Modal(trigger, modal);
    }
  }
}
