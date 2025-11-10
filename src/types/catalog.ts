type Section = {
    sectionTitle: string;
    categories: Category[];
};

type Category = {
    id: string;
    name: string;
    image: string | null;
    slug: string;
};

export type {Section, Category};
  