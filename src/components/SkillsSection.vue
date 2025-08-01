<script lang="ts" setup>
import { ref, onMounted, reactive, computed, nextTick } from 'vue';
import type { CSSProperties } from 'vue';
import type { SkillNode } from '../shared/models/skillNode';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const container = ref<HTMLElement | null>(null);
const svg = ref(null);
const generateRandomColor = () => chroma.random().hex();
const skills = ref<SkillNode[]>([
  { name: 'Angular', strength: 15, years: 3, fillColor: generateRandomColor() },
  { name: 'Vue', strength: 13, years: 3, fillColor: generateRandomColor() },
  { name: 'Quasar', strength: 10, years: 2, fillColor: generateRandomColor() },
  { name: 'Pinia', strength: 13, years: 2, fillColor: generateRandomColor() },
  { name: 'JavaScript', strength: 12, years: 7, fillColor: generateRandomColor() },
  { name: 'TypeScript', strength: 15, years: 2, fillColor: generateRandomColor() },
  { name: 'D3.js', strength: 9, years: 3, fillColor: generateRandomColor() },
  { name: 'Highcharts', strength: 7, years: 2, fillColor: generateRandomColor() },
  { name: 'Chart.js', strength: 6, years: 1, fillColor: generateRandomColor() },
  { name: 'Firebase', strength: 2, years: 3, fillColor: generateRandomColor() },
  { name: 'MongoDB', strength: 5, years: 2, fillColor: generateRandomColor() },
  { name: 'Node.js', strength: 6, years: 2, fillColor: generateRandomColor() },
  { name: 'HTML/CSS', strength: 9, years: 7, fillColor: generateRandomColor() },
  { name: 'NgRx', strength: 5, years: 1, fillColor: generateRandomColor() },
  { name: 'Adobe ', strength: 8, years: 6, fillColor: generateRandomColor() },
  { name: 'Figma', strength: 6, years: 1, fillColor: generateRandomColor() },
  { name: 'Git', strength: 8, years: 6, fillColor: generateRandomColor() },
  { name: 'WordPress', strength: 7, years: 3, fillColor: generateRandomColor() },
  { name: 'SEO', strength: 7, years: 3, fillColor: generateRandomColor() },
  { name: 'Sales Marketing', strength: 9, years: 7, fillColor: generateRandomColor() },
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
    x: Math.random() * 0.01,
    y: Math.random() * 10,
  }));
  console.log('data', data);
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
    .attr('fill', (d) => d.fillColor);

  nodeGroup
    .append('text')
    .text((d) => d.name)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('fill', 'white')
    .attr('font-size', '10px')
    .attr('pointer-events', 'none');

  function ticked() {
    nodeGroup.each((d: SkillNode) => {
      const r = d.strength * 4;

      // Clamp x
      d.x = Math.max(r, Math.min(width - r, d.x ?? 0));
      // Clamp y
      d.y = Math.max(r, Math.min(height - r, d.y ?? 0));
    });

    nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }
});
</script>

<template>
  <div ref="container" class="relative w-full" style="height: 80vh">
    <!-- D3 SVG canvas -->
    <svg ref="svg" class="absolute top-0 left-0 w-full h-full"></svg>

    <!-- Custom Tooltip -->
    <div
      v-if="tooltip.visible && tooltip.data"
      :style="tooltipStyle"
      class="bg-dark text-white shadow-2 rounded q-pa-sm z-50"
    >
      <div>Years: {{ tooltip.data.years }}</div>
    </div>
  </div>
</template>
