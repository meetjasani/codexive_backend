import { createConnection } from "typeorm";
import { getRepository } from "typeorm";
import { User } from "../api/entity";
import { development, production } from "../database/config";
import { RoleType } from "../utils/constant";

let environment;

switch (process.env.NODE_ENV) {
  case "development":
    environment = development;
    break;
  case "production":
    environment = production;
  default:
    break;
}

createConnection(environment).then(async () => {
  const user = await getRepository("user").findOne({
    email: 'admin@gmail.com', is_deleted: false
  });

  if (user) {
    console.log("admin already available");
    return;
  }
  getRepository("user")
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        last_name: "admin",
        first_name: "admin",
        email: "admin@gmail.com",
        is_login_first: false,
        role_type: RoleType.admin
      },
    ])
    .execute()
    .then(() => console.log("1 admin added successfully"))
    .catch((err) => console.log(err));
});
