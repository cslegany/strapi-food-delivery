import React from "react";

import { CardElement } from "@stripe/react-stripe-js";
import { ICheckoutInfo } from "../typings";

interface CardSectionProps {
    data: ICheckoutInfo;
    submitOrder: () => void;
    stripeError: string;
}

function CardSection({stripeError, submitOrder}: CardSectionProps) {
    return (
        <div>
            <div>
                <label htmlFor="card-element">Credit or debit card</label>

                <div>
                    <fieldset style={{ border: "none" }}>
                        <div className="form-row">
                            <div id="card-element" style={{ width: "100%" }}>
                                <CardElement
                                    options={{
                                        style: { width: "100%", base: { fontSize: "18px" } },
                                    }}
                                />
                            </div>
                            <br />
                            <div className="order-button-wrapper">
                                <button onClick={submitOrder}>Confirm order</button>
                            </div>
                            {stripeError ? (
                                <div>{stripeError.toString()}</div>
                            ) : null}
                            <div id="card-errors" role="alert" />
                        </div>
                    </fieldset>
                </div>
            </div>
            <style jsx>
                {`
          .order-button-wrapper {
            display: flex;
            width: 100%;
            align-items: flex-end;
            justify-content: flex-end;
          }
        `}
            </style>
        </div>
    );
}
export default CardSection;