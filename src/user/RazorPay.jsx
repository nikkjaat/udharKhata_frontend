import axios from "axios";
import React, { useContext, useEffect } from "react";
import AuthContext from "../Context/AuthContext";

export default function RazorPay(props) {
  const authCtx = useContext(AuthContext);
  const paymentHandler = async (e) => {
    e.preventDefault();

    try {
      let amount = props.amount * 100; // Amount in subunits (e.g., 5000 paise = 50 INR)
      let currency = "INR";

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/order`,
        {
          amount,
          currency,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response);

      const { id: order_id } = response.data; // Extract order ID from response

      var options = {
        key: "rzp_test_ke9fMSVmlpIZSt", // Enter the Key ID generated from the Dashboard
        amount: amount.toString(), // Amount is in currency subunits
        currency: currency,
        name: "Acme Corp", // your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order_id, // Use the order ID from the backend response
        handler: async function (response) {
          const body = { ...response };

          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/order/validate`,
            {
              body,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (res.status === 200) {
            const res = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/admin/paidamount`,
              {
                amount: props.amount.toString(),
                paidBy: "RazorPay",
                customerId: props.data._id,
                adminId: props.data.userId,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + authCtx.token,
                },
              }
            );
            if (res.status === 200) {
              props.getItems();
              props.getPaidAmount();
            }
          }
        },
        prefill: {
          name: props.shopkeeperName, // your customer's name
          email: "gaurav.kumar@example.com",
          contact: props.number, // Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating the order. Please try again.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <button
        style={{ width: "100%", color: "white", background: "transparent" }}
        onClick={paymentHandler}
        id="rzp-button1"
      >
        Confirm & Pay
      </button>
    </div>
  );
}
