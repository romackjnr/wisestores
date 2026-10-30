const base = import.meta.env.BASE_URL;

const getProductImageUrl = (image) =>
  /^https?:\/\//i.test(image) ? image : `${base}images/${image}`;

const products = [
  {
    id: "matcha",
    name: "Matcha",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372540/matcha.png",
    description: "Earthy matcha flavor with a smooth, creamy finish.",
    color: "black",
    accent: "#79a638",
    rotation: "md:rotate-[-8deg] rotate-0",
  },
  {
    id: "milk",
    name: "Milk",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372537/milk.png",
    description: "A classic, mellow milk flavor with a soft and creamy finish.",
    color: "white",
    accent: "#d8c8a9",
    rotation: "md:rotate-[8deg] rotate-0",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372091/chocolate.png",
    description: "Rich chocolate flavor with a smooth, satisfying finish.",
    color: "brown",
    accent: "#80503b",
    rotation: "md:rotate-[-8deg] rotate-0",
  },
  {
    id: "vanilla",
    name: "Vanilla",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372542/vanila.png",
    description: "Creamy vanilla notes with a soft, balanced finish.",
    color: "white",
    accent: "#eadf9d",
    rotation: "md:rotate-[8deg] rotate-0",
  },
  {
    id: "banana",
    name: "Banana",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372538/banana.png",
    description: "Sweet banana flavor with a creamy, familiar finish.",
    color: "orange",
    accent: "#efd25a",
    rotation: "md:rotate-[-8deg] rotate-0",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372541/strawberry.png",
    description: "Bright strawberry flavor with a smooth, creamy finish.",
    color: "red",
    accent: "#ed3d49",
    rotation: "md:rotate-[8deg] rotate-0",
  },
  {
    id: "lemon",
    name: "Lemon",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372537/lemon.png",
    description: "Zesty lemon flavor with a crisp, refreshing finish.",
    color: "orange",
    accent: "#f1da38",
    rotation: "md:rotate-[-8deg] rotate-0",
  },
];

const heroProducts = [
  {
    id: "creatine-monohydrate",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372537/monohydrate.png",
    title: "creatine",
    name: "CREATINE MONOHYDRATE",
    description:
      "Micronized creatine monohydrate, unflavored. 5g per serving, 100 servings in a 500g container. Quality guaranteed and third-party tested.",
    bg: "#3b1406",
  },
  {
    id: "creatine-powder",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372541/supp.png",
    title: "SUPPS",
    name: "CREATINE POWDER",
    description:
      "100% pure creatine monohydrate for muscle building support. 5g per serving, 60 servings in a 300g tub. Unflavored and banned substance tested.",
    bg: "#277936",
  },
  {
    id: "creatine-for-women",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372537/boost.png",
    title: "BOOST",
    name: "FOR THE WOMEN",
    description:
      "Muscle support for women. Every serving blends 5g creatine with 2.5g collagen peptides, 1g BCAA and 1g L-glutamine. Unflavored, 30 servings.",
    bg: "#530b2e",
  },
  {
    id: "serious-mass",
    image: "https://res.cloudinary.com/msz67c6u/image/upload/v1793372538/mass.png",
    title: "mass",
    name: "SERIOUS MASS",
    description:
      "Chocolate protein powder drink mix with 50g protein and 1,260 calories per serving. Regularly tested for banned substances. 5lb tub.",
    bg: "#173453",
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

export { products, heroProducts, nutrientLists, cards, getProductImageUrl };
