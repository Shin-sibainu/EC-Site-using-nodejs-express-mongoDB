const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KET);

router.post("/payments", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "jpy",
    },
    (stripeErr, stripeRes) => {}
  );
});

module.exports = router;
