import { type SimulationNodeDatum } from 'd3';

export interface SkillNode extends SimulationNodeDatum {
  name: string;
  strength: number;
  years: number;
  fillColor: string;
}
