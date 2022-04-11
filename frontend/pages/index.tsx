import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Button, Alert } from "reactstrap";

import withApollo from "../lib/apollo";
import React, { useState } from "react";

import { Col, Input, InputGroup, InputGroupText, Row } from "reactstrap";
import RestaurantList from "../components/RestaurantList";

const Home: NextPage = () => {
  const [query, updateQuery] = useState("");

  // return (
  //   <div>
  //     <div>
  //       <Alert color="primary">
  //         Hello Project is strapi-next with Bootstrap
  //       </Alert>
  //       &nbsp; <Button color="primary">Hello from nextjs</Button>
  //     </div>
  //   </div>
  // )

  return (
    <div className="container-fluid">
      <Row>
        <Col>
          <div className="search">
            <Row>
              <Col>
                <div className="search">
                  <InputGroup>
                    <InputGroupText>
                      Search
                    </InputGroupText>
                    <Input
                      onChange={e => updateQuery(e.target.value.toLocaleLowerCase())}
                      value={query}
                    />
                  </InputGroup>
                </div>
              </Col>
            </Row>
          </div>
          <RestaurantList search={query} />
        </Col>
      </Row>
      <style jsx>
        {`
          .search {
            margin: 20px;
            width: 500px;
          }
        `}
      </style>
    </div>
  );
}

export default withApollo({ ssr: true })(Home);
