const photo = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

// Демонстрационная витрина. Цены, скидки, товары и связи с брендами не являются
// актуальным ассортиментом Boutique 5 и готовы к замене ответом API.
export const products = [
  { id:'coat', slug:'coat', name:'Пальто из шерсти', category:'Пальто', department:'men', categoryPath:'men/outerwear/coats', price:48900, compareAtPrice:62900, discountPercent:22, brand:'Herno', color:'Верблюжий', colors:['Верблюжий','Графитовый'], sizes:['46','48','50','52'], dateAdded:'2026-10-12', image:photo('photo-1539533018447-63fcce2678e3'), desc:'Прямой силуэт и выразительная фактура натуральной шерсти. Тёплая лаконичная модель для многослойных образов.', composition:'80% шерсть, 20% полиамид' },
  { id:'knit', slug:'knit', name:'Джемпер из кашемира', category:'Джемпера', department:'men', categoryPath:'men/knit/sweaters', price:32900, brand:'Svevo', color:'Оливковый', colors:['Оливковый','Молочный'], sizes:['46','48','50','52'], dateAdded:'2026-10-18', image:photo('photo-1618354691373-d851c5c3a990'), desc:'Мягкий кашемир, спокойный оттенок и чистая линия плеча.', composition:'100% кашемир' },
  { id:'shirt', slug:'shirt', name:'Рубашка из хлопка', category:'Сорочки', department:'men', categoryPath:'men/formal-shirts', price:18900, brand:'BARBA NAPOLI', color:'Молочный', colors:['Молочный','Голубой'], sizes:['46','48','50','52','54'], dateAdded:'2026-10-15', image:photo('photo-1598033129183-c4f50c736f10'), desc:'Плотный хлопок с мягкой структурой. Универсальная основа гардероба.', composition:'100% хлопок' },
  { id:'jacket', slug:'jacket', name:'Куртка из замши', category:'Куртки', department:'men', categoryPath:'men/outerwear/jackets', price:56900, compareAtPrice:69900, discountPercent:19, brand:"GIMO'S", color:'Песочный', colors:['Песочный'], sizes:['46','48','50','52'], dateAdded:'2026-09-28', image:photo('photo-1551028719-00167b16eac5'), desc:'Лёгкая куртка с чистым кроем и мягкой замшей.', composition:'100% натуральная замша' },
  { id:'trousers', slug:'trousers', name:'Брюки прямого кроя', category:'Брюки', department:'men', categoryPath:'men/trousers', price:21900, brand:'PT01', color:'Графитовый', colors:['Графитовый','Песочный'], sizes:['46','48','50','52','54'], dateAdded:'2026-10-09', image:photo('photo-1473966968600-fa801b869a1a'), desc:'Брюки из фактурной ткани с комфортной посадкой.', composition:'55% шерсть, 45% хлопок' },
  { id:'shoes', slug:'shoes', name:'Кожаные кроссовки', category:'Кроссовки и кеды', department:'shoes', categoryPath:'shoes/sneakers', price:35900, brand:'FRANCESCHETTI', color:'Тёмно-коричневый', colors:['Тёмно-коричневый'], sizes:['40','41','42','43','44'], dateAdded:'2026-10-16', image:photo('photo-1614252369475-53125409fb3c'), desc:'Лаконичная модель из натуральной кожи для повседневных образов.', composition:'Натуральная кожа' },
  { id:'overshirt', slug:'overshirt', name:'Рубашка-куртка', category:'Рубашки', department:'men', categoryPath:'men/shirts', price:27900, brand:'Capobianco', color:'Оливковый', colors:['Оливковый'], sizes:['46','48','50','52'], dateAdded:'2026-10-19', image:photo('photo-1591047139829-d91aecb6caea'), desc:'Плотный хлопковый твил и функциональные карманы.', composition:'100% хлопок' },
  { id:'bag', slug:'bag', name:'Сумка через плечо', category:'Сумки', department:'accessories', categoryPath:'accessories/bags', price:24900, compareAtPrice:29900, discountPercent:17, brand:'Orciani', color:'Тёмно-коричневый', colors:['Тёмно-коричневый','Чёрный'], sizes:['ONE SIZE'], dateAdded:'2026-10-14', image:photo('photo-1553062407-98eeb64c6a62'), desc:'Компактный формат и лаконичная форма на каждый день.', composition:'Натуральная кожа' },
];

