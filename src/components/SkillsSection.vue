<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick, computed } from 'vue';
import type { CSSProperties } from 'vue';
import type { SkillNode } from '../shared/models/skillNode';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import { getCustomCssVar } from '../shared/utils/getCustomCssVar';

const container = ref<HTMLElement | null>(null);
const svg = ref(null);

const generateRandomColor = (themeColor: string) => chroma(themeColor).darken().hex();

const skills = ref<SkillNode[]>([
  {
    name: 'Angular',
    strength: 18,
    years: 7,
    fillColor: generateRandomColor(getCustomCssVar('dark')),
  },
  {
    name: 'Vue',
    strength: 20,
    years: 3,
    fillColor: generateRandomColor(getCustomCssVar('accent')),
  },
  {
    name: 'Quasar',
    strength: 10,
    years: 3,
    fillColor: generateRandomColor(getCustomCssVar('secondary')),
  },
  {
    name: 'Pinia',
    strength: 15,
    years: 3,
    fillColor: generateRandomColor(getCustomCssVar('accent')),
  },
  {
    name: 'JavaScript',
    strength: 15,
    years: 8,
    fillColor: generateRandomColor(getCustomCssVar('dark')),
  },
  {
    name: 'TypeScript',
    strength: 15,
    years: 8,
    fillColor: generateRandomColor(getCustomCssVar('secondary')),
  },
  {
    name: 'D3.js',
    strength: 4,
    years: 2,
    fillColor: generateRandomColor(getCustomCssVar('secondary')),
  },
  {
    name: 'Highcharts',
    strength: 5,
    years: 1,
    fillColor: generateRandomColor(getCustomCssVar('accent')),
  },
  {
    name: 'Chart.js',
    strength: 4,
    years: 1,
    fillColor: generateRandomColor(getCustomCssVar('dark')),
  },
  {
    name: 'Firebase',
    strength: 5,
    years: 3,
    fillColor: generateRandomColor(getCustomCssVar('secondary')),
  },
  {
    name: 'MongoDB',
    strength: 9,
    years: 4,
    fillColor: generateRandomColor(getCustomCssVar('secondary')),
  },
  {
    name: 'Node.js',
    strength: 8,
    years: 4,
    fillColor: generateRandomColor(getCustomCssVar('accent')),
  },
  { name: 'NgRx', strength: 10, years: 5, fillColor: generateRandomColor(getCustomCssVar('dark')) },
  {
    name: 'Figma',
    strength: 8,
    years: 4,
    fillColor: generateRandomColor(getCustomCssVar('accent')),
  },
  {
    name: 'Git',
    strength: 12,
    years: 7,
    fillColor: generateRandomColor(getCustomCssVar('secondary')),
  },
  {
    name: 'WordPress',
    strength: 8,
    years: 3,
    fillColor: generateRandomColor(getCustomCssVar('dark')),
  },
  { name: 'SEO', strength: 5, years: 1, fillColor: '#FF9705' },
  { name: 'Sales', strength: 15, years: 6, fillColor: '#FF9705' },
  { name: 'Marketing', strength: 7, years: 2, fillColor: '#FF9705' },
  {
    name: 'DynamoDB',
    strength: 4,
    years: 1,
    fillColor: generateRandomColor(getCustomCssVar('dark')),
  },
]);

const tooltip = reactive<{
  visible: boolean;
  x: number;
  y: number;
  data: SkillNode | null;
}>({
  visible: false,
  x: 0,
  y: 0,
  data: null,
});

const tooltipStyle = computed<CSSProperties>(() => ({
  position: 'absolute',
  left: tooltip.x + 20 + 'px',
  top: tooltip.y + 10 + 'px',
  pointerEvents: 'none',
  zIndex: 1000,
}));

const calculateFontSize = (strength: number) => {
  const size = Math.floor((strength + 10) * 0.75);
  return Math.max(size, 10);
};

const width = container.value?.clientWidth || 800;
const height = container.value?.clientHeight || 600;
const data: SkillNode[] = skills.value.map((d) => ({
  ...d,
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - 0.5) * 2,
  vy: (Math.random() - 0.5) * 2,
}));

