// GlowHaven - Data
// Products, Services, and Stylists

const GH_PRODUCTS = [
  { id:"PRD-001", name:"Matte Pomade", category:"Styling", price:119.99, stock:45, reorderLevel:10, description:"Strong hold, matte finish. Perfect for modern cuts and fades.", image:"assets/images/pomade.png" },
  { id:"PRD-002", name:"Beard Oil — Cedar & Sandalwood", category:"Beard Care", price:149.99, stock:32, reorderLevel:8, description:"Premium blend of natural oils to moisturise and soften beard hair.", image:"assets/images/beard-oil.png" },
  { id:"PRD-003", name:"Men's Anti-Dandruff Shampoo", category:"Hair Care", price:99.99, stock:60, reorderLevel:15, description:"Zinc-formula shampoo that clears and prevents dandruff.", image:"assets/images/shampoo.png" },
  { id:"PRD-004", name:"Deep Moisture Conditioner", category:"Hair Care", price:109.99, stock:40, reorderLevel:10, description:"Repairs and hydrates dry, coarse hair. Leaves hair smooth.", image:"assets/images/conditioner.png" },
  { id:"PRD-005", name:"Beard Balm", category:"Beard Care", price:139.99, stock:28, reorderLevel:8, description:"Shapes and tames unruly beards with a light, natural hold.", image:"assets/images/beard-balm.png" },
  { id:"PRD-006", name:"Aftershave Balm", category:"Shaving", price:119.99, stock:35, reorderLevel:10, description:"Soothes and hydrates skin after shaving. Alcohol-free formula.", image:"assets/images/aftershave.png" },
  { id:"PRD-007", name:"Charcoal Face Wash", category:"Skincare", price:89.99, stock:50, reorderLevel:12, description:"Deep-cleansing charcoal formula removes dirt and unclogs pores.", image:"assets/images/face-wash.png" }
];

// Pre-made bundle kits
const GH_BUNDLES = [
  {
    id: "BDL-001",
    name: "The Beard Boss Kit",
    tag: "Great Deal",
    description: "Everything your beard needs in one box. Beard Oil, Beard Balm, and Aftershave Balm — bundled and ready.",
    items: ["PRD-002", "PRD-005", "PRD-006"],
    originalPrice: 400.97,
    bundlePrice: 320.99,
    image: "assets/images/beard-oil.png"
  },
  {
    id: "BDL-002",
    name: "The Hair Care Starter Kit",
    tag: "Popular Bundle",
    description: "Start your hair routine right — Anti-Dandruff Shampoo, Deep Moisture Conditioner, and Matte Pomade.",
    items: ["PRD-001", "PRD-003", "PRD-004"],
    originalPrice: 330.97,
    bundlePrice: 260.99,
    image: "assets/images/shampoo.png"
  }
];

const GH_SERVICES = [
  { id:"SVC-001", name:"Classic Haircut", duration:"30 min", price:80.00, description:"Precision scissor or clipper cut with wash and style finish." },
  { id:"SVC-002", name:"Skin Fade", duration:"45 min", price:60.00, description:"High-precision skin or taper fade crafted by expert hands." },
  { id:"SVC-003", name:"Beard Trim & Shape", duration:"20 min", price:50.00, description:"Full beard grooming — trim, shape, and lineup with beard conditioner." },
  { id:"SVC-004", name:"Hot Towel Shave", duration:"30 min", price:40.00, description:"Traditional straight-razor shave with hot towel treatment and aftershave." },
  { id:"SVC-005", name:"Hair Treatment", duration:"45 min", price:100.00, description:"Deep conditioning or scalp treatment targeted for men's hair health." },
  { id:"SVC-006", name:"Full Groom Package", duration:"90 min", price:200.00, description:"Haircut + Beard Trim + Hot Towel Shave. The complete experience." }
];

const GH_STYLISTS = [
  { id:"STL-001", name:"Marcus A.", specialty:"Skin Fades & Designs", experience:"4 years" },
  { id:"STL-002", name:"David K.", specialty:"Classic Cuts & Beard Styling", experience:"5 years" },
  { id:"STL-003", name:"Kwame O.", specialty:"Hot Towel Shaves & Treatments", experience:"6 years" }
];

const GH_TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","13:00","13:30","14:00","14:30","15:00",
  "15:30","16:00","16:30","17:00","17:30"
];

// Seed products into localStorage (always refresh to pick up changes)
function seedData() {
  localStorage.setItem('products', JSON.stringify(GH_PRODUCTS));
}
seedData();