export const BRANDS = [
  'AD 56','BARBA NAPOLI','Berwich','Briglia 1949','Capobianco','Caruso','Duchamp','Fabrizio Mancini','FRANCESCHETTI','G.D.Scarpa',"GIMO'S",'Herno','HETREGO','Icoman','John Wellington','LUBIAM','MANTO','MANTO ITALY','Mattabisch Napoli','ONTHEBUND','Orciani','Panicale','PT','PT01','PT05','RADI Perugia','RADI Perugia Luxury','Richard James Brown','Rosi & Ghezzi','S. PIERPAOLI','Serapian','Svevo','Thompson','Waterville',
];

export const MEN_CATEGORIES = [
  { label:'Брюки', path:'men/trousers' },
  { label:'Верхняя одежда', path:'men/outerwear', children:[{label:'Куртки',path:'men/outerwear/jackets'},{label:'Пальто',path:'men/outerwear/coats'},{label:'Пуховики',path:'men/outerwear/down-jackets'}] },
  { label:'Джинсы', path:'men/jeans' }, { label:'Костюмы', path:'men/suits' }, { label:'Пиджаки', path:'men/blazers' },
  { label:'Рубашки', path:'men/shirts' }, { label:'Сорочки', path:'men/formal-shirts' },
  { label:'Трикотаж', path:'men/knit', children:[{label:'Джемпера',path:'men/knit/sweaters'},{label:'Кардиганы',path:'men/knit/cardigans'},{label:'Пиджаки',path:'men/knit/blazers'},{label:'Поло',path:'men/knit/polos'},{label:'Футболки',path:'men/knit/t-shirts'}] },
  { label:'Трикотажные костюмы', path:'men/knit-suits', children:[{label:'Брюки',path:'men/knit-suits/trousers'},{label:'Толстовки',path:'men/knit-suits/sweatshirts'},{label:'Шорты',path:'men/knit-suits/shorts'}] },
  { label:'Шорты', path:'men/shorts' }, { label:'Шорты пляжные', path:'men/swim-shorts' },
];
export const ACCESSORY_CATEGORIES = ['Перчатки','Шапки','Портфели','Рюкзаки','Сумки','Галстуки','Запонки','Кепки','Носки','Органайзеры','Платки карманные','Портмоне','Ремни','Шарфы'].map(label=>({label,path:label==='Сумки'?'accessories/bags':`accessories/${label.toLowerCase().replaceAll(' ','-')}`}));
export const SHOE_CATEGORIES = [{label:'Ботинки',path:'shoes/boots'},{label:'Кроссовки и кеды',path:'shoes/sneakers'},{label:'Туфли',path:'shoes/dress-shoes'}];

const flattenCategoryTree = (categories, ancestors = []) => categories.flatMap(({ label, path, children = [] }) => [
  { label: ancestors.length ? `${label} — ${ancestors.join(' / ')}` : label, path, department: path.split('/')[0] },
  ...flattenCategoryTree(children, [...ancestors, label]),
]);

export const CATALOG_CATEGORY_GROUPS = [
  { label:'Мужская одежда', department:'men', categories:flattenCategoryTree(MEN_CATEGORIES) },
  { label:'Обувь', department:'shoes', categories:flattenCategoryTree(SHOE_CATEGORIES) },
  { label:'Аксессуары', department:'accessories', categories:flattenCategoryTree(ACCESSORY_CATEGORIES) },
];

export const slugifyBrand = name => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const formatPrice = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