function repellingForce() {
  let nodes: SkillNode[] = [];

  function force(alpha: number) {
    if (!tooltip.data) return;

    const center = { x: tooltip.data.x!, y: tooltip.data.y! };

    nodes.forEach((node) => {
      if (node === tooltip.data) return;

      const dx = node.x! - center.x;
      const dy = node.y! - center.y;
      const dist2 = dx * dx + dy * dy + 1;

      const strength = 1000; // tweak as needed
      node.vx! += (dx / dist2) * strength * alpha;
      node.vy! += (dy / dist2) * strength * alpha;
    });
  }

  force.initialize = (n: SkillNode[]) => {
    nodes = n;
  };

  return force;
}

onMounted(async () => {
  await nextTick();

  const svgEl = d3.select(svg.value).attr('viewBox', [0, 0, width, height]);

  const simulation = d3
    .forceSimulation<SkillNode>(data)
    .alphaDecay(0)
    .velocityDecay(0.8)
    .force('x', d3.forceX(width / 2).strength(0.01))
    .force('y', d3.forceY(height / 2).strength(0.01))
    .force(
      'collision',
      d3.forceCollide<SkillNode>().radius((d) => d.strength * 4 + 1),
    )
    .force('repel', repellingForce()) // 🔥 add this line
    .on('tick', ticked);

  const nodeGroup = svgEl
    .selectAll('g.node')
    .data(data)
    .join('g')
    .attr('class', 'node')
    .style('cursor', 'pointer')
    .on('mouseover', function (event, d) {
      d.fx = d.x;
      d.fy = d.y;

      tooltip.visible = true;
      tooltip.data = d;
      tooltip.x = event.offsetX + 10;
      tooltip.y = event.offsetY + 10;
      simulation.alphaTarget(0.3).restart(); // 🔥 triggers the repel force
    })

    .on('mousemove', function (event) {
      tooltip.x = event.offsetX + 10;
      tooltip.y = event.offsetY + 10;
    })
    .on('mouseleave', function (event, d) {
      d.fx = null;
      d.fy = null;

      tooltip.visible = false;
    });
  nodeGroup
    .append('circle')
    .attr('r', (d) => d.strength * 6.5)
    .attr('fill', (d) => d.fillColor);

  nodeGroup
    .append('text')
    .text((d) => d.name)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('fill', 'white')
    .attr('font-size', (d) => `${calculateFontSize(d.strength)}px`)
    .attr('pointer-events', 'none');

  function ticked() {
    data.forEach((d) => {
      const r = d.strength * 4;
      d.x = Math.max(r, Math.min(width - r, d.x ?? 0));
      d.y = Math.max(r, Math.min(height - r, d.y ?? 0));
    });

    nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }
});
</script>

