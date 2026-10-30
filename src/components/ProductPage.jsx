import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";

const ProductPage = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const imageSrc = `${import.meta.env.BASE_URL}images/${product.image}`;

  useEffect(() => {
    setQuantity(1);
    setCartMessage("");
  }, [product.id]);

  const handleAddToCart = () => {
    let cart = [];

    try {
      const savedCart = JSON.parse(localStorage.getItem("wisemax-cart") || "[]");
      if (Array.isArray(savedCart)) cart = savedCart;
    } catch {
      cart = [];
    }

    const existingItem = cart.find((item) => item.productId === product.id);
    const updatedCart = existingItem
      ? cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cart, { productId: product.id, name: product.name, image: product.image, quantity }];

    localStorage.setItem("wisemax-cart", JSON.stringify(updatedCart));
    setCartMessage(`${quantity} ${product.name} added to cart`);
  };

  useGSAP(() => {
    const titleSplit = SplitText.create(".nutrition-title", {
      type: "chars",
    });
    const paragraphSplit = SplitText.create(".product-description", {
      type: "words, lines",
      linesClass: "paragraph-line",
    });

    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".nutrition-section",
        start: "top center",
      },
    });
    contentTl
      .from(titleSplit.chars, {
        yPercent: 100,
        stagger: 0.02,
        ease: "power2.out",
      })
      .from(paragraphSplit.words, {
        yPercent: 300,
        rotate: 3,
        ease: "power1.inOut",
        duration: 1,
        stagger: 0.01,
      });

    gsap.to(".nutrition-text-scroll", {
      duration: 1,
      opacity: 1,
      clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".nutrition-section",
        start: "top 80%",
      },
    });
  });

  return (
    <>
      <section id="nutrition" className="nutrition-section product-page">
        <img
          src={`${import.meta.env.BASE_URL}images/slider-dip.png`}
          alt=""
          className="w-full object-cover"
        />

        <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl grid-cols-1 items-center gap-6 px-5 pb-36 pt-8 md:min-h-dvh md:grid-cols-2 md:gap-12 md:px-10 md:pb-40 md:pt-0">
          <div className="relative inline-block md:translate-y-10">
            <div className="general-title relative flex flex-col items-center justify-center gap--9">
              <div className="overflow-hidden place-self-start">
                <h1 className="nutrition-title">{product.name}</h1>
              </div>
              <div
                style={{
                  clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
                }}
                className="nutrition-text-scroll place-self-start"
              >
                <div className="bg-yellow-brown px-3 pb-5 pt-3 md:px-5 md:pt-0">
                  <h2 className="text-milk-yellow">Body Good</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:translate-y-5">
            <img
              src={imageSrc}
              alt={`${product.name} product`}
              className="product-page-image"
            />
            <p className="product-description mt-3 max-w-md text-center font-sans text-xl font-bold leading-relaxed text-dark-brown md:mt-1 md:text-2xl">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      <div className="product-purchase">
        {cartMessage && (
          <p className="product-cart-message" role="status">
            {cartMessage}
          </p>
        )}
        <div className="product-purchase-bar">
          <div className="product-quantity">
            <span className="font-paragraph text-sm font-semibold uppercase">Qty</span>
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              −
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= 99}
              onClick={() => setQuantity((current) => Math.min(99, current + 1))}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="product-purchase-button"
            onClick={handleAddToCart}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductPage;