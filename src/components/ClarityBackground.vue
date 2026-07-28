<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const svgRoot = ref<SVGSVGElement | null>(null);
let ctx: gsap.Context | null = null;

const LOAD_ORDER = [
  '#left-top-decoration',
  '#slider-btn',
  '#content-card',
  '#graph-card',
  '#landscape',
  '#main-content',
];

const STAGGER = 0.28;

/** Fit the scroll range to whatever room the page actually has. */
// const scrollDistance = (): number => {
//   const max = document.documentElement.scrollHeight - window.innerHeight;
//   return Math.max(120, Math.min(520, max * 0.8));
// };

onMounted(() => {
  const root = svgRoot.value;
  if (!root) return;

  const loadTargets = LOAD_ORDER.map((sel) => root.querySelector<SVGElement>(sel)).filter(
    (el): el is SVGElement => !!el,
  );

  const topDeco = root.querySelector<SVGElement>('#right-top-decoration');
  const sidebar = root.querySelector<SVGElement>('#sidebar');
  const buttonCard = root.querySelector<SVGElement>('#button-card');
  const scrollTargets = [topDeco, sidebar, buttonCard].filter((el): el is SVGElement => !!el);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ctx = gsap.context(() => {
    if (reduced) {
      gsap.set([...loadTargets, ...scrollTargets], {
        filter: 'blur(0px)',
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      });
      return;
    }

    /* ---------- on load ---------- */

    gsap.set(loadTargets, {
      filter: 'blur(9px)',
      opacity: 0.35,
      scale: 1,
      willChange: 'filter, opacity, transform',
    });

    const tl = gsap.timeline();

    loadTargets.forEach((el, i) => {
      tl.to(
        el,
        {
          keyframes: [
            { filter: 'blur(3px)', opacity: 0.75, scale: 1.035, duration: 0.5, ease: 'power2.out' },
            { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 0.55, ease: 'power2.inOut' },
          ],
        },
        i * STAGGER,
      );
    });

    tl.set(loadTargets, { clearProps: 'willChange' });

    /* ---------- on scroll ---------- */

    const tl2 = gsap.timeline({
      scrollTrigger: {
        start: 0,
        end: 350,
        scrub: 0.6,
      },
    });

    if (topDeco) {
      tl2.fromTo(
        topDeco,
        { y: -300, opacity: 0, filter: 'blur(9px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'none' },
        0,
      );
    }

    if (sidebar) {
      tl2.fromTo(
        sidebar,
        { x: -300, opacity: 0, filter: 'blur(9px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'none' },
        1,
      );
    }

    if (buttonCard) {
      tl2.fromTo(
        buttonCard,
        { x: 480, y: 300, opacity: 0, filter: 'blur(9px)' },
        { x: 0, y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'none' },
        2,
      );
    }

    ScrollTrigger.refresh();
  }, root);
});

onBeforeUnmount(() => {
  ctx?.revert();
});
</script>

<template>
  <svg
    ref="svgRoot"
    viewBox="0 0 1672 941"
    preserveAspectRatio="none"
    role="img"
    aria-labelledby="title desc"
    version="1.1"
    id="svg4"
    sodipodi:docname="Background Rework.svg"
    inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
  >
    <sodipodi:namedview
      id="namedview4"
      pagecolor="#ffffff"
      bordercolor="#000000"
      borderopacity="0.25"
      inkscape:showpageshadow="2"
      inkscape:pageopacity="0.0"
      inkscape:pagecheckerboard="0"
      inkscape:deskcolor="#d1d1d1"
      showgrid="false"
      showguides="false"
      inkscape:zoom="0.59377855"
      inkscape:cx="714.07093"
      inkscape:cy="672.80975"
      inkscape:window-width="1920"
      inkscape:window-height="1051"
      inkscape:window-x="-9"
      inkscape:window-y="-9"
      inkscape:window-maximized="1"
      inkscape:current-layer="right-top-decoration"
    >
      <sodipodi:guide
        position="1369.8587,-172.60652"
        orientation="0,-1"
        id="guide4"
        inkscape:locked="false"
      />
      <sodipodi:guide
        position="450.71305,126.35434"
        orientation="0,-1"
        id="guide2"
        inkscape:locked="false"
      />
      <sodipodi:guide
        position="561.11957,107.72608"
        orientation="1,0"
        id="guide3"
        inkscape:locked="false"
      />
    </sodipodi:namedview>
    <title id="title">Deconstructed interface background with clarity cues</title>
    <desc id="desc">
      The supplied interface artwork with three subtle editable text cues embedded into existing
      interface controls: Defined, Aligned, and Visible.
    </desc>
    <rect
      style="
        display: inline;
        opacity: 1;
        fill: #f7f9fe;
        fill-opacity: 1;
        stroke: #081523;
        stroke-width: 0;
        stroke-dasharray: none;
      "
      id="background"
      width="1672"
      height="941"
      x="0"
      y="0"
      ry="72.201591"
      inkscape:label="Background"
    />
    <defs id="defs2">
      <inkscape:path-effect
        effect="fillet_chamfer"
        id="path-effect6"
        is_visible="true"
        lpeversion="1"
        nodesatellites_param="F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1"
        radius="0"
        unit="px"
        method="auto"
        mode="F"
        chamfer_steps="1"
        flexible="false"
        use_knot_distance="true"
        apply_no_radius="true"
        apply_with_radius="true"
        only_selected="false"
        hide_knots="false"
      />
      <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" id="feGaussianBlur1" />
        <feMerge id="feMerge2">
          <feMergeNode in="blur" id="feMergeNode1" />
          <feMergeNode in="SourceGraphic" id="feMergeNode2" />
        </feMerge>
      </filter>
    </defs>
    <g id="sidebar" inkscape:label="Sidebar" style="display: inline">
      <path
        style="
          display: inline;
          fill: #f0f4fd;
          fill-opacity: 1;
          stroke: #000000;
          stroke-width: 0;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        d="m 190.37174,941 c 0,0 -64.97174,-533.90434 -65.42609,-536.17608 -0.45434,-2.27174 -5.45217,-20.44565 -5.45217,-20.44565 l -9.99565,-13.63044 -12.721742,-5.90652 H 86.780436 L 0,373.47392 0.05,940.95 Z"
        id="path15"
        sodipodi:nodetypes="csccccccc"
        inkscape:label="Background"
      />
      <path
        style="
          display: inline;
          fill: #d1dffc;
          fill-opacity: 1;
          stroke: #000000;
          stroke-width: 0;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        d="m 0.05,882.646 c 43.293349,-5.52508 84.523866,-12.31549 127.93209,-16.86066 12.32752,1.6153 22.13536,7.98391 29.43125,16.47281 8.83425,17.51328 8.76553,27.75411 10.40627,41.76949 0.43805,5.59386 0.81146,11.07996 0.0888,16.92236 H 0.05 Z"
        id="path41"
        sodipodi:nodetypes="ccccccc"
        inkscape:label="Sidebar Decoration"
      />
      <g
        id="user-btn"
        inkscape:label="User Btn"
        transform="translate(110.85561,99.173674)"
        style="display: inline; stroke-width: 0; stroke-dasharray: none"
      >
        <rect
          style="
            display: inline;
            fill: #e5ecfd;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect22"
          width="89.159874"
          height="87.07386"
          x="-113.97902"
          y="593.23743"
          rx="7.9692469"
          ry="6.993628"
          transform="rotate(-4.1740109)"
          inkscape:label="Btn"
        />
        <path
          style="
            display: inline;
            fill: none;
            stroke: #a4c0f8;
            stroke-width: 2.1;
            stroke-linecap: butt;
            stroke-linejoin: miter;
            stroke-dasharray: none;
            stroke-opacity: 1;
          "
          d="m 76.959289,745.62684 c 6.89706,-0.64505 13.794122,-1.29009 20.691182,-1.93514 3.903859,1.24818 8.987969,2.73876 9.778279,7.43757 2.17179,4.23703 -0.6281,8.99215 -5.60158,7.84407 -10.428508,0.49401 -20.844512,1.24523 -31.26875,1.83696 -1.790645,-5.51874 0.264512,-12.22343 5.775149,-14.72031 z"
          id="path34"
          transform="translate(-110.85561,-99.173674)"
          inkscape:label="Body"
        />
        <ellipse
          style="
            opacity: 1;
            fill: #e5ecfd;
            fill-opacity: 1;
            stroke: #a4c0f8;
            stroke-width: 2.6;
            stroke-dasharray: none;
            stroke-opacity: 1;
          "
          id="path33"
          cx="85.609184"
          cy="727.2912"
          rx="10.452098"
          ry="9.7849426"
          inkscape:transform-center-x="-6.9470343"
          inkscape:transform-center-y="-7.3680667"
          transform="translate(-110.85561,-99.173674)"
          inkscape:label="Head"
        />
      </g>
      <g
        id="triple-btn"
        inkscape:label="Triple Btn"
        transform="translate(97.413423,-42.293165)"
        style="display: inline; stroke-width: 0; stroke-dasharray: none"
      >
        <rect
          style="
            display: inline;
            fill: #e5ecfd;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect31-5"
          width="89.159874"
          height="87.07386"
          x="-113.97902"
          y="593.23743"
          rx="7.9692469"
          ry="6.993628"
          transform="rotate(-4.1740109)"
          inkscape:label="Btn"
        />
        <g
          id="g37"
          inkscape:label="Triple Rec 2"
          transform="translate(-96.8204,43.020585)"
          style="stroke-width: 0; stroke-dasharray: none"
        >
          <rect
            style="
              display: inline;
              fill: #8eb2f8;
              fill-opacity: 1;
              stroke: #081523;
              stroke-width: 0;
              stroke-dasharray: none;
            "
            id="rect35-0-5"
            width="14.075787"
            height="45.71175"
            x="31.003445"
            y="579.0415"
            rx="5.2186832"
            ry="5.633009"
            transform="matrix(0.99364083,-0.11259621,0.08164724,0.99666129,0,0)"
            inkscape:label="Outside"
          />
          <rect
            style="
              display: inline;
              fill: #82abf8;
              fill-opacity: 1;
              stroke: #081523;
              stroke-width: 0;
              stroke-dasharray: none;
            "
            id="rect35-0"
            width="13.176332"
            height="26.78915"
            x="15.893071"
            y="596.70355"
            rx="4.8852048"
            ry="4.3676744"
            transform="matrix(0.9987964,-0.04904847,0.08132832,0.99668737,0,0)"
            inkscape:label="Inside"
          />
        </g>
        <g
          id="g36"
          inkscape:label="Triple Rec 1"
          transform="translate(-80.596142,42.137086)"
          style="stroke-width: 0; stroke-dasharray: none"
        >
          <rect
            style="
              display: inline;
              fill: #82abf8;
              fill-opacity: 1;
              stroke: #081523;
              stroke-width: 0;
              stroke-dasharray: none;
            "
            id="rect35"
            width="13.182474"
            height="32.37867"
            x="-17.329725"
            y="591.80743"
            rx="4.8874822"
            ry="5.2789836"
            transform="rotate(-4.8264291)"
            inkscape:label="Outside"
          />
          <rect
            style="
              display: inline;
              fill: #eef3fd;
              fill-opacity: 1;
              stroke: #081523;
              stroke-width: 0;
              stroke-dasharray: none;
            "
            id="rect36"
            width="5.3996935"
            height="24.435085"
            x="-9.4107113"
            y="595.7345"
            rx="3.4587345"
            ry="2.1482015"
            transform="rotate(-4.4462554)"
            inkscape:label="Inside"
          />
        </g>
        <rect
          style="
            display: inline;
            fill: #eef3fd;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect36-9"
          width="5.3970194"
          height="21.43211"
          x="15.383424"
          y="600.02417"
          rx="3.4570215"
          ry="1.8841959"
          transform="matrix(0.99768747,-0.06796842,0.08840425,0.99608468,-96.8204,43.020585)"
          inkscape:label="Inside"
        />
        <rect
          style="
            display: inline;
            fill: #eef3fd;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect36-9-0"
          width="5.4256196"
          height="38.828911"
          x="34.100388"
          y="583.9281"
          rx="2.5869038"
          ry="2.174433"
          transform="matrix(0.98754165,-0.15735787,0.08359584,0.99649974,-96.8204,43.020585)"
          inkscape:label="Inside"
        />
      </g>
      <g
        id="g35-7"
        inkscape:label="Boxes Btn"
        transform="matrix(1.0510521,-0.00184647,0.00181447,1.0695837,80.45013,-229.12935)"
        style="
          display: inline;
          opacity: 1;
          fill: #e5ecfd;
          fill-opacity: 1;
          stroke-width: 0;
          stroke-dasharray: none;
        "
      >
        <rect
          style="
            display: inline;
            fill: #e5ecfd;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect31-5-4"
          width="89.159874"
          height="87.07386"
          x="-113.97902"
          y="593.23743"
          rx="7.9692469"
          ry="6.993628"
          transform="rotate(-4.1740109)"
          inkscape:label="Btn"
        />
        <rect
          style="
            display: inline;
            fill: #1162f6;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect15-6-6"
          width="21.252295"
          height="21.345701"
          x="32.404724"
          y="458.0817"
          rx="7.4889345"
          ry="7.4284472"
          transform="matrix(0.95142479,0.00164249,-0.00161402,0.93494041,-76.912068,214.09015)"
        />
        <rect
          style="
            fill: #a2c2fb;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect15-6"
          width="21.252295"
          height="21.345701"
          x="57.770699"
          y="455.94873"
          rx="7.4889345"
          ry="7.4284472"
          transform="matrix(0.95142479,0.00164249,-0.00161402,0.93494041,-76.912068,214.09015)"
        />
        <rect
          style="
            fill: #1162f6;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect15-2"
          width="21.252295"
          height="21.345701"
          x="54.448929"
          y="430.51758"
          rx="7.4889345"
          ry="7.4284472"
          transform="matrix(0.95142479,0.00164249,-0.00161402,0.93494041,-76.912068,214.09015)"
        />
        <rect
          style="
            display: inline;
            opacity: 1;
            fill: #a2c2fb;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect15"
          width="21.252295"
          height="21.345701"
          x="31.083485"
          y="432.54266"
          rx="7.4889345"
          ry="7.4284472"
          transform="matrix(0.95142479,0.00164249,-0.00161402,0.93494041,-76.912068,214.09015)"
        />
      </g>
    </g>
    <g id="main-content" inkscape:label="Main Content" style="display: inline">
      <g
        id="cta"
        inkscape:label="CTA"
        transform="matrix(0.96375776,-0.10240106,0.09525346,1.0360759,-65.532353,-78.506294)"
        sodipodi:insensitive="true"
        style="display: inline"
      >
        <rect
          style="
            fill: #1162f6;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0.196682;
            stroke-dasharray: none;
          "
          id="rect25"
          width="226.17912"
          height="68.755623"
          x="237.0974"
          y="663.10468"
          rx="12.867472"
          ry="7.2169189"
          inkscape:label="CTA Button"
        />
        <rect
          style="
            fill: #72a2fa;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0.160676;
            stroke-dasharray: none;
          "
          id="rect26"
          width="125.33478"
          height="12.852146"
          x="296.55081"
          y="688.62054"
          rx="8.2127514"
          ry="6.4260731"
          transform="matrix(0.99998565,0.00535697,-0.00773836,0.99997006,0,0)"
          inkscape:label="CTA Content"
        />
      </g>
      <g
        id="copy-containers"
        inkscape:label="Copy Containers"
        style="display: inline"
        sodipodi:insensitive="true"
      >
        <rect
          style="
            fill: #cfddfc;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect24-2-8-8"
          width="314.85803"
          height="20.388237"
          x="198.0421"
          y="523.11755"
          rx="13.305941"
          ry="7.2165709"
          transform="matrix(0.99528294,-0.09701479,0.0320457,0.9994864,0,0)"
          inkscape:transform-center-x="-33.651541"
          inkscape:transform-center-y="-44.645038"
          inkscape:label="Rec SubHeader Line 4"
        />
        <rect
          style="
            fill: #cfddfc;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect24-2-8"
          width="545.06409"
          height="20.603731"
          x="124.74147"
          y="469.30151"
          rx="23.034477"
          ry="7.2928467"
          transform="matrix(0.99537838,-0.09603062,0.1759016,0.98440775,0,0)"
          inkscape:transform-center-x="-53.21628"
          inkscape:transform-center-y="-46.884854"
          inkscape:label="Rec SubHeader Line 3"
        />
        <rect
          style="
            fill: #cfddfc;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect24-2"
          width="545.06409"
          height="20.603731"
          x="133.78256"
          y="418.14047"
          rx="23.034477"
          ry="7.2928467"
          transform="matrix(0.99537838,-0.09603062,0.1759016,0.98440775,0,0)"
          inkscape:transform-center-x="-53.21628"
          inkscape:transform-center-y="-46.884854"
          inkscape:label="Rec SubHeader Line 2"
        />
        <rect
          style="
            fill: #cfddfc;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect24"
          width="371.04886"
          height="20.491846"
          x="154.95102"
          y="363.58817"
          rx="15.680572"
          ry="7.2532444"
          transform="matrix(0.9959951,-0.08940788,0.09590997,0.99539001,0,0)"
          inkscape:label="Rec SubHeader Line 1"
        />
        <rect
          style="
            fill: #0a3383;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="rect23"
          width="506.72653"
          height="52.345684"
          x="161.48195"
          y="257.814"
          ry="20.166063"
          transform="matrix(0.99598068,-0.08956828,0.0861734,0.99628015,0,0)"
          rx="13.07921"
          inkscape:label="Rect Header"
        />
      </g>
    </g>
    <g id="landscape" inkscape:label="Landscape" style="display: inline">
      <rect
        style="
          display: inline;
          opacity: 1;
          fill: #dfe9fc;
          fill-opacity: 1;
          stroke: #081523;
          stroke-width: 0.110015;
          stroke-dasharray: none;
        "
        id="rect38"
        width="803.23602"
        height="483.06247"
        x="816.32928"
        y="300.86438"
        rx="23.595545"
        ry="34.861221"
        transform="matrix(0.99506723,-0.09920285,0.08036438,0.99676555,0,0)"
        inkscape:label="Background"
      />
      <path
        style="
          fill: #b3ccfa;
          fill-opacity: 1;
          stroke: #000000;
          stroke-width: 0;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        d="m 1225.8102,497.3762 c 0,0 -118.7842,-91.90157 -120.6149,-92.35591 -1.8306,-0.45434 -16.7789,-7.96185 -16.7789,-7.96185 h -5.9496 l -9.6108,4.54342 -203.94803,219.49762 4.40883,52.65305 c 0.47883,4.52446 4.01023,10.003 5.70065,12.55862 l 4.09891,5.25509 4.9058,3.93317 c 6.60525,4.97703 19.35096,1.71239 30.65336,0.5856 59.96592,-5.97828 96.17168,-9.1981 147.16598,-14.67165 z"
        id="path39"
        sodipodi:nodetypes="csccccccccscc"
        inkscape:label="Mountain"
      />
      <path
        style="
          fill: #b3ccfa;
          fill-opacity: 1;
          stroke: #000000;
          stroke-width: 0.2;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        d="m 1065.8415,681.41336 314.463,-360.41598 4.4137,-3.91877 4.6733,-2.4421 6.7748,-1.4211 5.0382,0.5124 262.3012,166.0863 c 0.4266,5.29016 1.1175,13.85953 1.5403,19.10353 1.0722,13.29906 2.1798,27.03637 2.7323,33.88948 1.6075,19.93752 2.5635,31.79465 3.8401,47.62878 0.3171,3.93367 0.6284,8.82762 0.57,12.82693 -0.064,4.37503 -1.2024,7.26013 -2.031,11.4238 -0.9688,4.86775 -4.2758,9.03422 -7.7634,13.30453 -1.7496,2.14234 -6.6343,4.36351 -9.6394,5.21436 -194.3839,19.27827 -388.3398,40.34391 -583.1436,57.86917 -1.2565,0.11304 -2.513,0.22593 -3.7695,0.33867 z"
        id="path38"
        inkscape:label="Mountain 2"
        sodipodi:nodetypes="cccccccsssssscsc"
      />
      <circle
        style="
          opacity: 1;
          fill: #bdd2fb;
          fill-opacity: 1;
          stroke: #081523;
          stroke-width: 0;
          stroke-dasharray: none;
        "
        id="path40"
        cx="1212.4822"
        cy="302.9599"
        r="29.557064"
        inkscape:label="Moon"
      />
    </g>
    <g id="graph-card" style="display: inline" inkscape:label="Graph Card">
      <rect
        style="
          display: inline;
          opacity: 1;
          fill: #f0f4fd;
          fill-opacity: 1;
          stroke: #081523;
          stroke-width: 0;
          stroke-dasharray: none;
        "
        id="rect4"
        width="438.71393"
        height="200.92163"
        x="179.76929"
        y="732.80176"
        transform="matrix(0.99778869,-0.06646596,0.05998993,0.99819898,0,0)"
        ry="13.413726"
        inkscape:label="Background"
      />
      <rect
        style="
          opacity: 1;
          fill: #d1dffc;
          fill-opacity: 1;
          stroke: #081523;
          stroke-width: 0;
          stroke-dasharray: none;
        "
        id="rect11"
        width="158.5674"
        height="14.084783"
        x="361.69391"
        y="869.34235"
        ry="7.0423913"
        transform="rotate(-4.3079167)"
        inkscape:label="Row 3"
      />
      <rect
        style="
          opacity: 1;
          fill: #d1dffc;
          fill-opacity: 1;
          stroke: #081523;
          stroke-width: 0;
          stroke-dasharray: none;
        "
        id="rect10"
        width="194.00653"
        height="15.902174"
        x="363.42401"
        y="828.01337"
        ry="7.951087"
        transform="rotate(-4.250541)"
        inkscape:label="Row 2"
      />
      <rect
        style="
          display: inline;
          opacity: 1;
          fill: #d1dffc;
          fill-opacity: 1;
          stroke: #081523;
          stroke-width: 0;
          stroke-dasharray: none;
        "
        id="rect9"
        width="112.87996"
        height="14.307712"
        x="352.85815"
        y="792.27289"
        ry="7.1538558"
        transform="matrix(0.99685997,-0.07918454,0.08367761,0.99649288,0,0)"
        inkscape:label="Row 1"
      />
      <g
        id="g4"
        inkscape:label="Circle Graph"
        style="stroke-width: 0.1; stroke-dasharray: none"
        transform="translate(0.55810135,-1.9855264)"
      >
        <ellipse
          style="
            display: inline;
            opacity: 1;
            fill: #c6d7fb;
            fill-opacity: 1;
            stroke: #081523;
            stroke-width: 0;
            stroke-dasharray: none;
          "
          id="circle"
          cx="326.04959"
          cy="814.64563"
          rx="62.61095"
          ry="64.330322"
          inkscape:label="Circle"
        />
        <path
          style="
            display: inline;
            fill: #dbe6fc;
            fill-opacity: 1;
            stroke: #000000;
            stroke-width: 0;
            stroke-linecap: butt;
            stroke-linejoin: miter;
            stroke-dasharray: none;
            stroke-opacity: 1;
          "
          d="m 325.52929,814.74689 c 14.99403,15.06399 29.98806,30.12797 44.98209,45.19196 2.17345,-2.7354 4.58058,-5.30344 6.59981,-8.14929 1.90028,-3.1841 4.08476,-6.21761 5.42281,-9.6996 1.21126,-2.55106 2.33048,-5.13689 3.03636,-7.87886 0.89771,-2.63131 1.58964,-5.31126 1.88886,-8.08279 0.67129,-3.77537 1.26851,-7.5688 1.0739,-11.41615 -0.32907,-1.49992 1.05994,-4.8406 -1.4698,-3.9967 -20.51134,1.34381 -41.02269,2.68762 -61.53403,4.03143 z"
          id="chunk-2"
          inkscape:label="Chunk 2"
        />
        <path
          style="
            display: inline;
            fill: #0e5ff3;
            fill-opacity: 1;
            stroke: #000000;
            stroke-width: 0;
            stroke-linecap: butt;
            stroke-linejoin: miter;
            stroke-dasharray: none;
            stroke-opacity: 1;
          "
          d="m 319.7287,750.64397 c 1.93353,21.36764 3.86706,42.73528 5.80059,64.10292 21.00282,-1.37601 42.00565,-2.75202 63.00847,-4.12803 -0.62455,-8.0487 -2.48595,-16.07994 -5.94702,-23.39261 -5.02141,-10.88236 -13.00942,-20.51606 -23.25345,-26.8361 -3.72581,-2.76709 -8.14529,-4.36808 -12.34038,-6.29149 -4.80921,-1.51324 -9.68031,-2.98796 -14.73996,-3.35161 -4.15825,-0.63971 -8.3489,-0.0909 -12.52825,-0.10308 z"
          id="chunk-1"
          inkscape:label="Chunk 1"
        />
      </g>
    </g>
    <g id="content-card" inkscape:label="Content Card" style="display: inline">
      <rect
        style="
          display: inline;
          opacity: 1;
          fill: #edf2fd;
          fill-opacity: 1;
          stroke: #a4c0f8;
          stroke-width: 0;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="rect34"
        width="383.78983"
        height="169.40184"
        x="675.33771"
        y="792.09894"
        rx="13.922781"
        ry="7.3275084"
        transform="matrix(0.99767004,-0.06822385,0.0546531,0.9985054,0,0)"
        inkscape:label="Background"
      />
      <rect
        style="
          display: inline;
          fill: #cadafb;
          fill-opacity: 1;
          stroke: #a4c0f8;
          stroke-width: 0;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="rect37-9"
        width="174.47131"
        height="12.512872"
        x="679.15527"
        y="912.17413"
        rx="0"
        ry="5.913846"
        transform="matrix(0.99775358,-0.06699095,0.08377976,0.9964843,0,0)"
        inkscape:label="Row 3"
      />
      <rect
        style="
          display: inline;
          opacity: 1;
          fill: #cadafb;
          fill-opacity: 1;
          stroke: #a4c0f8;
          stroke-width: 0;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="rect40"
        width="287.99786"
        height="13.756526"
        x="666.88245"
        y="878.24146"
        ry="6.093564"
        transform="matrix(0.99718615,-0.07496519,0.09365836,0.99560439,0,0)"
        inkscape:label="Row 2"
      />
      <rect
        style="
          display: inline;
          opacity: 1;
          fill: #cadafb;
          fill-opacity: 1;
          stroke: #a4c0f8;
          stroke-width: 0;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="rect37"
        width="156.00258"
        height="12.504024"
        x="687.60309"
        y="838.93164"
        rx="0"
        ry="5.9096642"
        transform="rotate(-4.2967312)"
        inkscape:label="Row 1"
      />
    </g>
    <g id="slider-btn" inkscape:label="Slider Btn" transform="translate(284.83097,-31.445979)">
      <rect
        style="
          display: inline;
          opacity: 1;
          fill: #e9effd;
          fill-opacity: 1;
          stroke: #b3ccfa;
          stroke-width: 0.206256;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="rect13"
        width="268.09991"
        height="73.292656"
        x="816.91754"
        y="205.56253"
        ry="17.341845"
        transform="matrix(0.99348103,-0.11399756,0.12429568,0.99224522,0,0)"
        inkscape:label="Background"
      />
      <rect
        style="
          opacity: 1;
          fill: #afcafa;
          fill-opacity: 1;
          stroke: #b3ccfa;
          stroke-width: 0.185984;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="rect16"
        width="149.06429"
        height="14.545254"
        x="897.89032"
        y="234.54924"
        ry="7.2726269"
        transform="matrix(0.99365933,-0.11243279,0.10704647,0.99425402,0,0)"
        inkscape:label="Slider"
      />
      <ellipse
        style="
          display: inline;
          opacity: 1;
          fill: #367bf8;
          fill-opacity: 1;
          stroke: #b3ccfa;
          stroke-width: 0.228964;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="path13"
        cx="884.51074"
        cy="143.62381"
        rx="16.359835"
        ry="14.996514"
        inkscape:label="Circle"
      />
    </g>
    <g id="button-card" style="display: inline" inkscape:label="Button Card">
      <rect
        style="
          display: inline;
          opacity: 0.481967;
          fill: #e5ecfd;
          fill-opacity: 1;
          stroke: #b3ccfa;
          stroke-width: 2.514;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="rect12"
        width="475.62521"
        height="138.87497"
        x="1062.7172"
        y="871.08002"
        ry="17.334034"
        transform="matrix(0.9963766,-0.08505098,0.08578564,0.99631362,0,0)"
        inkscape:label="Background"
      />
      <rect
        style="
          fill: #1162f6;
          fill-opacity: 1;
          stroke: #b3ccfa;
          stroke-width: 0.203391;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        id="rect17-6-2"
        width="136.6575"
        height="68.498283"
        x="1363.3723"
        y="911.9054"
        ry="7.2751613"
        transform="matrix(0.99619955,-0.08710027,0.09356471,0.9956132,0,0)"
        inkscape:label="Btn3"
      />
      <g id="visible-btn" inkscape:label="Visible Btn" style="display: inline">
        <rect
          style="
            fill: #f7f9fe;
            fill-opacity: 1;
            stroke: #b3ccfa;
            stroke-width: 1.58804;
            stroke-dasharray: none;
            stroke-opacity: 1;
          "
          id="rect17-6"
          width="120.78915"
          height="66.379288"
          x="1234.2549"
          y="925.44824"
          ry="7.0501037"
          transform="matrix(0.99542311,-0.09556581,0.08527368,0.99635757,0,0)"
          inkscape:label="Btn2"
        />
        <text
          xml:space="preserve"
          style="
            font-style: normal;
            font-variant: normal;
            font-weight: normal;
            font-stretch: normal;
            font-size: 28px;
            font-family: 'Helvetica Neue';
            -inkscape-font-specification: 'Helvetica Neue';
            display: inline;
            opacity: 0.908907;
            fill: #1162f6;
            fill-opacity: 1;
            stroke: #b3ccfa;
            stroke-width: 0;
            stroke-dasharray: none;
            stroke-opacity: 1;
          "
          x="1248.0819"
          y="964.33344"
          id="text17-9"
          transform="rotate(-5.2431446)"
          inkscape:label="Visible"
        >
          <tspan
            sodipodi:role="line"
            id="tspan17-4"
            x="1248.0819"
            y="964.33344"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 28px;
              font-family: 'Helvetica Neue';
              -inkscape-font-specification: 'Helvetica Neue';
              opacity: 0.8;
              fill: #1162f6;
              fill-opacity: 1;
              stroke-width: 0;
              stroke-dasharray: none;
            "
          >
            Visible
          </tspan>
        </text>
      </g>
      <g id="defined-btn" inkscape:label="Defined Btn" style="display: inline">
        <rect
          style="
            opacity: 1;
            fill: #f7f9fe;
            fill-opacity: 1;
            stroke: #b3ccfa;
            stroke-width: 1.5911;
            stroke-dasharray: none;
            stroke-opacity: 1;
          "
          id="rect17"
          width="120.82125"
          height="68.432289"
          x="1099.1547"
          y="928.46454"
          ry="7.2681518"
          transform="matrix(0.9951354,-0.09851665,0.0827135,0.99657337,0,0)"
          inkscape:label="Btn1"
        />
        <text
          xml:space="preserve"
          style="
            font-style: normal;
            font-variant: normal;
            font-weight: normal;
            font-stretch: normal;
            font-size: 28px;
            font-family: 'Helvetica Neue';
            -inkscape-font-specification: 'Helvetica Neue';
            display: inline;
            opacity: 0.808;
            fill: #1162f6;
            fill-opacity: 1;
            stroke: #b3ccfa;
            stroke-width: 0;
            stroke-dasharray: none;
            stroke-opacity: 1;
          "
          x="1103.4972"
          y="964.63287"
          id="text17"
          transform="rotate(-5.2431446)"
          inkscape:label="Defined"
        >
          <tspan
            sodipodi:role="line"
            id="tspan17"
            x="1103.4972"
            y="964.63287"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 28px;
              font-family: 'Helvetica Neue';
              -inkscape-font-specification: 'Helvetica Neue';
              fill: #1162f6;
              fill-opacity: 1;
              stroke-width: 0;
              stroke-dasharray: none;
            "
          >
            Defined
          </tspan>
        </text>
      </g>
    </g>
    <path
      style="
        display: inline;
        fill: #d1dffc;
        fill-opacity: 1;
        stroke: #000000;
        stroke-width: 0;
        stroke-linecap: butt;
        stroke-linejoin: miter;
        stroke-dasharray: none;
        stroke-opacity: 1;
      "
      d="M 0,132.36424 243.53044,77.239131 c 0,0 161.27283,-37.080077 162.87919,-37.080077 1.60636,0 62.64812,-13.493442 65.53957,-13.814715 2.89146,-0.321272 12.20836,-4.819086 12.20836,-4.819086 L 497.97227,0 H 0 Z"
      id="left-top-decoration"
      inkscape:label="Left Top Decoration"
    />
    <g id="right-top-decoration" inkscape:label="Right Top Decoration" style="display: inline">
      <path
        style="
          display: inline;
          fill: #d1dffc;
          fill-opacity: 1;
          stroke: #000000;
          stroke-width: 0;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        d="m 1424.522,0 10.2807,95.09664 5.7829,10.92326 15.4211,7.71054 19.9189,-1.28509 L 1672,89.313736 V 0 Z"
        id="path6"
        inkscape:label="Decoration"
      />
      <text
        xml:space="preserve"
        style="
          font-style: normal;
          font-variant: normal;
          font-weight: normal;
          font-stretch: normal;
          font-size: 40px;
          font-family: 'Helvetica Neue';
          -inkscape-font-specification: 'Helvetica Neue';
          display: inline;
          opacity: 0.8;
          fill: #1162f6;
          fill-opacity: 1;
          stroke: #b3ccfa;
          stroke-width: 0;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
        x="1473.652"
        y="209.59259"
        id="text1"
        transform="rotate(-5.3669497)"
        inkscape:label="Aligned"
      >
        <tspan
          sodipodi:role="line"
          id="tspan1"
          x="1473.652"
          y="209.59259"
          style="
            font-style: normal;
            font-variant: normal;
            font-weight: normal;
            font-stretch: normal;
            font-size: 40px;
            font-family: 'Helvetica Neue';
            -inkscape-font-specification: 'Helvetica Neue';
            opacity: 0.8;
            fill: #1162f6;
            fill-opacity: 1;
            stroke-width: 0;
            stroke-dasharray: none;
          "
        >
          Aligned
        </tspan>
      </text>
    </g>
    <metadata id="metadata2">
      <rdf:RDF>
        <cc:Work rdf:about="">
          <dc:title>Deconstructed interface background with clarity cues</dc:title>
        </cc:Work>
      </rdf:RDF>
    </metadata>
  </svg>
</template>

<style scoped lang="scss">
$load: '#left-top-decoration, #slider-btn, #content-card, #graph-card, #landscape, #main-content';
$scroll: '#right-top-decoration, #sidebar, #button-card';

svg {
  display: block;
  width: 100%;
  height: 100%;
}

#{$load} {
  filter: blur(9px);
  opacity: 0.35;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

#{$scroll} {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

@media (prefers-reduced-motion: reduce) {
  #{$load},
  #{$scroll} {
    filter: none;
    opacity: 1;
  }
}
</style>
