import React, { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { ACCESSORY_CATEGORIES, BRANDS, formatPrice, MEN_CATEGORIES, products, SHOE_CATEGORIES, slugifyBrand } from '../data/store.js';
import { withBase } from '../utils/paths.js';

export function ProductCard({item,navigate,favs=[],toggleFav=()=>{}}) {
 const saved=favs.includes(item.id);
 return <article className="product-card">
  <div className="product-image"><img src={withBase(item.image)} alt={item.name} loading="lazy"/>
   {item.discountPercent&&<span className="product-discount">−{item.discountPercent}%</span>}
   <button className={`heart ${saved?'chosen':''}`} aria-label={saved?'Убрать из избранного':'Добавить в избранное'} aria-pressed={saved} onClick={()=>toggleFav(item.id)}><Heart size={19} strokeWidth={1.5} fill={saved?'currentColor':'none'}/></button>
   <a className="image-link" href={withBase(`/product/${item.slug}`)} aria-label={`Открыть ${item.name}`} onClick={e=>{e.preventDefault();navigate(`/product/${item.slug}`)}}/>
  </div>
  <div className="product-meta"><div><span>{item.brand}</span><h3><a href={withBase(`/product/${item.slug}`)} onClick={e=>{e.preventDefault();navigate(`/product/${item.slug}`)}}>{item.name}</a></h3>{item.colors?.length>1&&<div className="product-colors" aria-label={`Цвета: ${item.colors.join(', ')}`}>{item.colors.map((color,i)=><i key={color} title={color} className={`color-swatch swatch-${i%5}`}/>)}</div>}</div>
   <div className="product-prices">{item.compareAtPrice&&<del>{formatPrice(item.compareAtPrice)}</del>}<b>{formatPrice(item.price)}</b></div>
  </div>
 </article>;
}
export function ProductGrid({items,navigate,favs,toggleFav}) {return <div className="product-grid">{items.map(item=><ProductCard key={item.id} item={item} navigate={navigate} favs={favs} toggleFav={toggleFav}/>)}</div>}
export function Breadcrumbs({items,navigate}) {return <div className="breadcrumbs">{items.map((item,i)=><React.Fragment key={`${item.label}-${i}`}>{i>0&&<span>/</span>}{item.to?<button onClick={()=>navigate(item.to)}>{item.label}</button>:<span aria-current="page">{item.label}</span>}</React.Fragment>)}</div>}
export function EmptyState({title='Товары не найдены',description='Измените параметры фильтрации или сбросьте их.',onReset}) {return <div className="empty-results"><h2>{title}</h2><p>{description}</p>{onReset&&<button className="button" onClick={onReset}>Очистить фильтры</button>}</div>}
export function SortSelect({value,onChange}) {return <label className="sort-select">Сортировать <select value={value} onChange={e=>onChange(e.target.value)}><option value="new">Сначала новинки</option><option value="high">Сначала дороже</option><option value="low">Сначала дешевле</option></select></label>}
function CategoryBranch({category,selected,onSelect}) {return <li><button className={selected===category.path?'active':''} onClick={()=>onSelect(category.path)}>{category.label}</button>{category.children&&<ul>{category.children.map(child=><CategoryBranch key={child.path} category={child} selected={selected} onSelect={onSelect}/>)}</ul>}</li>}
export function CategoryNavigation({categories,selected,onSelect}) {return <nav className="category-navigation" aria-label="Категории"><h2>Категории</h2><ul>{categories.map(category=><CategoryBranch key={category.path} category={category} selected={selected} onSelect={onSelect}/>)}</ul></nav>}
export function FilterPanel({sizes,brands,size,sizeLabel,brand,onSize,onBrand,onClear}) {return <aside className="store-filters"><label>{sizeLabel}<select value={size} onChange={e=>onSize(e.target.value)}><option value="">Все размеры</option>{sizes.map(value=><option key={value} value={value}>{value}</option>)}</select></label><label>Бренд<select value={brand} onChange={e=>onBrand(e.target.value)}><option value="">Все бренды</option>{brands.map(value=><option key={value} value={value}>{value}</option>)}</select></label><button className="clear-filters" onClick={onClear}>Очистить фильтры</button></aside>}
export function LoadMore({shown,total,onClick}) {if(shown>=total)return null;return <div className="load-more"><button className="button" onClick={onClick}>Показать ещё</button></div>}

const catalogConfig={
 '/men':{title:'Мужская одежда',department:'men',categories:MEN_CATEGORIES,sizeLabel:'Размер одежды'},
 '/accessories':{title:'Аксессуары',department:'accessories',categories:ACCESSORY_CATEGORIES,sizeLabel:'Размер'},
 '/shoes':{title:'Обувь',department:'shoes',categories:SHOE_CATEGORIES,sizeLabel:'Размер обуви'},
 '/sale':{title:'Распродажа',department:'sale',categories:[],sizeLabel:'Размер'},
};
function setSearchParams(next) {
 const params=new URLSearchParams(window.location.search);
 for(const key of ['category','size','brand','sort','group']){if(next[key])params.set(key,next[key]);else params.delete(key)}
 const query=params.toString();history.replaceState(null,'',`${window.location.pathname}${query?`?${query}`:''}`);
}
function sortItems(items,sort) {return [...items].sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:new Date(b.dateAdded)-new Date(a.dateAdded))}

