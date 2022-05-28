import { Application } from "express";
import general from "./general";
import admin from "./admin";
import portfolio from "./portfolio";
import blog from "./blog";
import home from "./home";
import team from "./team"
import career from "./career"
import jwt from "express-jwt";
import { jwtSecret } from "../../../config";
import category from "./category";
import testimonial from "./testimonial";
import faq from "./faq"
import service from "./services";
import termAndCondition from "./termAndCondition"
import privacyPolicy from "./privacyPolicy"
import homePortfolio from "./homePortfolio"
import allTechnology from "./allTechnology"
import servicesDetails from "./servicesDetails"
import supportedTechnology from "./supportedTechnology"
import ourClient from "./ourClient"
import ourCustomer from "./ourCustomer"

export const setup = (app: Application) => {
  app.use(
    "/api/v1",
    jwt({ algorithms: ["HS256"], secret: jwtSecret }).unless({
      path: [
        "/api/v1/admin/auth/checkLogin",
        "/api/v1/admin/setPassword",
        "/api/v1/admin/auth/login",
        "/api/v1/category/add-category",
        "/api/v1/category/delete-category",
        "/api/v1/category/getallcategorybyadmin",
        "/api/v1/category/categoryDropDown",
        "/api/v1/blog/get-blogs-by-user",
        "/api/v1/testimonial/get-testimonial-by-user",
        /^\/api\/v1\/category\/edit-category\/*/,
        /^\/api\/v1\/category\/categoryDropDownByParent\/*/,
        /^\/api\/v1\/category\/categoryDropDownById\/*/,
        /^\/api\/v1\/portfolio\/get-company-portfolio-by-user\/*/,
        /^\/api\/v1\/team\/get-team-by-user\/*/,
        /^\/api\/v1\/career\/get-career-requirement-by-user\/*/,
        /^\/api\/v1\/career\/add-career-request\/*/,
        /^\/api\/v1\/general\/add-contect-us\/*/,
        /^\/api\/v1\/service\/getAllServiceById\/*/,
        /^\/api\/v1\/service\/getAllServiceBySubId\/*/,
        /^\/api\/v1\/service\/getAllServicesByName\/*/,
        "/api/v1/home/get-allHome-section",
        "/api/v1/general/get-menu-setting",
        "/api/v1/general/get-career-setting",
        "/api/v1/home/get-footer-section",
        "/api/v1/faq/get-noAuth-faq",
        "/api/v1/term/get-noAuth-term-and-condition",
        "/api/v1/policy/get-noAuth-privacy-policy",
        "/api/v1/general/file-and-image-upload",
        "/api/v1/tech/getTechnologyByType",
        "/api/v1/servicesDetails/get-noAuth-services-details",
        "/api/v1/technology/get-noAuth-supported-technology",
        "/api/v1/customer/get-noAuth-ourCustomer-section",
      ],
    })
  );
  app.use("/api/v1/general", general);
  app.use("/api/v1/admin", admin);
  app.use("/api/v1/portfolio", portfolio);
  app.use("/api/v1/blog", blog);
  app.use("/api/v1/category", category);
  app.use("/api/v1/home", home);
  app.use("/api/v1/team", team);
  app.use("/api/v1/career", career);
  app.use("/api/v1/testimonial", testimonial);
  app.use("/api/v1/faq", faq);
  app.use("/api/v1/service", service);
  app.use("/api/v1/term", termAndCondition);
  app.use("/api/v1/policy", privacyPolicy);
  app.use("/api/v1/homePortfolio", homePortfolio);
  app.use("/api/v1/tech", allTechnology);
  app.use("/api/v1/servicesDetails/", servicesDetails);
  app.use("/api/v1/technology/", supportedTechnology);
  app.use("/api/v1/client/", ourClient);
  app.use("/api/v1/customer/", ourCustomer);
};
