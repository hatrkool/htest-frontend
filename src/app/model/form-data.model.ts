export interface SectorItem {
  nodeValue: string;
  nodeName: string;
  nodePath: string;
}
export interface SectorData {
  sectorList: SectorItem[];
}
export interface FormData {
  name: string;
  sectorSelection: string[];
  agreeToTerms: boolean;
  sessionId: number;
}
