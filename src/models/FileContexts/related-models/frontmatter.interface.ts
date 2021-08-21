// tslint:disable-next-line:interface-name
export interface FrontMatter {
  tags: string[];
  systemTags: string[];
  route?: string;
  alternateRoutes?: string[];
  title?: string;
  section?: string;
  dataKey?: string;
  webImport?: string;
  layout?: string;
  minify?: string;
  category?: string;
  sortOrder?: string;
  imgPath?: string;
}

export type FrontMatterReadonly = Readonly<FrontMatter>;
