'use client';

import { useLayoutEffect, useState } from "react";
import { http } from './http';
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import RealtyCard from "./components/realties/RealtyCard";
import { getCurrentUser } from "./http/auth";

function Home() {

  const [realties, setRealties] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const isEmpty = realties.length === 0;

  useLayoutEffect(() => {

    if (!currentUser) {
      getCurrentUser()
        .then(res => {
          console.log(res.data);
          setCurrentUser(res.data?.payload?.user);
        })
    }

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
              currentUser={currentUser}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}

export default Home;