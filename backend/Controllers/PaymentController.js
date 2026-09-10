const Payment = require('../Models/PaymentModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');

// --------- PayPal Configuration ---------
function paypalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;
  // SandboxEnvironment for testing. For production, use LiveEnvironment.
  let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  return new paypal.core.PayPalHttpClient(environment);
}
// Create PayPal Order endpoint
exports.createPaypalOrder = async (req, res) => {
  const { amount, currency, categoryId } = req.body;
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency || 'USD',
        value: amount.toString()  // Ensure value is string
      }
    }]
  });

  try {
    const response = await paypalClient().execute(request);
    // Return order ID for frontend to proceed with PayPal checkout
    res.status(200).json({ orderID: response.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ error: error.message });
  }
};

// Capture PayPal Payment endpoint
exports.capturePaypalOrder = async (req, res) => {
  const { orderId, userId, categoryId, amount, paymentMethod } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const captureResponse = await paypalClient().execute(request);
    const captureStatus = captureResponse.result.status;
    const paymentStatus = captureStatus === 'COMPLETED' ? 'Completed' : 'Pending';

    const newPayment = new Payment({
      userId,
      categoryId,
      amount,
      paymentMethod,
      transactionId: orderId,
      paymentStatus,
    });
    await newPayment.save();

    res.status(201).json({
      success: true,
      message: 'PayPal payment captured and recorded successfully',
      payment: newPayment,
    });
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error capturing PayPal payment',
    });
  }
};
// Create PaymentIntent endpoint
exports.createPaymentIntent = async (req, res) => {
  const { amount, categoryId } = req.body;
  try {
    // Stripe expects the amount in the smallest currency unit (cents for USD)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert dollars to cents
      currency: 'usd',
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({ error: error.message });
  }
};
// Capture Stripe Payment endpoint 
exports.captureStripePayment = async (req, res) => {
  const { paymentIntentId, userId, categoryId, amount, paymentMethod } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const paymentStatus = paymentIntent.status === 'succeeded' ? 'Completed' : 'Pending';

    // Create a new payment record in your database
    const newPayment = new Payment({
      userId,
      categoryId,
      amount,
      paymentMethod,
      transactionId: paymentIntent.id,
      paymentStatus,
    });
    await newPayment.save();

    res.status(201).json({
      success: true,
      message: 'Stripe payment captured and recorded successfully',
      payment: newPayment,
    });
  } catch (error) {
    console.error('Error capturing Stripe payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error capturing Stripe payment',
    });
  }
};
// User ke payments fetch karne ke liye
exports.getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId }).populate('categoryId');
    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
// Payment status update karne ke liye
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paymentStatus } = req.body;
    
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { paymentStatus },
      { new: true }
    );
    
    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      payment: updatedPayment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Payment delete karne ke liye
exports.deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    
    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
exports.checkCategoryPayment = async (req, res) => {
  try {
    const { userId, categoryId } = req.params;
    
    const payment = await Payment.findOne({
      userId,
      categoryId,
      paymentStatus: 'Completed'
    });

    res.status(200).json({
      success: true,
      hasAccess: !!payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
