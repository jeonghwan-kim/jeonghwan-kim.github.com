import GATracker from "./GATracker"

describe("GATracker", () => {
  describe("sendEvent", () => {
    let spy: jest.SpyInstance;
    beforeAll(() => {
      spy = jest.fn()
      Object.defineProperty(window, 'ga', { value: spy })
    })
    afterAll(() => spy.mockRestore());

    it("ga() 함수를 호출한다", () =>{
      const c = 'category';
      const e = 'event';
      const l = 'label';
      GATracker.sendEvent(c, e, l)
      expect(spy).toHaveBeenLastCalledWith('send', 'event',  c, e, l, 1)
    })
  })  
})