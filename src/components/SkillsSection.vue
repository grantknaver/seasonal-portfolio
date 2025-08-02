<script lang="ts" setup>
import { ref, onMounted, reactive, computed, nextTick } from 'vue';
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
    strength: 17,
    years: 7,
    fillColor: generateRandomColor(getCustomCssVar('dark')),
  },
  {
    name: 'Vue',
    strength: 17,
    years: 3,
    fillColor: generateRandomColor(getCustomCssVar('primary')),
  },
  {
    name: 'Quasar',
    strength: 10,
    years: 2,
    fillColor: generateRandomColor(getCustomCssVar('secondary')),
  },
  {
    name: 'Pinia',
    strength: 13,
    years: 2,
    fillColor: generateRandomColor(getCustomCssVar('accent')),
  },
  {
    name: 'JavaScript',
    strength: 15,
    years: 7,
    fillColor: generateRandomColor(getCustomCssVar('dark')),
  },
  {
    name: 'TypeScript',
    strength: 15,
    years: 2,
    fillColor: generateRandomColor(getCustomCssVar('primary')),
  },
  {
    name: 'D3.js',
    strength: 5,
    years: 2,
    fillColor: generateRandomColor(getCustomCssVar('secondary')),
  },
  {
    name: 'Highcharts',
    strength: 4,
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
    fillColor: generateRandomColor(getCustomCssVar('primary')),
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
  { name: 'NgRx', strength: 5, years: 1, fillColor: generateRandomColor(getCustomCssVar('dark')) },
  {
    name: 'Figma',
    strength: 8,
    years: 4,
    fillColor: generateRandomColor(getCustomCssVar('primary')),
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
    fillColor: generateRandomColor(getCustomCssVar('primary')),
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
  left: tooltip.x + 'px',
  top: tooltip.y + 'px',
  pointerEvents: 'none',
  zIndex: 1000,
}));

const calculateFontSize = (strength: number) => {
  const size = Math.floor((strength + 12) * 0.75);
  return Math.max(size, 10);
};

onMounted(async () => {
  await nextTick();
  const width = container.value?.clientWidth || 800;
  const height = container.value?.clientHeight || 600;

  const data: SkillNode[] = skills.value.map((d) => ({
    ...d,
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
  }));

  const svgEl = d3
    .select(svg.value)
    .attr('viewBox', [0, 0, width, height])
    .style('background-color', 'red');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const simulation = d3
    .forceSimulation<SkillNode>(data)
    .alphaDecay(0) // prevent simulation from stopping
    .velocityDecay(0.8) // some friction
    .force('x', d3.forceX(width / 2).strength(0.01))
    .force('y', d3.forceY(height / 2).strength(0.01))
    .force(
      'collision',
      d3.forceCollide<SkillNode>().radius((d) => d.strength * 4 + 1),
    )
    .on('tick', ticked);

  const nodeGroup = svgEl
    .selectAll('g.node')
    .data(data)
    .join('g')
    .attr('class', 'node')
    .style('cursor', 'pointer')
    .on('mouseover', function (event, d) {
      tooltip.visible = true;
      tooltip.data = d;
      tooltip.x = event.offsetX + 10;
      tooltip.y = event.offsetY + 10;
    })
    .on('mousemove', function (event) {
      tooltip.x = event.offsetX + 10;
      tooltip.y = event.offsetY + 10;
    })
    .on('mouseleave', () => {
      tooltip.visible = false;
    });

  nodeGroup
    .append('circle')
    .attr('r', (d) => d.strength * 4.5)
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
    // keep nodes inside bounds
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
  <div ref="container" class="skill-chart-container">
    <svg ref="svg" class="chart-svg"></svg>

    <div
      v-if="tooltip.visible && tooltip.data"
      :style="tooltipStyle"
      class="bg-dark text-white shadow-2 rounded q-pa-sm z-50"
    >
      <div>Years: {{ tooltip.data.years }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skill-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}

.chart-svg {
  width: 100%;
  height: 100%;
}
</style>
