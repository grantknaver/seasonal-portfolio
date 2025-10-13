export type GsapStep =
  | {
      type: 'set';
      targets: Element | Element[] | NodeListOf<Element>;
      vars: gsap.TweenVars;
      at?: gsap.Position;
    }
  | {
      type: 'fromTo';
      targets: Element | Element[] | NodeListOf<Element>;
      from: gsap.TweenVars;
      to: gsap.TweenVars;
      at?: gsap.Position;
    }
  | {
      type: 'to';
      targets: Element | Element[] | NodeListOf<Element>;
      vars: gsap.TweenVars;
      at?: gsap.Position;
    }
  | { type: 'label'; name: string; at?: gsap.Position };
