import React, { useState } from 'react';
import { ACCESSORY_CATEGORIES, BRANDS, MEN_CATEGORIES, SHOE_CATEGORIES, slugifyBrand } from '../data/store.js';
import { withBase } from '../utils/paths.js';

const categoryUrl = (route, category) => `${route}?category=${encodeURIComponent(category.path)}`;

function CategoryLinks({ items, route, navigate, depth = 0 }) {
 return <ul className={`mega-category-list depth-${depth}`}>
  {items.map(item => <li key={item.path}>
   <a className={item.children?.length?'has-children':''} href={withBase(categoryUrl(route, item))} onClick={event => { event.preventDefault(); navigate(categoryUrl(route, item)); }} aria-label={`Открыть категорию ${item.label}`}>
    {item.label}<span aria-hidden="true">↗</span>
   </a>
   {item.children?.length>0&&<CategoryLinks items={item.children} route={route} navigate={navigate} depth={depth+1}/>}
  </li>)}
 </ul>;
}

function MenuColumn({ title, children, columnId, open, onToggle }) {
 return <section className={`mega-column${open?' is-expanded':''}`}>
  <h2><button type="button" aria-expanded={open} aria-controls={columnId} onClick={onToggle}>{title}<span aria-hidden="true">{open?'−':'+'}</span></button></h2>
  <div className="mega-column-content" id={columnId} hidden={!open}>{children}</div>
 </section>;
}

export default function MegaMenu({ navigate }) {
 const [openSections, setOpenSections] = useState({ novelties:true, men:true, shoes:true, accessories:true, brands:true });
 const toggle = id => setOpenSections(current => ({...current,[id]:!current[id]}));
 const columns = [
  {id:'novelties',title:'НОВИНКИ',content:<ul className="mega-category-list"><li><a href={withBase('/journal')} onClick={event=>{event.preventDefault();navigate('/journal')}}>Журнал Boutique N5<span aria-hidden="true">↗</span></a></li><li><a href={withBase('/men?sort=new')} onClick={event=>{event.preventDefault();navigate('/men?sort=new')}}>Новинки одежды<span aria-hidden="true">↗</span></a></li><li><a href={withBase('/shoes?sort=new')} onClick={event=>{event.preventDefault();navigate('/shoes?sort=new')}}>Новинки обуви<span aria-hidden="true">↗</span></a></li><li><a href={withBase('/accessories?sort=new')} onClick={event=>{event.preventDefault();navigate('/accessories?sort=new')}}>Новинки аксессуаров<span aria-hidden="true">↗</span></a></li></ul>},
  {id:'men',title:'МУЖСКАЯ ОДЕЖДА',content:<><a className="mega-all-link" href={withBase('/men')} onClick={event=>{event.preventDefault();navigate('/men')}}>Вся одежда<span aria-hidden="true">↗</span></a><CategoryLinks items={MEN_CATEGORIES} route="/men" navigate={navigate}/></>},
  {id:'shoes',title:'ОБУВЬ',content:<><a className="mega-all-link" href={withBase('/shoes')} onClick={event=>{event.preventDefault();navigate('/shoes')}}>Вся обувь<span aria-hidden="true">↗</span></a><CategoryLinks items={SHOE_CATEGORIES} route="/shoes" navigate={navigate}/></>},
  {id:'accessories',title:'АКСЕССУАРЫ',content:<><a className="mega-all-link" href={withBase('/accessories')} onClick={event=>{event.preventDefault();navigate('/accessories')}}>Все аксессуары<span aria-hidden="true">↗</span></a><CategoryLinks items={ACCESSORY_CATEGORIES} route="/accessories" navigate={navigate}/></>},
  {id:'brands',title:'БРЕНДЫ',content:<><a className="mega-all-link" href={withBase('/brands')} onClick={event=>{event.preventDefault();navigate('/brands')}}>Все бренды<span aria-hidden="true">↗</span></a><ul className="mega-category-list mega-brands">{BRANDS.slice(0,8).map(brand=><li key={brand}><a href={withBase(`/brands/${slugifyBrand(brand)}`)} onClick={event=>{event.preventDefault();navigate(`/brands/${slugifyBrand(brand)}`)}}>{brand}<span aria-hidden="true">↗</span></a></li>)}</ul><a className="mega-see-all" href={withBase('/brands')} onClick={event=>{event.preventDefault();navigate('/brands')}}>Смотреть все бренды</a></>},
 ];
 return <div className="mega-menu-inner">
  <nav className="mega-menu-columns" aria-label="Каталог магазина">
   {columns.map(column=><MenuColumn key={column.id} title={column.title} columnId={`mega-${column.id}`} open={openSections[column.id]} onToggle={()=>toggle(column.id)}>{column.content}</MenuColumn>)}
  </nav>
  <nav className="mega-menu-secondary" aria-label="Специальные разделы">
   <a href={withBase('/sale')} onClick={event=>{event.preventDefault();navigate('/sale')}}>Распродажа <span aria-hidden="true">↗</span></a>
   <a href={withBase('/contacts/')} onClick={event=>{event.preventDefault();navigate('/contacts')}}>Контакты <span aria-hidden="true">↗</span></a>
   <a href={withBase('/about/')} onClick={event=>{event.preventDefault();navigate('/about')}}>О компании <span aria-hidden="true">↗</span></a>
   <a href={withBase('/delivery/')} onClick={event=>{event.preventDefault();navigate('/delivery')}}>Доставка и оплата <span aria-hidden="true">↗</span></a>
   <a href={withBase('/help/')} onClick={event=>{event.preventDefault();navigate('/help')}}>Помощь <span aria-hidden="true">↗</span></a>
  </nav>
 </div>;
}
