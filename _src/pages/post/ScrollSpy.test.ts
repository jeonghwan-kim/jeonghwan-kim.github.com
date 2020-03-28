import ScrollSpy from "./ScrollSpy"

describe("ScrollSpy", () => {
  let scrollSpy: ScrollSpy;
  let target1 = 
  
  beforeEach(()=> {
    target1 = document.createElement('a')
    target1.dataset.targetId =  "target1"
    const target2 = document.createElement('a')
    const targets = document.createElement('div')
    targets.appendChild(target1)
    targets.appendChild(target2)
    targets.appendChild(document.createElement('a'))
    
    const ref1 = document.createElement('h1')
    const refs = [
      ref1
    ];
    
    scrollSpy = new ScrollSpy(targets,refs)
  })
  
  describe("onScroll()", () => {
    // todo 
  })
  
  describe("isOnTopOfDoc(ref)", () => {
    let ref: HTMLElement;
    const offsetTop = 100

    beforeEach(()=> {
      ref = document.createElement('div');
      Object.defineProperty(ref, 'offsetTop', {value: offsetTop})
    })

    afterEach(()=> {

    })

    it('ref가 화면 위로 넘어가면 true를 반환한다', () => {
      document.documentElement.scrollTop = offsetTop
      expect(scrollSpy.isOnTopOfDoc(ref)).toBe(true)
    })

    it('ref가 화면 상단 아래이면 false를 반환한다', () => {
      document.documentElement.scrollTop = 0
      expect(scrollSpy.isOnTopOfDoc(ref)).toBe(false)
    })
  })
  
  describe("deactiveateTarget()", () => {
    it('target에 있는 모든 a 엘레먼트를 deactivate 메소드 인자로 전달하여 호출한다', () =>  {
      const spy = jest.spyOn(scrollSpy, 'deactivate')
      scrollSpy.deactiveateTarget()
      expect(spy).toHaveBeenCalledTimes(scrollSpy.targets.length)
    })
  })
  
  describe("findTarget()", () => {
    it('id로 타켓을 찾아 반환한다', () => {
      const t = scrollSpy.findTarget("target1")
      expect(t).toBe(target1)
    })
  })
  
  describe("activate()", () => {
    it('active 클래스를 추가한다', () => {
      const el = document.createElement('div')
      scrollSpy.activate(el);
      expect(el.classList.contains('active')).toBe(true)
    })
  })

  describe("deactivate()", () => {
    it('active 클래스를 제거한다', () => {
      const el = document.createElement('div')
      el.classList.add('active')
      scrollSpy.deactivate(el);
      expect(el.classList.contains('active')).toBe(false)
    })
  })
})