export function CategoryCatalog({route,navigate,searchParams,favs,toggleFav,brandName=null}) {
 const config=brandName?{title:brandName,department:null,categories:[],sizeLabel:'Размер'}:catalogConfig[route];
 const initial=new URLSearchParams(typeof window==='undefined'?'':window.location.search);
 const [category,setCategory]=useState(initial.get('category')||''),[size,setSize]=useState(initial.get('size')||''),[brand,setBrand]=useState(brandName||initial.get('brand')||''),[sort,setSort]=useState(initial.get('sort')||'new'),[group,setGroup]=useState(initial.get('group')||''),[limit,setLimit]=useState(8),[mobileFilters,setMobileFilters]=useState(false);
 const allItems=useMemo(()=>products.filter(item=>{
  if(brandName)return item.brand===brandName;
  if(config.department==='sale')return Boolean(item.discountPercent&&item.compareAtPrice);
  return item.department===config.department;
 }),[brandName,config.department]);
 const availableBrands=[...new Set(allItems.map(item=>item.brand))].sort((a,b)=>a.localeCompare(b,'en'));
 const availableSizes=[...new Set(allItems.flatMap(item=>item.sizes))].sort((a,b)=>a==='ONE SIZE'?1:b==='ONE SIZE'?-1:a.localeCompare(b,'en',{numeric:true}));
 const items=useMemo(()=>{
  let result=allItems.filter(item=>!category||item.categoryPath===category||item.categoryPath.startsWith(`${category}/`));
  if(config.department==='sale'&&group)result=result.filter(item=>item.department===group);
  if(size)result=result.filter(item=>item.sizes.includes(size));
  if(brand&&!brandName)result=result.filter(item=>item.brand===brand);
  return sortItems(result,sort);
 },[allItems,category,config.department,group,size,brand,brandName,sort]);
 const update=(key,value,setter)=>{setter(value);setSearchParams({category,size,brand:brandName?'':brand,sort,group,[key]:value})};
 const clear=()=>{setCategory('');setSize('');setBrand(brandName||'');setSort('new');setGroup('');setLimit(8);history.replaceState(null,'',window.location.pathname)};
 const activeCategory=config.categories.flatMap(item=>[item,...(item.children||[])]).find(item=>item.path===category);
 const visible=items.slice(0,limit);
 return <main className="section store-page">
  <Breadcrumbs items={[{label:'Главная',to:'/'},{label:brandName?'Бренды':config.title,to:brandName?'/brands':null},...(brandName?[{label:brandName}]:[])]} navigate={navigate}/>
  <div className="store-heading"><div><p className="eyebrow">BOUTIQUE 5 · ДЕМОНСТРАЦИОННЫЙ КАТАЛОГ</p><h1>{activeCategory?.label||config.title}</h1><p className="catalog-caption">Подборка вещей для современного гардероба.</p></div><span className="result-count">{items.length} моделей</span></div>
  {config.department==='sale'&&<nav className="sale-groups" aria-label="Разделы распродажи">{[['','Все разделы'],['accessories','Аксессуары'],['men','Мужская одежда'],['shoes','Обувь']].map(([value,label])=><button key={value||'all'} className={group===value?'active':''} onClick={()=>update('group',value,setGroup)}>{label}</button>)}</nav>}
  <div className="store-toolbar"><button className="mobile-filter" aria-expanded={mobileFilters} aria-controls="store-sidebar" onClick={()=>setMobileFilters(value=>!value)}>Фильтры {mobileFilters?'−':'+'}</button><SortSelect value={sort} onChange={value=>update('sort',value,setSort)}/></div>
  <div className="store-layout"><aside id="store-sidebar" className={`store-sidebar${mobileFilters?' is-open':''}`}>{config.categories.length>0&&<CategoryNavigation categories={config.categories} selected={category} onSelect={value=>update('category',value,setCategory)}/>}<FilterPanel sizes={availableSizes} brands={availableBrands} size={size} sizeLabel={config.sizeLabel} brand={brandName?'':brand} onSize={value=>update('size',value,setSize)} onBrand={value=>update('brand',value,setBrand)} onClear={clear}/></aside>
   <div className="store-results">{visible.length?<ProductGrid items={visible} navigate={navigate} favs={favs} toggleFav={toggleFav}/>:<EmptyState title={brandName?'Пока нет демонстрационных товаров этого бренда':'Подходящие товары не найдены'} description={brandName?'Для этого бренда пока не добавлены демонстрационные товары.':'Попробуйте изменить фильтры или сбросить их.'} onReset={clear}/>}<LoadMore shown={visible.length} total={items.length} onClick={()=>setLimit(value=>value+8)}/></div>
  </div>
 </main>;
}

