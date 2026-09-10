import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Load Stripe using publishable key from .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// ---------- Stripe Payment Form Component ----------
const StripePaymentForm = ({ amount, categoryId, categoryName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post("https://usmlebackend.backendamaze.com/stripe/create-payment-intent", {
          amount,
          categoryId,
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        toast.error("Failed to initialize payment. Please try again.");
        console.error("Stripe createPaymentIntent Error:", err);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: categoryName },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const userId = JSON.parse(sessionStorage.getItem("userData"))?.id;
        await axios.post("https://usmlebackend.backendamaze.com/stripe/capture", {
          paymentIntentId: paymentIntent.id,
          userId,
          categoryId,
          amount,
          paymentMethod: "debit",
        });
        window.location.href = "/";
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
      console.error("Stripe handleSubmit Error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </div>
      <button type="submit" disabled={!stripe || processing} className="payment-button">
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

// ---------- PayPal Payment Button Component ----------
const PaypalPaymentButton = ({ amount, categoryId }) => {
  const userId = JSON.parse(sessionStorage.getItem("userData"))?.id;

  // Create order using backend endpoint
  const createOrder = async () => {
    try {
      const response = await axios.post("https://usmlebackend.backendamaze.com/paypal/create-order", {
        amount,
        currency: "USD",
        categoryId,
      });
      return response.data.orderID;
    } catch (err) {
      toast.error("Failed to create PayPal order.");
      console.error("PayPal createOrder Error:", err);
      return null;
    }
  };

  // Capture order after approval
  const onApprove = async (data, actions) => {
    try {
      await axios.post("https://usmlebackend.backendamaze.com/paypal/capture", {
        orderId: data.orderID,
        userId,
        categoryId,
        amount,
        paymentMethod: "paypal",
      });
      window.location.href = "/";
    } catch (err) {
      toast.error("Payment capture failed. Please try again.");
      console.error("PayPal onApprove Error:", err);
    }
  };

  return (
    <div>
      <PayPalButtons
        createOrder={(data, actions) => createOrder()}
        onApprove={(data, actions) => onApprove(data, actions)}
        onError={(err) => {
          toast.error("PayPal payment failed. Please try again.");
          console.error("PayPal onError:", err);
        }}
      />
    </div>
  );
};

// ---------- Payment Method Selector Component ----------
const PaymentMethodSelector = ({ amount, categoryId, categoryName }) => {
  // Dropdown with two options: Debit/Credit Card & PayPal
  const [paymentMethod, setPaymentMethod] = useState("debit");

  return (
    <div>
      <label htmlFor="paymentMethod" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        Payment Method:
      </label>
      <select
        id="paymentMethod"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "300px",
          backgroundColor: "#fff",
          fontSize: "16px"
        }}
      >
        <option value="debit">Debit/Credit Card</option>
        <option value="paypal">PayPal</option>
      </select>

      {paymentMethod === "debit" && (
        <Elements stripe={stripePromise}>
          <StripePaymentForm amount={amount} categoryId={categoryId} categoryName={categoryName} />
        </Elements>
      )}

      {paymentMethod === "paypal" && (
        <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID, currency: "USD" }}>
          <PaypalPaymentButton amount={amount} categoryId={categoryId} />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

// ---------- Main Buy Component ----------
const Buy = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`https://usmlebackend.backendamaze.com/category/course/${categoryId}`);
        setCategory(response.data.category);
      } catch (err) {
        toast.error("Error fetching category.");
        console.error("Error fetching category:", err);
      }
    };
    fetchCategory();
  }, [categoryId]);

  if (!category) return <div>Loading...</div>;

  return (
    <div className="buy-container" style={{ marginTop: "100px" }}>
      <h1>Purchase Course Access</h1>
      <div className="category-details">
        <h2>{category.CategoryCourse}</h2>
        <p>Price: ${category.CategoryCoursePrice}</p>
      </div>
      <PaymentMethodSelector amount={category.CategoryCoursePrice} categoryId={category._id} categoryName={category.CategoryCourse} />
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default Buy;
