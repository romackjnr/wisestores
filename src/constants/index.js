const base = import.meta.env.BASE_URL;

const products = [
  {
    id: "matcha",
    name: "Matcha",
    image: "matcha.png",
    description: "Earthy matcha flavor with a smooth, creamy finish.",
    color: "black",
    accent: "#79a638",
    rotation: "md:rotate-[-8deg] rotate-0",
  },
  {
    id: "milk",
    name: "Milk",
    image: "milk.png",
    description: "A classic, mellow milk flavor with a soft and creamy finish.",
    color: "white",
    accent: "#d8c8a9",
    rotation: "md:rotate-[8deg] rotate-0",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    image: "chocolate.png",
    description: "Rich chocolate flavor with a smooth, satisfying finish.",
    color: "brown",
    accent: "#80503b",
    rotation: "md:rotate-[-8deg] rotate-0",
  },
  {
    id: "vanilla",
    name: "Vanilla",
    image: "vanila.png",
    description: "Creamy vanilla notes with a soft, balanced finish.",
    color: "white",
    accent: "#eadf9d",
    rotation: "md:rotate-[8deg] rotate-0",
  },
  {
    id: "banana",
    name: "Banana",
    image: "banana.png",
    description: "Sweet banana flavor with a creamy, familiar finish.",
    color: "orange",
    accent: "#efd25a",
    rotation: "md:rotate-[-8deg] rotate-0",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    image: "strawberry.png",
    description: "Bright strawberry flavor with a smooth, creamy finish.",
    color: "red",
    accent: "#ed3d49",
    rotation: "md:rotate-[8deg] rotate-0",
  },
  {
    id: "lemon",
    name: "Lemon",
    image: "lemon.png",
    description: "Zesty lemon flavor with a crisp, refreshing finish.",
    color: "orange",
    accent: "#f1da38",
    rotation: "md:rotate-[-8deg] rotate-0",
  },
];

const nutrientLists = [
  { label: "Potassium", amount: "245mg" },
  { label: "Calcium", amount: "500mg" },
  { label: "Vitamin A", amount: "176mcg" },
  { label: "Vitamin D", amount: "5mcg" },
  { label: "Iron", amount: "1mg" },
];

const cards = [
  {
    src: `${base}videos/f1.mp4`,
    rotation: "rotate-z-[-10deg]",
    name: "Madison",
    img: `${base}images/p1.png`,
    translation: "translate-y-[-5%]",
  },
  {
    src: `${base}videos/f2.mp4`,
    rotation: "rotate-z-[4deg]",
    name: "Alexander",
    img: `${base}images/p2.png`,
  },
  {
    src: `${base}videos/f3.mp4`,
    rotation: "rotate-z-[-4deg]",
    name: "Andrew",
    img: `${base}images/p3.png`,
    translation: "translate-y-[-5%]",
  },
  {
    src: `${base}videos/f4.mp4`,
    rotation: "rotate-z-[4deg]",
    name: "Bryan",
    img: `${base}images/p4.png`,
    translation: "translate-y-[5%]",
  },
  {
    src: `${base}videos/f5.mp4`,
    rotation: "rotate-z-[-10deg]",
    name: "Chris",
    img: `${base}images/p5.png`,
  },
  {
    src: `${base}videos/f6.mp4`,
    rotation: "rotate-z-[4deg]",
    name: "Devante",
    img: `${base}images/p6.png`,
    translation: "translate-y-[5%]",
  },
  {
    src: `${base}videos/f7.mp4`,
    rotation: "rotate-z-[-3deg]",
    name: "Melisa",
    img: `${base}images/p7.png`,
    translation: "translate-y-[10%]",
  },
];

export { products, nutrientLists, cards };
