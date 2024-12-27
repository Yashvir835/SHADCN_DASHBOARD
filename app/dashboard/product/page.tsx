'use client';
import { useState, useEffect } from "react";
import { Product, columns } from "./columns";
import { DataTable } from "./data-table";
import { fakeProducts } from '@/constants/mock-api';

export default function DemoPage() {
  const [data, setData] = useState<Product[]>([]);
  const limit = 20; // Number of products per page

  useEffect(() => {
    async function fetchData() {
      const products = await getData(1, limit);
      setData(products);
    }
    fetchData();
  }, []);

  return (
   <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="text-4xl font-bold">Products {data.length}</h1>
        <span className="text-sm font-normal">
          <p>Manage products (Server side table functionalities.)</p>
          <div className="border-b-2 border-zinc mt-4 w-full"></div>
        </span>
      </div>

      <div className="container  mx-auto py-2">
        <DataTable columns={columns} data={data} />
   
      </div>
    </div>
  );
}

async function getData(page: number, limit: number): Promise<Product[]> {
  const data = await fakeProducts.getProducts({ page, limit });
  const products: Product[] = data.products;
  return products;
}