<template>
  <section>
    <div class="mobile-view full-width">
      <q-card class="full-width">
        <q-card-section class="section-container q-pa-lg bg-accent">
          <h1 class="q-mt-none text-primary">Skills</h1>
          <q-separator color="primary" class="full-width q-mb-md" />
          <p class="text-primary">
            I'm a full-stack JavaScript developer focused on front-end architecture and UX. I began
            with the MEAN stack, later shifting to the Vue ecosystem to build responsive,
            component-driven UIs. My backend work centers on MongoDB, recently expanding into
            DynamoDB for cloud-native apps. I thrive at the intersection of design and data,
            ensuring every component is fast, purposeful, and polished.
          </p>
        </q-card-section>

        <q-card-section class="section-container toolkit q-mt-md full-width bg-secondary">
          <h2 class="text-primary q-mt-md">Toolkit</h2>

          <q-separator color="primary" class="skills-list full-width q-mb-lg" />
          <div v-for="skill in skills" :key="skill.name" class="q-mb-sm">
            <div class="skillName text-bold text-dark">
              {{ skill.name }}
              <q-tooltip class="bg-dark" anchor="center middle">{{ skill.years }} years</q-tooltip>
            </div>
            <q-linear-progress :value="skill.strength / 20" color="primary" rounded />
          </div>
        </q-card-section>

        <q-card-section class="section-container bg-accent q-mt-md q-pa-lg">
          <p class="text-primary text-center q-ma-none">
            With a background in fine arts and sales, I bring a strong creative lens and
            user-focused mindset to my work. I enjoy prototyping in Figma, am proficient with Adobe
            Creative Suite, and apply SEO best practices to help build and scale user-centric
            digital products.
          </p>
        </q-card-section>

        <q-card-section class="section-container bg-dark">
          <h2 class="q-mt-md text-secondary">Coming Soon</h2>
          <q-separator color="primary" class="skills-list full-width" />
          <p class="text-primary q-mt-lg">
            I’m currently deepening my DynamoDB expertise, leveling up my Figma design skills, and
            exploring Python for backend scripting and automation. This section will soon showcase
            new projects, experiments, and lessons learned along the way — stay tuned.
          </p>
        </q-card-section>
      </q-card>
    </div>
    <div ref="container" class="desktop-view full-width q-mb-xl">
      <q-card
        class="card full-width col flex column items-center justify-center q-pa-sm bg-transparent"
      >
        <q-card-section class="section-container q-pa-lg">
          <h1 class="q-mt-none text-primary text-center">Skills</h1>
          <q-separator color="primary" class="full-width q-mb-md" />
          <p class="text-primary text-center">
            I'm a full-stack JavaScript developer focused on front-end architecture and UX. I began
            with the MEAN stack, later shifting into Vue 3, Pinia, and Quasar to build responsive,
            component-driven UIs. My backend work centers on MongoDB, recently expanding into
            DynamoDB for cloud-native apps. I thrive at the intersection of design and data,
            ensuring every component is fast, purposeful, and polished.
          </p>
        </q-card-section>

        <q-card-section class="section-container flex column col">
          <p class="text-accent">
            The graph below illustrates my current toolset. The size of each sphere represents my
            level of expertise in that area.
          </p>
          <svg ref="svg" class="chart-svg"></svg>

          <div
            v-if="tooltip.visible && tooltip.data"
            :style="tooltipStyle"
            class="tooltip bg-accent text-white shadow-2 rounded q-pa-sm z-50"
          >
            <div>Years: {{ tooltip.data.years }}</div>
          </div>
        </q-card-section>
        <q-card-section class="section-container q-mt-lg">
          <p class="text-primary text-center">
            With a background in fine arts and sales, I bring a strong creative lens and
            user-focused mindset to my work. I enjoy prototyping in Figma, am proficient with Adobe
            Creative Suite, and apply SEO best practices to help build and scale user-centric
            digital products.
          </p>
        </q-card-section>
        <q-card-section class="section-container q-pa-lg">
          <q-separator color="primary" class="full-width q-mb-lg" />
          <h2 class="q-mt-none text-secondary">Coming Soon</h2>

          <p class="text-primary">
            I’m currently deepening my DynamoDB expertise, leveling up my Figma design skills, and
            exploring Python for backend scripting and automation. This section will soon showcase
            new projects, experiments, and lessons learned along the way — stay tuned.
          </p>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.mobile-view {
  @media (min-width: $breakpoint-md) {
    display: none;
  }

  .q-card {
    background-color: rgba(black, 0.5) !important;
    padding: 1rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2rem;
      text-shadow: 2px 2px 2px var(--q-dark);
    }

    .section-container:nth-child(1) {
      border-radius: 10px;
      border: solid 4px var(--q-primary);
    }

    .section-container:nth-child(2) {
      border-radius: 10px;
    }

    .section-container:nth-child(3) {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .section-container:nth-child(4) {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .skillName {
      cursor: pointer;
    }
  }
}

.desktop-view {
  display: none;
  position: relative;
  width: 100%;
  min-height: 100%;

  @media (min-width: $breakpoint-md) {
    display: flex;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2rem;
  }

  .chart-svg {
    width: 100%;
    height: auto;
    max-width: 700px;
    border: white solid 4px;
    border-radius: 10px;
    box-shadow: 5px 10px 10px var(--q-dark);
  }

  .section-container:nth-child(2) {
    display: flex;
    width: 90%;
    justify-content: center;
    background-color: var(--q-primary);
    border-radius: 5px;
  }

  .tooltip {
    font-size: 0.6rem;
  }
}
</style>
