<div align="center">

# 📚 BookVerse

### Your next great read is just a click away.

A clean, responsive bookstore storefront demo built with **HTML, CSS, and vanilla JavaScript**. Explore books, save favourites, manage your cart, and try a demo checkout — all directly in your browser.

![HTML5](https://img.shields.io/badge/HTML5-Structure-e34f26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styling-1572b6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Interactions-f7df1e?logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Design-Responsive-6c63ff)
![Backend](https://img.shields.io/badge/Backend-Not%20required-2ea44f)

</div>

---

## ✨ Features

- 🔎 **Find books quickly** — search the catalogue and filter by category.
- ↕️ **Sort the catalogue** — organise books using the available sorting options.
- ❤️ **Save favourites** — keep a list of books you want to revisit.
- 🛒 **Interactive shopping cart** — add or remove books, adjust quantities, and view the subtotal.
- 🚚 **Shipping hint** — see the free-shipping progress message in the cart.
- 💾 **Browser persistence** — cart, saved books, and supported demo details persist with `localStorage`.
- 🧾 **Demo checkout** — validate the form, generate a demo order number, save order history locally, and clear the cart.
- 👤 **Optional saved profile** — save demo customer details in the current browser for a future checkout.
- ✉️ **Newsletter demo** — save an email locally; no email is actually sent.
- 🗂️ **Local data manager** — review stored demo data, export it as JSON, or clear the app's saved data.
- 📱 **Responsive interface** — designed to adapt to desktop and smaller screens.

## 🖥️ Built With

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure and content |
| CSS3 | Layout, visual styling, and responsive behaviour |
| Vanilla JavaScript | Search, filters, cart, saved books, checkout, and local storage |
| Browser `localStorage` | Persistence for demo data on the current browser profile |

## 🚀 Run Locally

**No build tools or package installation are required.**

1. Download or clone this repository.
2. Open the project folder in **Visual Studio Code**.
3. Open `index.html` directly, or use the **Live Server** extension for a smoother development workflow.
4. Keep `index.html`, `style.css`, and `script.js` together in the same folder.

## 📁 Project Structure

```text
BookVerse/
├── index.html   # Storefront markup and dialogs
├── style.css    # Responsive styling
├── script.js    # UI interactions and local demo logic
├── README.md    # Project overview and setup guide
└── README.txt   # Additional usage and privacy notes
```

## 🧪 Try the Demo

1. Search for a book or choose a category.
2. Save a favourite and add a book to the cart.
3. Change quantities and check the subtotal.
4. Open checkout and submit **test details only** to create a local demo order.
5. Use **View / clear local data** to inspect, export, or remove the stored demo data.

## 🔐 Data, Privacy & Limitations

BookVerse is a **front-end demonstration**, not a production e-commerce service.

- Demo data is stored in the current browser's `localStorage`; it does not sync across devices.
- `localStorage` is **not encrypted**. Use fake/test details and avoid sensitive information.
- The checkout does **not** process payments, send orders to a server, or arrange delivery.
- Newsletter signup does **not** send an email.
- Book details, prices, and ratings are sample content.
- Clearing browser data may remove saved demo information.

## 💡 Possible Next Steps

- Connect a backend and database for real catalogue and account data.
- Add authentication and server-side order management.
- Integrate a trusted payment provider for a production-ready checkout.
- Add product detail pages, reviews, and admin tools.

## 📄 License

No license has been specified yet. Add a `LICENSE` file before distributing the project for reuse.

---

<div align="center">

**Made for learning and experimenting with front-end development.**

</div>
