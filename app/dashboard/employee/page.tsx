'use client';
import { useState, useEffect } from "react";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { fakeUsers } from "@/constants/mock-api";

export default function DemoPage() {
  const [data, setData] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20; // Number of users per page

  useEffect(() => {
    async function fetchData() {
      const users = await getData(page, limit);
      setData(users);
    }
    fetchData();
  }, [page]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Employee {data.length}</h1>
        <span className="text-sm md:text-base lg:text-lg font-normal">
          <p>Manage employees (Server side table functionalities.)</p>
          <div className="border-b-2 border-zinc mt-4 w-full"></div>
        </span>
      </div>
     
        <div className="container mx-auto py-2">
          <DataTable columns={columns} data={data} />
        </div>
             

     
    </div>
  );
}

async function getData(page: number, limit: number): Promise<Payment[]> {
  const data = await fakeUsers.getUsers({ page, limit });
  const payment: Payment[] = data.users;
  return payment;
}
