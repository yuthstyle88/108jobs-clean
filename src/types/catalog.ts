type ServiceCatalogData = {
  serviceCatalogs: ServiceCatalog[];
};

type ServiceCatalog = {
  id: string;
  name: string;
  image: string;
  sections: Section[];
  slug: string
};

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

export type {ServiceCatalogData, ServiceCatalog, Section, Category};
  