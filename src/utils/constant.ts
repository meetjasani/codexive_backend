export type Role = "SEO" | "ADMIN";

enum RoleType {
  admin = "ADMIN",
  seo = "SEO"
}

enum TechType {
  category = "Category",
  service = "Services"
}

enum CategoryType {
  technologie = "TECHNOLOGIE",
  digital = "DIGITAL",
  enterprise_development = "Enterprise Development",
  mobile_development = "Mobile Development",
  web_development = "Web Development",
  microsoft = "Microsoft",
  design = "Design",
}

enum MemberType {
  CEO = "CEO",
  DEVELOPER = "DEVELOPER"
}

export {
  RoleType,
  CategoryType,
  MemberType,
  TechType
};
