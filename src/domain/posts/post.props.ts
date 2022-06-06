export interface IPostProps {
  id: string;
  body: string;
  headline: string;
  tags: string[];
  postedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
