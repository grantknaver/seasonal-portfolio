<script lang="ts" setup>
import { ref, onMounted, reactive, computed, nextTick } from 'vue';
import type { CSSProperties } from 'vue';
import type { SkillNode } from '../shared/models/skillNode';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const container = ref<HTMLElement | null>(null);
const svg = ref(null);
const skills = ref<SkillNode[]>([
  { name: 'Vue', strength: 20, years: 3 },
  { name: 'Quasar', strength: 8, years: 2 },
  { name: 'Pinia', strength: 8, years: 2 },
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

onMounted(async () => {
  await nextTick();
  const data: SkillNode[] = skills.value.map((d) => ({
    ...d,
    x: Math.random() * 300,
    y: Math.random() * 300,
  }));

  const width = container.value?.clientWidth || 800;
  const height = container.value?.clientHeight || 600;

  const svgEl = d3.select(svg.value).attr('viewBox', [0, 0, width, height]);

  const center = { x: width / 2, y: height / 2 };

  const simulation = d3
    .forceSimulation<SkillNode>()
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(center.x, center.y))
    .force(
      'collision',
      d3.forceCollide<SkillNode>().radius((d) => d.strength * 4 + 10),
    );

  simulation.nodes(data).on('tick', ticked);

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
    .attr('r', (d) => d.strength * 4)
    .attr('fill', () => generateRandomColor());

  nodeGroup
    .append('text')
    .text((d) => d.name)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('fill', 'white')
    .attr('font-size', '10px')
    .attr('pointer-events', 'none');

  function ticked() {
    nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }
});

// const categoryColor = (cat: SkillCatagory) => {
//   const colors = {
//     Frontend: '#00bcd4',
//     Backend: '#4caf50',
//     Tools: '#ff9800',
//     'Data Viz': '#e91e63',
//     Other: '#9c27b0',
//   };
//   return colors[cat] || '#ccc';
// };

const generateRandomColor = () => chroma.random().hex();
</script>

<template>
  <div ref="container" class="relative w-full" style="height: 80vh">
    <!-- D3 SVG canvas -->
    <svg ref="svg" class="absolute top-0 left-0 w-full h-full"></svg>

    <!-- Custom Tooltip -->
    <div
      v-if="tooltip.visible && tooltip.data"
      :style="tooltipStyle"
      class="bg-primary text-white shadow-2 rounded q-pa-sm z-50"
    >
      <div>Years: {{ tooltip.data.years }}</div>
    </div>
  </div>
</template>
