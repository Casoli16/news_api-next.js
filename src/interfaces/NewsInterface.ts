//Define the data structures expected to be received from the api.
export interface SourceInterface {
    id: string | null;
    name: string;
}

export interface NewsInterface {
    source: SourceInterface;
      author: string | null;
      title: string;
      description: string | null;
      url: string;
      urlToImage: string | null;
      publishedAt: string;
      content: string | null;
}
