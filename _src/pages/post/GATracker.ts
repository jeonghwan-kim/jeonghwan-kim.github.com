export default class GATracker {
  static sendEvent(category: string, event: string, label: string, value: string | number = 1) {
    if (typeof ga === "function") {
      ga("send", "event", category, event, label, value);
      console.log(
        `GATracker.sendEvent(${category}, ${event}, ${label}, ${value})`
      );
    }
  }
}
