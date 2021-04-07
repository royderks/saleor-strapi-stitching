# Schema stitching with Saleor and Strapi

The code in this project shows how you can do schema stitching between two headless architectures: [Saleor](https://saleor.io/) and [Strapi](https://strapi.io/).

![Example application](./public/screenshot.png)

## Getting Started

This project consists of both a "client" set up with Next.js and an instance of Strapi, which can be found in `/services/cms`. To use schema stitching you need to run both the Next.js application and the local Strapi instance using:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application, and [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql) to see the GraphQL server with the combined schemas from Saleor and Strapi. Also, the Strapi instance has become available at http://localhost:1337 and the admin at http://localhost:1337/admin.

You can also start the Next.js application and Strapi instance individually with the commands: `npm run dev-nextjs` and `npm run dev-strapi`.

## Example query

With the query below you can get the product information from Saleor, and stitch information from Strapi under the field `cmsMetaData`:

```graphql
query {
  # Query.product from Saleor
  product(id: "UHJvZHVjdDo3Mg==") {
    id
    name
    images {
      url
      alt
    }
    # Query.product from Strapi
    cmsMetaData {
      title
      description
      saleorId
    }
  }
}
```
