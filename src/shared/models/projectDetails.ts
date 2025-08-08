import { type Project } from '../constants/projects';

export interface ProjectDetails {
  name: Project;
  id: string;
  url?: string;
  src: string;
  alt: Project;
}
