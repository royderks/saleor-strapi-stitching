import Head from 'next/head';
import { request, gql } from 'graphql-request';
import { useEffect, useState } from 'react';

const query = gql`
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
`;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});

  useEffect(() => {
    async function fetchData() {
      const result = await request('http://localhost:3000/api/graphql', query);

      if (result) {
        setProduct(result.product);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  console.log({ product });

  return (
    <div className='container'>
      <Head>
        <title>Schema Stitching Saleor + Strapi</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1 className='title'>
          Schema Stitching <a href='https://saleor.io'>Saleor</a> +{' '}
          <a href='https://strapi.io'>Strapi</a>
        </h1>

        <p className='description'>
          You can find the GraphQL endpoint at{' '}
          <a href='http://localhost:3000/api/graphql'>
            <code>http://localhost:3000/api/graphql</code>
          </a>
        </p>
        <div className='product'>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <div className='card'>
              <img src={product.images[0].url} className='from-saleor' width="30%" />
              <div className='content'>
                <h3 className='from-saleor'>{product.name}</h3>
                <p className='from-strapi'>
                  {product.cmsMetaData[0].description}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title {
          color: #0070f3;
          text-decoration: none;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .card {
          margin: 1rem;
          display: flex;
          flex-direction: row;
          justify-content: center;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
        }

        .card .content {
          margin-left: 1rem;
        }

        .card h3 {
          margin: 0 0 2rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .from-strapi {
          border: 1px solid purple;
          position: relative;
        }

        .from-strapi::after {
          background: purple;
          padding: 5px;
          content: "Coming from Strapi";
          position: absolute;
          top: 100%;
          left: 5px;
          color: white;
          font-size: 12px;
          font-weight: normal;
        }

        .from-saleor {
          border: 1px solid #0070f3;
          position: relative;
        }
        
        .from-saleor::after {
          background: #0070f3;
          padding: 5px;
          content: "Coming from Saleor";
          position: absolute;
          top: 100%;
          left: 5px;
          color: white;
          font-size: 12px;
          font-weight: normal;
        }


      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
