import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import AuthContext from "../../context/AuthContext";
import Navbar from "../../components/Shop/Navbar";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

export default function StripePayment() {
  const [clientSecret, setClientSecret] = useState("");
  const ctx = useContext(AuthContext);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`${import.meta.env.VITE_API_BACKEND_URL}/payment/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.token,
      },
      body: JSON.stringify({
        addressId: "65c0a01e41933e921953c571",
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      <Navbar />
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
