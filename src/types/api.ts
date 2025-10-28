export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface PostCreate {
  title: string;
  body: string;
}

export type Endpoint = string | (() => string);