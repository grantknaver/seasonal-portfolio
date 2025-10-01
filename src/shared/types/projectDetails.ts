import { type Projects } from '../constants/projects';

export interface ProjectDetails {
  name: Projects;
  id: string;
  url?: string;
  src: string;
  alt: Projects;
}
