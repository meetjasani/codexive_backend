const swaggerUi = require('swagger-ui-express');
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'CODEXIVE',
      version: '1.0.0'
    },
    basePath: '/api/v1',
    schemes: [
      "http",
      "https"
    ],
    tags: [
      {
        name: "General",
        description: "Operations in General"
      },
      {
        name: "Admin",
        description: "Operations about Admin"
      },
      {
        name: "Portfolio",
        description: "Operations about Portfolio"
      },
      {
        name: "Blog",
        description: "Operations about Blog"
      },
      {
        name: "Category",
        description: "Operations about Category"
      },
      {
        name: "Home",
        description: "Operations about Home Page"
      },
      {
        name: "Team",
        description: "Operations about Team"
      },
      {
        name: "CareerRequirement",
        description: "Operations about Team"
      }, {
        name: "Testimonial",
        description: "Operations about Testimonial"
      },
      {
        name: "OurClient",
        description: "Operations about Client"
      },
      {
        name: "Technology",
        description: "Operations about All Technology"
      },
      {
        name: "Services",
        description: "Operations about All Services"
      },
      {
        name: "Faq",
        description: "Operations in Faq"
      },
      {
        name: "PrivacyPolicy",
        description: "Operations in Privacy Policy"
      },
      {
        name: "ServicesDetails",
        description: "Operations in Services Details"
      },
      {
        name: "SupportedTechnology",
        description: "Operations in Supported Technology"
      },
      {
        name: "TermAndCondition",
        description: "Operations in Term And Condition"
      },
      {
        name: "OurCustomer",
        description: "Operations in Our Customer Section"
      },
    ],
    securityDefinitions: {
      Token: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      }
    }
  },
  apis: [
    './src/api/routes/general.ts',
    './src/api/routes/admin.ts',
    './src/api/routes/portfolio.ts',
    './src/api/routes/blog.ts',
    './src/api/routes/category.ts',
    './src/api/routes/home.ts',
    './src/api/routes/team.ts',
    './src/api/routes/career.ts',
    './src/api/routes/testimonial.ts',
    './src/api/routes/ourClient.ts',
    './src/api/routes/allTechnology.ts',
    './src/api/routes/services.ts',
    './src/api/routes/faq.ts',
    './src/api/routes/privacyPolicy.ts',
    './src/api/routes/servicesDetails.ts',
    './src/api/routes/supportedTechnology.ts',
    './src/api/routes/termAndCondition.ts',
    './src/api/routes/ourCustomer.ts',

  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setSwagger = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
};
