export interface AddonFileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  content?: string;
  children?: AddonFileNode[];
}

export interface BoneDefinition {
  name: string;
  parent?: string;
  pivot: [number, number, number];
  cubesCount: number;
  description: string;
}

export interface ParticleInfo {
  id: string;
  name: string;
  layer: string;
  color: string;
  description: string;
}

export interface VerificationTestItem {
  id: number;
  title: string;
  status: 'passed' | 'warning' | 'failed';
  category: 'Rendering' | 'Geometry' | 'Combat' | 'Compatibility' | 'Packaging';
  detail: string;
  proof: string;
}
