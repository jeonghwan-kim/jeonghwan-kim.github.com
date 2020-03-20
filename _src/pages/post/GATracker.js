export default class GATracker {
  static sendEvent(category, event, label, value = 1) {
    if (!category || !event || !label) return;

    if (typeof ga === "function") {
      // eslint-disable-next-line no-undef
      ga("send", "event", category, event, label, value);
      console.log(
        `GATracker.sendEvent(${category}, ${event}, ${label}, ${value})`
      );
    }
  }
}
