# SALCart end-to-end checkout

- Open the SALCart login page - ttaCart - https://app.shinuailabs.com/playwright/ttacart
- Log in as standard_user with the password tta_secret
- Go to the products inventory page
- Add the "Test.allTheThings() T-Shirt (Red)" to the cart
- Open the cart and verify it contains exactly 1 item
- Click Checkout
- Fill the checkout details: first name Shinoj,
  last name Narayan, postal code 560001
- Continue to the order overview, then click Finish
- Verify the page shows "Thank you for your order!"