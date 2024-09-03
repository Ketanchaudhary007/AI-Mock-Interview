/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://questions_owner:ThF1sgQycCr0@ep-super-sea-a5pyyrv6.us-east-2.aws.neon.tech/questions?sslmode=require' ,
    }
  };
  