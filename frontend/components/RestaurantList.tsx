import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import Link from "next/link";

import { Card, CardBody, CardImg, CardText, CardTitle, Row, Col } from "reactstrap";
import { IRestaurant, IRestaurantList } from "../typings";

const QUERY = gql`
  {
    restaurants {
        data {
            id
            attributes {
                name
                description
                image {
                    data {
                        attributes {
                        url
                    }
                }
            }
        }
      }
    }
  }`;

interface RestaurantListPageProps {
    search: string;
}

function RestaurantList({ search }: RestaurantListPageProps) {
    const { loading, error, data: response } = useQuery(QUERY);
    if (error)
        return "Error loading restaurants";

    //if restaurants are returned from the GraphQL query, run the filter query
    //and set equal to variable restaurantSearch
    if (loading)
        return <h1>Fetching</h1>;

    const responseData: IRestaurant[] = (response as IRestaurantList).restaurants.data;

    const getRestaurantImage = (restaurant: IRestaurant) => {
        const { image } = restaurant.attributes;
        const { url } = image.data[0].attributes;
        return url;
    }

    const trimEllip = (item: string, length: number) => item.length > length ? item.substring(0, length) + "..." : item;

    if (responseData && responseData.length > 0) {
        const searchQuery = responseData.filter((query) =>
            query.attributes.name.toLowerCase().includes(search)
        );

        if (searchQuery.length == 0)
            return <h1>No Restaurants Found</h1>;

        return (
            <Row>
                {searchQuery.map((res) => (
                    <Col xs="6" sm="4" key={res.id}>
                        <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
                            <CardImg
                                top={true}
                                style={{ height: 250 }}
                                src={`${process.env.NEXT_PUBLIC_API_URL}${getRestaurantImage(res)}`}
                            />
                            <CardBody>
                                <CardTitle><b>{res.attributes.name}</b></CardTitle>
                                <CardText>{trimEllip(res.attributes.description, 180)}</CardText>
                            </CardBody>
                            <div className="card-footer">
                                <Link
                                    as={`/restaurants/${res.id}`}
                                    href={`/restaurants/${res.id}`}
                                >
                                    <a className="btn btn-primary">View</a>
                                </Link>
                            </div>
                        </Card>
                    </Col>
                ))}

                <style jsx global>
                    {style}
                </style>
            </Row>
        );
    }
    return <h5>Add Restaurants</h5>;
}

const style = `
a {
  color: white;
}
a:link {
  text-decoration: none;
  color: white;
}
a:hover {
  color: white;
}
.card-columns {
  column-count: 3;
}`;

export default RestaurantList;