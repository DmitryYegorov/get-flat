'use client';

import { useLayoutEffect, useState } from "react";
import { http } from './http';
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import RealtyCard from "./components/realties/RealtyCard";

function Home() {

  const [realties, setRealties] = useState([]);
  const isEmpty = realties.length === 0;

  useLayoutEffect(() => {
    http.get('/realty')
      .then((res) => {
        const data = res.data;

        setRealties(data.list);
      });
  }, []);

  if (isEmpty) {
    return (
      <ClientOnly>
        <EmptyState showReset/>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div
          className="
            pt-24
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
          "
        >
          {realties.map((realty: any) => (
            <RealtyCard
              key={realty.id}
              data={realty}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}

export default Home;