export function BrandsPage({navigate}) {
 const [query,setQuery]=useState('');
 const sorted=[...new Set(BRANDS)].sort((a,b)=>a.localeCompare(b,'en',{sensitivity:'base'}));
 const filtered=sorted.filter(name=>name.toLocaleLowerCase('en').includes(query.trim().toLocaleLowerCase('en')));
 const letters=[...new Set(filtered.map(name=>name[0].toLocaleUpperCase('en')))];
 return <main className="section brands-page"><Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Бренды'}]} navigate={navigate}/><div className="store-heading"><div><p className="eyebrow">BOUTIQUE 5 · НАШ ВЫБОР</p><h1>Бренды</h1><p className="catalog-caption">Дома и мастерские, представленные в бутике.</p></div><span className="result-count">{filtered.length} бренда</span></div>
  <label className="brand-search">Поиск по названию<input type="search" placeholder="Например, Herno" value={query} onChange={e=>setQuery(e.target.value)}/></label>
  <nav className="brand-letters" aria-label="Переход к букве">{letters.map(letter=><a key={letter} href={`#brand-${letter}`}>{letter}</a>)}</nav>
  <div className="brand-list">{letters.map(letter=><section id={`brand-${letter}`} className="brand-group" key={letter}><h2>{letter}</h2><div>{filtered.filter(name=>name[0].toLocaleUpperCase('en')===letter).map(name=><a key={name} href={withBase(`/brands/${slugifyBrand(name)}`)} onClick={e=>{e.preventDefault();navigate(`/brands/${slugifyBrand(name)}`)}}>{name}<span aria-hidden="true">↗</span></a>)}</div></section>)}{filtered.length===0&&<EmptyState title="Бренд не найден" description="Проверьте написание или измените запрос." onReset={()=>setQuery('')}/>}</div>
 </main>;
}

export { BRANDS, products, slugifyBrand };
