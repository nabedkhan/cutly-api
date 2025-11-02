export interface GetLinksParams {
  page: number;
  limit: number;
  skip: number;
  userId?: string;
}

export interface CreateLinkParams {
  title: string;
  userId: string;
  backHalf?: string;
  destinationUrl: string;
}

export interface GetLinksResponse {
  total: number;
  links: ILink[];
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface ILink {
  id: string;
  title: string;
  backHalf: string;
  shortUrl: string;
  destinationUrl: string;
  totalVisits: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILinkService {
  getLinks: (params: GetLinksParams) => Promise<GetLinksResponse>;
  getLink: (id: string, userId?: string) => Promise<ILink>;
  createLink: (params: CreateLinkParams) => Promise<ILink>;
  updateLink: (id: string, params: CreateLinkParams) => Promise<void>;
  deleteLink: (id: string, userId: string) => Promise<void>;
}
