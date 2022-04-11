import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { gql } from "apollo-boost";

import Cart from "../../components/Cart";
import AppContext from "../../context/AppContext";

import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "reactstrap";

import withApollo from "../../lib/apollo";
import { NextPage } from "next";
import { IDish, IRestaurantDetails } from "../../typings";
import { useContext } from "react";

const GET_RESTAURANT_DISHES = gql`
  query($id: ID!) {
    restaurant(id: $id) {
        data {
            id
            attributes {
                name
                dishes {
                    data {
                        id
                        attributes {
                            name
                            description
                            price
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
        }
      }
    }
}`;

const RestaurantPage: NextPage = (props) => {
    const appContext = useContext(AppContext);
    const router = useRouter();
    const { loading, error, data: response } = useQuery(GET_RESTAURANT_DISHES, {
        variables: { id: router.query.id },
    });

    if (error)
        return "Error Loading Dishes";
    if (loading)
        return <h1>Loading ...</h1>;

    if (!response)
        return;

    const restaurant = (response as IRestaurantDetails).restaurant.data;
    const { name, dishes } = restaurant.attributes;

    const getDishImage = (dish: IDish) => {
        const { image } = dish.attributes;
        const { url } = image.data.attributes;
        return url;
    }

    const addDish = (dish: IDish) => {
        let item: ICartItem = {
            id: dish.id,
            name: dish.attributes.name,
            price: dish.attributes.price
        };

        appContext.addItem(item);
    }

    return (
        <>
            <h1>{name}</h1>
            <Row>
                {dishes.data.map((dish) => (
                    <Col xs="6" sm="4" style={{ padding: 0 }} key={dish.id}>
                        <Card style={{ margin: "0 10px" }}>
                            <CardImg
                                top={true}
                                style={{ height: 250 }}
                                src={`${process.env.NEXT_PUBLIC_API_URL}${getDishImage(dish)}`}
                            />
                            <CardBody>
                                <CardTitle>{dish.attributes.name}</CardTitle>
                                <CardText>{dish.attributes.description}</CardText>
                                <span>Price: {dish.attributes.price}</span>
                            </CardBody>
                            <div className="card-footer">
                                <Button
                                    outline
                                    color="primary"
                                    onClick={() => addDish(dish)}
                                >
                                    + Add To Cart
                                </Button>

                                <style jsx>
                                    {style}
                                </style>
                            </div>
                        </Card>
                    </Col>
                ))}
                <Col xs="3" style={{ padding: 0 }}>
                    <div>
                        <Cart />
                    </div>
                </Col>
            </Row>
        </>
    );
    return <h1>Add Dishes</h1>;
}

const style = `
a {
  color: white;
}
a:link {
  text-decoration: none;
  color: white;
}
.container-fluid {
  margin-bottom: 30px;
}
.btn-outline-primary {
  color: #007bff !important;
}
a:hover {
  color: white !important;
}`;

export default withApollo({ ssr: true })(RestaurantPage);