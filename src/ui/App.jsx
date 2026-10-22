import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Heart, Menu, Search, Shirt, ShoppingBag, Truck, UserRound, X } from 'lucide-react';
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { SiGooglemaps } from 'react-icons/si';
import { SOCIAL_LINKS } from '../config/socialLinks.js';
import { products, BRANDS, CATALOG_CATEGORY_GROUPS, slugifyBrand, formatPrice as money } from '../data/store.js';
import { BrandsPage, CategoryCatalog, ProductGrid } from './StorePages.jsx';
import MegaMenu from './MegaMenu.jsx';
import { JournalArticle, JournalIndex } from './JournalPages.jsx';
import { getJournalPost } from '../data/journal.js';
import JournalRail from './JournalRail.jsx';
import SupportChat from './SupportChat.jsx';
import TryOnPanel from './TryOnPanel.jsx';
import ContactsPage from './ContactsPage.jsx';
import AboutPage from './AboutPage.jsx';
import DeliveryPage from './DeliveryPage.jsx';
import HelpPage from './HelpPage.jsx';
import { withBase, withoutBase } from '../utils/paths.js';

const photo = (id, w=900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;
const read = key => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };

function Logo() {
 return <a className="logo" href={withBase('/')} aria-label="BOUTIQUE 5 — на главную"><img src={withBase('/images/BoutiqueN5_OG_logo.jpg')} alt="BOUTIQUE 5" /></a>;
}
function Header({navigate,cart,favs}) {
 const [menu,setMenu]=useState(false),[searchOpen,setSearchOpen]=useState(false),[query,setQuery]=useState(''),[accountMessage,setAccountMessage]=useState(false);
 const menuTimer=useRef(null),searchInput=useRef(null),menuButton=useRef(null),menuArea=useRef(null);
 const cancelMenuClose=()=>{if(menuTimer.current)clearTimeout(menuTimer.current)};
 const scheduleMenuClose=()=>{cancelMenuClose();menuTimer.current=setTimeout(()=>setMenu(false),180)};
 const openOnHover=()=>{if(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches){cancelMenuClose();setMenu(true)}};
 const search=e=>{e.preventDefault();navigate('/catalog?q='+encodeURIComponent(query));setSearchOpen(false);setMenu(false)};
 useEffect(()=>{if(searchOpen)searchInput.current?.focus()},[searchOpen]);
 useEffect(()=>{if(!menu)return;const closeOutside=event=>{if(menuArea.current&&!menuArea.current.contains(event.target))setMenu(false)};document.addEventListener('pointerdown',closeOutside);return()=>document.removeEventListener('pointerdown',closeOutside)},[menu]);
 useEffect(()=>{const onKeyDown=e=>{if(e.key==='Escape'){if(menuButton.current&&document.activeElement?.closest('#site-menu'))menuButton.current.focus();setMenu(false);setSearchOpen(false);setAccountMessage(false)}};window.addEventListener('keydown',onKeyDown);return()=>{window.removeEventListener('keydown',onKeyDown);if(menuTimer.current)clearTimeout(menuTimer.current)}},[]);
 const socials=[['Telegram',FaTelegramPlane,SOCIAL_LINKS.telegram,'social-icon-telegram'],['Google Maps',SiGooglemaps,withBase('/contacts'),true,'social-icon-maps'],['WhatsApp',FaWhatsapp,SOCIAL_LINKS.whatsapp,false,'social-icon-whatsapp'],['Instagram',FaInstagram,SOCIAL_LINKS.instagram,false,'social-icon-instagram']];
 const go=to=>{navigate(to);setMenu(false);setSearchOpen(false)};
 return <header className="header"><div className="header-main"><div className="header-left">
  <div className="menu-area" ref={menuArea} onMouseEnter={openOnHover} onMouseLeave={scheduleMenuClose}>
   <button ref={menuButton} className="header-icon-btn menu-toggle" type="button" aria-label={menu?'Закрыть меню':'Открыть меню'} title={menu?'Закрыть меню':'Открыть меню'} aria-expanded={menu} aria-controls="site-menu" onClick={()=>{cancelMenuClose();setMenu(value=>!value);setSearchOpen(false)}}>{menu?<X aria-hidden="true"/>:<Menu aria-hidden="true"/>}</button>
   <div id="site-menu" className={`menu-panel${menu?' is-open':''}`} aria-hidden={!menu} inert={!menu}>
    <MegaMenu navigate={go}/>
   </div>
  </div>
  <div className="social-links" role="group" aria-label="Социальные сети и местоположение">{socials.map(([label,Icon,url,internal,iconClass])=>url?<a className="social-link" href={url} key={label} aria-label={label} title={label} target={internal?undefined:'_blank'} rel={internal?undefined:'noreferrer'} onClick={internal?e=>{e.preventDefault();go('/contacts')}:undefined}><Icon className={iconClass} aria-hidden="true"/></a>:<span className="social-link is-unavailable" key={label} role="img" aria-label={label} title={`${label}: ссылка не задана`}><Icon className={iconClass} aria-hidden="true"/></span>)}</div>
  </div>
  <Logo />
  <div className="actions header-actions">
   <form className={`header-search${searchOpen?' is-open':''}`} role="search" onSubmit={search}>
    <input ref={searchInput} className="header-search-field" type="search" aria-label="Поиск товаров" placeholder="Поиск товаров" tabIndex={searchOpen?0:-1} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Escape'){setSearchOpen(false);e.preventDefault()}}}/>
    <button className="header-icon-btn" type={searchOpen?'button':'submit'} aria-label={searchOpen?'Закрыть поиск':'Открыть поиск'} title={searchOpen?'Закрыть поиск':'Поиск'} onClick={e=>{if(!searchOpen){e.preventDefault();setMenu(false);setSearchOpen(true)}else{setSearchOpen(false)}}}>{searchOpen?<X aria-hidden="true"/>:<Search aria-hidden="true"/>}</button>
   </form>
   <button className="header-icon-btn" type="button" aria-label="Избранное" title="Избранное" onClick={()=>go('/catalog?favorites=1')}><Heart aria-hidden="true"/>{favs.length>0&&<span className="header-count">{favs.length}</span>}</button>
   <button className="header-icon-btn" type="button" aria-label="Корзина" title="Корзина" onClick={()=>go('/cart')}><ShoppingBag aria-hidden="true"/>{cart.reduce((a,x)=>a+x.qty,0)>0&&<span className="header-count">{cart.reduce((a,x)=>a+x.qty,0)}</span>}</button>
   <div className="account-wrap"><button className="header-icon-btn" type="button" aria-label="Личный кабинет" title="Личный кабинет" aria-expanded={accountMessage} onClick={()=>setAccountMessage(value=>!value)}><UserRound aria-hidden="true"/></button>{accountMessage&&<span className="account-hint" role="status">Личный кабинет скоро появится</span>}</div>
  </div>
 </div></header>
}
function Footer({navigate}) {const links=[['Мужская одежда','/men'],['Обувь','/shoes'],['Аксессуары','/accessories'],['Распродажа','/sale'],['Бренды','/brands']];const projectLinks=[['О компании','/about/'],['Доставка и оплата','/delivery/'],['Помощь','/help/'],['Контакты','/contacts/']];return <footer className="footer"><div className="footer-brand-column"><Logo /><div className="footer-brand-copy"><h2>Boutique N5</h2><p>Мужская одежда, обувь и аксессуары класса люкс.</p><p>С 1999 года мы отбираем лучшие итальянские бренды, воплощающие философию <em>Made in Italy</em> — безупречное качество, элегантность и ручную работу.</p><p>Коллекции объединяют изделия из разных регионов Италии — от костюмов до обуви и аксессуаров, многие из которых создаются вручную.</p><p>С 2013 года интернет-бутик Boutique N5 делает премиальную мужскую моду доступной по всей России.</p></div></div><div><b>Коллекции</b>{links.map(([label,url])=><a key={url} href={withBase(url)} onClick={e=>{e.preventDefault();navigate(url)}}>{label}</a>)}</div><div><b>О проекте</b>{projectLinks.map(([label,url])=><a key={url} href={withBase(url)} onClick={e=>{e.preventDefault();navigate(url)}}>{label}</a>)}</div><div className="copyright">© BOUTIQUE 5 · Демонстрационный каталог · 2026</div></footer>}
function Hero({navigate}) {
 const [motionAllowed,setMotionAllowed]=useState(false),[videoFailed,setVideoFailed]=useState(false),[videoReady,setVideoReady]=useState(false);
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{setMotionAllowed(!preference.matches);setVideoFailed(false);setVideoReady(false)};
  update();
  preference.addEventListener?.('change',update);
  return()=>preference.removeEventListener?.('change',update);
 },[]);
 const startVideo=event=>{const play=event.currentTarget.play();if(play?.then)play.then(()=>setVideoReady(true)).catch(()=>setVideoFailed(true));else setVideoReady(true)};
 return <section className="hero">
  <img className="hero-fallback" src={photo('photo-1617137968427-85924c800a22',2000)} alt="" fetchPriority="high"/>
  {motionAllowed&&!videoFailed&&<video className={`hero-video${videoReady?' is-ready':''}`} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onError={()=>setVideoFailed(true)} onCanPlay={startVideo}><source src={withBase('/videos/Homepage_Video_Background.mp4')} type="video/mp4"/></video>}
  <div className="hero-shade"/>
  <div className="hero-copy"><p className="eyebrow light">КОЛЛЕКЦИЯ · ОСЕНЬ 2026</p><h1>Стиль вне времени</h1><p>Современный мужской гардероб на каждый день</p><button className="button button-light" onClick={()=>navigate('/men')}>Смотреть коллекцию <span>↗</span></button></div>
  <button className="hero-scroll-next" type="button" aria-label="Прокрутить к следующей секции" title="Прокрутить к следующей секции" onClick={()=>document.getElementById('home-journal')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}><ChevronDown aria-hidden="true" size={28} strokeWidth={1.35}/></button>
 </section>;
}
function Newsletter() {
 const [notice,setNotice]=useState('');
 const submit=event=>{
  event.preventDefault();
  // TODO: connect to an approved first-party mailing-list API.
  // Do not send or store email addresses before that integration exists.
  setNotice('Подписка пока не подключена к сервису рассылки. Адрес никуда не отправлен.');
 };
 return <section className="newsletter" aria-labelledby="newsletter-title">
  <img className="newsletter-image" src={withBase('/images/journal/lbm1911/lbm1911_3.jpg')} alt="" loading="lazy" decoding="async"/>
  <div className="newsletter-shade" aria-hidden="true"/>
  <div className="newsletter-content">
   <p className="eyebrow light">BOUTIQUE 5 — PRIVATE EDITION</p>
   <h2 id="newsletter-title">Оставайтесь в нашем кругу</h2>
   <p className="newsletter-description">Новые коллекции, избранные вещи и истории о стиле — в вашей почте.</p>
   <form className="newsletter-form" onSubmit={submit}>
    <label className="visually-hidden" htmlFor="newsletter-email">Ваш e-mail</label>
    <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Ваш e-mail" required/>
    <button type="submit">Подписаться <span aria-hidden="true">↗</span></button>
   </form>
   <p className="newsletter-note">Форма пока не подключена к сервису рассылки. Введённый адрес не отправляется.</p>
   {notice&&<p className="newsletter-status" role="status">{notice}</p>}
  </div>
 </section>;
}
function Home({navigate}) {
 const categoryTiles=[
  {title:'Мужская одежда',href:'/men',image:'/images/manswear.webp',alt:'Мужская одежда в современном образе'},
  {title:'Обувь',href:'/shoes',image:'/images/boots.jpg',alt:'Мужские ботинки из кожи'},
  {title:'Аксессуары',href:'/accessories',image:products.find(item=>item.id==='bag').image,alt:'Мужская сумка из демонстрационной коллекции'},
  {title:'Распродажа',href:'/sale',image:products.find(item=>item.id==='jacket').image,alt:'Куртка из раздела демонстрационной распродажи'},
 ];
 return <main className="home-snap">
  <Hero navigate={navigate}/>
  <JournalRail navigate={navigate}/>
  <section className="section home-category-section" aria-label="Категории магазина">
   <div className="home-category-grid">{categoryTiles.map(category=><a className="home-category-tile" href={withBase(category.href)} key={category.href} onClick={event=>{event.preventDefault();navigate(category.href)}}>
    <img src={withBase(category.image)} alt={category.alt} loading="lazy" decoding="async"/>
    <span className="home-category-shade" aria-hidden="true"/>
    <span className="home-category-label">{category.title}</span>
    <span className="home-category-arrow" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M4 10h11M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.2"/></svg></span>
   </a>)}</div>
  </section>
  <Newsletter/>
 </main>;
}
function FilterPanel({filters,setFilters}) {const update=(k,v)=>setFilters({...filters,[k]:v});return <aside className="filters"><label>Категория<select value={filters.category} onChange={e=>update('category',e.target.value)}><option value="">Все категории</option>{CATALOG_CATEGORY_GROUPS.map(group=><optgroup key={group.department} label={group.label}>{group.categories.map(category=><option key={category.path} value={category.path}>{category.label}</option>)}</optgroup>)}</select></label><label>Размер<select value={filters.size} onChange={e=>update('size',e.target.value)}><option value="">Все размеры</option>{['40','41','42','43','44','46','48','50','52','54'].map(x=><option key={x}>{x}</option>)}</select></label><label>Цвет<select value={filters.color} onChange={e=>update('color',e.target.value)}><option value="">Любой цвет</option>{[...new Set(products.map(p=>p.color))].map(x=><option key={x}>{x}</option>)}</select></label><div className="price-label">Цена, ₽</div><div className="price-inputs"><input type="number" aria-label="Цена от" placeholder="От" value={filters.min} onChange={e=>update('min',e.target.value)}/><input type="number" aria-label="Цена до" placeholder="До" value={filters.max} onChange={e=>update('max',e.target.value)}/></div><button className="clear-filters" onClick={()=>setFilters({category:'',size:'',color:'',min:'',max:''})}>Сбросить фильтры</button></aside>}
function Catalog({navigate,favs,toggleFav,searchParams}) {const [filters,setFilters]=useState({category:searchParams.get('category')||'',size:'',color:'',min:'',max:''}),[sort,setSort]=useState('new'),[mobileFilters,setMobileFilters]=useState(false);const list=useMemo(()=>{let a=[...products];const q=(searchParams.get('q')||'').toLocaleLowerCase('ru');if(q)a=a.filter(p=>p.name.toLocaleLowerCase('ru').includes(q));if(searchParams.get('favorites'))a=a.filter(p=>favs.includes(p.id));if(filters.category)a=a.filter(p=>p.department===filters.category.split('/')[0]&&(p.categoryPath===filters.category||p.categoryPath.startsWith(`${filters.category}/`)));if(filters.size)a=a.filter(p=>p.sizes.includes(filters.size));if(filters.color)a=a.filter(p=>p.color===filters.color);if(filters.min)a=a.filter(p=>p.price>=+filters.min);if(filters.max)a=a.filter(p=>p.price<=+filters.max);if(sort==='low')a.sort((x,y)=>x.price-y.price);if(sort==='high')a.sort((x,y)=>y.price-x.price);return a},[filters,sort,favs,searchParams]);return <main className="catalog section"><div className="breadcrumbs"><button onClick={()=>navigate('/')}>Главная</button><span>/</span> Каталог</div><div className="catalog-head"><div><p className="eyebrow">BOUTIQUE 5 · ОДЕЖДА И АКСЕССУАРЫ</p><h1>{searchParams.get('favorites')?'Избранное':'Мужская коллекция'}</h1><p className="catalog-caption">Вещи для гардероба, который работает каждый день.<br/>Демонстрационные товары и цены.</p></div><span className="result-count">{list.length} моделей</span></div><div className="catalog-toolbar"><button className="mobile-filter" onClick={()=>setMobileFilters(!mobileFilters)}>Фильтры {mobileFilters?'−':'+'}</button><label>Сортировать <select value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Сначала новинки</option><option value="low">Сначала дешевле</option><option value="high">Сначала дороже</option></select></label></div><div className="catalog-layout"><div className={mobileFilters?'filter-wrap visible':'filter-wrap'}><FilterPanel filters={filters} setFilters={setFilters}/></div>{list.length?<ProductGrid items={list} navigate={navigate} favs={favs} toggleFav={toggleFav}/>:<div className="empty-results"><h2>Ничего не найдено</h2><p>Попробуйте изменить запрос или сбросить фильтры.</p><button className="button" onClick={()=>{setFilters({category:'',size:'',color:'',min:'',max:''});navigate('/catalog')}}>Показать всё</button></div>}</div></main>}
function Product({id,navigate,add,...cardProps}) {
 const item=products.find(p=>p.slug===id)||products[0];
 const [size,setSize]=useState('');
 const [color,setColor]=useState(item.color);
 const [notice,setNotice]=useState('');
 const [lookOpen,setLookOpen]=useState(false);
 const [expressOrder,setExpressOrder]=useState(false);
 const [stickyVisible,setStickyVisible]=useState(false);
 const [tryOnOpen,setTryOnOpen]=useState(false);
 const productDetailRef=useRef(null);
 const tryOnButtonRef=useRef(null);
 const related=products.filter(p=>p.id!==item.id).slice(0,4);
 const isFavorite=cardProps.favs?.includes(item.id)||false;
 const toggleFavorite=()=>cardProps.toggleFav?.(item.id);
 const purchase=()=>{
  if(!size){setNotice('Выберите размер, чтобы продолжить.');const options=productDetailRef.current?.querySelector('.size-options');options?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});options?.querySelector('button')?.focus({preventScroll:true});return}
  if(expressOrder){setNotice('Экспресс-заказ пока недоступен: оформление не подключено.');return}
  add(item,size,color);
  setNotice('Товар добавлен в корзину');
 };
 useEffect(()=>{
  const target=productDetailRef.current;
  if(!target)return;
  let observer;
  const headerHeight=()=>{
   const header=document.querySelector('.header');
   const cssHeight=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))||0;
   return header?.getBoundingClientRect().height||cssHeight;
  };
  const observe=()=>{
   observer?.disconnect();
   const offset=headerHeight();
   if('IntersectionObserver' in window){
    observer=new IntersectionObserver(entries=>{
     const entry=entries[0];
     setStickyVisible(!entry.isIntersecting&&entry.boundingClientRect.bottom<=offset);
    },{rootMargin:`-${offset}px 0px 0px 0px`,threshold:0});
    observer.observe(target);
   }else{
    setStickyVisible(target.getBoundingClientRect().bottom<=offset);
   }
  };
  const onScroll=()=>{
   if(!('IntersectionObserver' in window))setStickyVisible(target.getBoundingClientRect().bottom<=headerHeight());
  };
  observe();
  window.addEventListener('resize',observe);
  if(!('IntersectionObserver' in window))window.addEventListener('scroll',onScroll,{passive:true});
  return()=>{
   observer?.disconnect();
   window.removeEventListener('resize',observe);
   window.removeEventListener('scroll',onScroll);
  };
 },[id]);
 return <main className="section product-page">
  <div className="breadcrumbs"><button onClick={()=>navigate('/')}>Главная</button><span>/</span><button onClick={()=>navigate(item.department==='men'?'/men':`/${item.department}`)}>{item.department==='men'?'Одежда':item.department==='shoes'?'Обувь':'Аксессуары'}</button><span>/</span>{item.name}</div>
  <div className="product-layout">
   <div className="product-detail" ref={productDetailRef}>
    <div className="gallery"><div className="gallery-main">
     <img src={item.image.replace('w=900','w=1400')} alt={item.name}/>
     <div className="product-gallery-actions">
      <button className="product-gallery-action try-on" type="button" ref={tryOnButtonRef} aria-label={`Открыть онлайн-примерку для товара ${item.name}`} title="Открыть онлайн-примерку" onClick={()=>setTryOnOpen(true)}><Shirt aria-hidden="true"/><span>Онлайн-примерка</span></button>
      <button className={`product-gallery-action full-look${lookOpen?' is-expanded':''}`} type="button" aria-label="Перейти к рекомендациям: Вам может подойти" title="Перейти к рекомендациям" onClick={()=>{setLookOpen(value=>!value);document.getElementById('recommended-products')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}}><span className="full-look-label">Весь образ</span><Shirt aria-hidden="true"/></button>
     </div>
    </div></div>
    <div className="product-info">
     <a className="product-brand-link" href={withBase(`/brands/${slugifyBrand(item.brand)}`)} onClick={e=>{e.preventDefault();navigate(`/brands/${slugifyBrand(item.brand)}`)}}>{item.brand}</a>
     <p className="eyebrow">{item.category} · ДЕМО-КАТАЛОГ</p><h1>{item.name}</h1>
     <div className="detail-price">{item.compareAtPrice&&<del>{money(item.compareAtPrice)}</del>} {money(item.price)} <small>демонстрационная цена</small></div>
     <p className="detail-color">Цвет: <b>{color}</b></p>
     {item.colors?.length>1&&<div className="variant-colors" aria-label="Выбор цвета">{item.colors.map((variant,i)=><button type="button" className={color===variant?'selected':''} key={variant} onClick={()=>setColor(variant)} aria-pressed={color===variant}><i className={`color-swatch swatch-${i%5}`}/>{variant}</button>)}</div>}
     <p className="stock-status">В наличии · демонстрационные данные</p>
     <div className="express-order-panel"><div className="express-order-copy"><Truck aria-hidden="true"/><div><strong>Экспресс-заказ</strong><span>Получить сегодня — с курьером или в магазине</span></div></div><button className={`express-order-switch${expressOrder?' is-on':''}`} type="button" role="switch" aria-checked={expressOrder} aria-label="Экспресс-заказ" onClick={()=>{setExpressOrder(value=>!value);setNotice('')}}><span/></button></div>
     <div className="size-heading">Размер <button onClick={()=>setNotice('Размерная сетка: ориентируйтесь на привычную посадку модели.')}>Таблица размеров</button></div>
     <div className="size-options">{item.sizes.map(s=><button type="button" className={size===s?'selected':''} key={s} onClick={()=>setSize(s)} aria-pressed={size===s}>{s}</button>)}</div>
     <div className="product-purchase-actions"><button className={`button add-button${expressOrder?' is-express-order':''}`} onClick={purchase}>{expressOrder?'Экспресс-заказ':'Добавить в корзину'} <span>↗</span></button><button className={`product-detail-favorite${isFavorite?' is-favorite':''}`} type="button" aria-label={isFavorite?'Убрать из избранного':'Добавить в избранное'} aria-pressed={isFavorite} onClick={toggleFavorite}><Heart aria-hidden="true" fill={isFavorite?'currentColor':'none'}/></button></div>
     {notice&&<div className="notice" role="status">{notice}{notice.includes('добавлен')&&<button onClick={()=>navigate('/cart')}>Перейти в корзину</button>}</div>}
     <div className="detail-description"><p>{item.desc}</p><details open><summary>Состав</summary><p>{item.composition}</p></details><details><summary>Уход</summary><p>Деликатная чистка. Следуйте рекомендациям на ярлыке изделия.</p></details><details><summary>Доставка и возврат</summary><p>Информация демонстрационная: параметры доставки уточняются для конкретного региона.</p></details></div>
    </div>
   </div>
   <section className="related" id="recommended-products"><div className="section-heading"><div><p className="eyebrow">ЗАВЕРШИТЕ ОБРАЗ</p><h2>Вам может подойти</h2></div></div><ProductGrid items={related} navigate={navigate} {...cardProps}/></section>
  </div>
  <div className={`product-sticky-bar${stickyVisible?' is-visible':''}`} aria-hidden={!stickyVisible}>
   <div className="product-sticky-inner">
    <div className="product-sticky-summary"><img src={item.image.replace('w=900','w=180')} alt=""/><div><strong>{item.name}</strong><span>{money(item.price)}{color?` · ${color}`:''}</span></div></div>
    <div className="product-sticky-actions"><button className={`product-sticky-favorite${isFavorite?' is-favorite':''}`} type="button" aria-label={isFavorite?'Убрать из избранного':'Добавить в избранное'} aria-pressed={isFavorite} tabIndex={stickyVisible?0:-1} onClick={toggleFavorite}><Heart aria-hidden="true" fill={isFavorite?'currentColor':'none'}/></button><button className={`button product-sticky-buy${expressOrder?' is-express-order':''}`} type="button" tabIndex={stickyVisible?0:-1} onClick={purchase}>{expressOrder?'Экспресс-заказ':'Добавить в корзину'}</button></div>
   </div>
  </div>
  <TryOnPanel open={tryOnOpen} onClose={()=>setTryOnOpen(false)} image={item.image.replace('w=900','w=1400')} productName={item.name} triggerRef={tryOnButtonRef}/>
 </main>;
}
function Cart({cart,setCart,navigate}) {const [success,setSuccess]=useState(false);const change=(key,qty)=>setCart(cart.map(x=>x.key===key?{...x,qty}:x).filter(x=>x.qty>0));const remove=key=>setCart(cart.filter(x=>x.key!==key));const total=cart.reduce((sum,x)=>sum+x.price*x.qty,0);return <main className="section cart-page"><div className="breadcrumbs"><button onClick={()=>navigate('/')}>Главная</button><span>/</span> Корзина</div><div className="cart-heading"><div><p className="eyebrow">ВАШ ВЫБОР</p><h1>Корзина</h1></div><span>{cart.reduce((a,x)=>a+x.qty,0)} товара</span></div>{success?<div className="order-success"><span>✓</span><h2>Спасибо за интерес к BOUTIQUE 5</h2><p>Это демонстрационный прототип. Заказ не оформлен, оплата не производится.</p><button className="button" onClick={()=>{setSuccess(false);navigate('/catalog')}}>Продолжить покупки</button></div>:cart.length?<div className="cart-layout"><div className="cart-items">{cart.map(x=><CartItem key={x.key} item={x} change={change} remove={remove}/>)}</div><aside className="cart-summary"><p>Итого <b>{money(total)}</b></p><span>Доставка рассчитывается при оформлении</span><button className="button" onClick={()=>setSuccess(true)}>Перейти к оформлению <span>↗</span></button><small>Демонстрационный шаг. Данные и оплата не запрашиваются.</small></aside></div>:<div className="cart-empty"><span>♧</span><h2>Корзина пока пуста</h2><p>Самое время найти вещи для вашего гардероба.</p><button className="button" onClick={()=>navigate('/catalog')}>Перейти в каталог <span>↗</span></button></div>}</main>}
function CartItem({item,change,remove}) {return <article className="cart-item"><img src={item.image} alt={item.name}/><div className="cart-item-info"><span>{item.category}</span><h2>{item.name}</h2><p>Цвет: {item.color} · Размер: {item.size}</p><div className="quantity"><button aria-label="Уменьшить количество" onClick={()=>change(item.key,item.qty-1)}>−</button><span>{item.qty}</span><button aria-label="Увеличить количество" onClick={()=>change(item.key,item.qty+1)}>+</button></div></div><div className="cart-item-price"><b>{money(item.price*item.qty)}</b><button onClick={()=>remove(item.key)}>Удалить</button></div></article>}
export default function App({initialPath='/'}) {
 const [path,setPath]=useState(()=>{
  const pathname=typeof window==='undefined'?initialPath:window.location.pathname;
  const search=typeof window==='undefined'?'':window.location.search;
  return withoutBase(pathname)+search;
 });
 const [cart,setCart]=useState(()=>read('b5-cart'));
 const [favs,setFavs]=useState(()=>read('b5-favs'));
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  setReady(true);
  const pop=()=>setPath(withoutBase(location.pathname)+location.search);
  addEventListener('popstate',pop);
  return()=>removeEventListener('popstate',pop);
 },[]);
 useEffect(()=>{
  const route=path.split('?')[0].replace(/\/+$/,'')||'/';
  const article=route.startsWith('/journal/')?getJournalPost(route.split('/').pop()):null;
  const title=route==='/help'?'Помощь — BOUTIQUE 5':route==='/delivery'?'Доставка и оплата — BOUTIQUE 5':route==='/about'?'О компании — BOUTIQUE 5':route==='/journal'?'Журнал — BOUTIQUE 5':article?`${article.title} — Журнал BOUTIQUE 5`:'BOUTIQUE 5 — мужской гардероб';
  const description=route==='/help'?'Информация по оформлению и отмене заказа, а также возврату товара в BOUTIQUE 5.':route==='/delivery'?'Условия доставки и оплаты заказов Boutique N5, сроки доставки по городам России и накопительная скидка.':route==='/about'?'Премиальный бутик мужской одежды, обуви и аксессуаров Boutique N5: история, философия Made in Italy и интернет-магазин.':route==='/journal'?'Идеи образов, сочетания вещей и рекомендации для современного мужского гардероба.':article?.excerpt||'BOUTIQUE 5 — концепция современного мужского гардероба.';
  document.title=title;
  const meta=document.querySelector('meta[name="description"]');
  if(meta)meta.setAttribute('content',description);
 },[path]);
 useEffect(()=>{if(ready)localStorage.setItem('b5-cart',JSON.stringify(cart))},[cart,ready]);
 useEffect(()=>{if(ready)localStorage.setItem('b5-favs',JSON.stringify(favs))},[favs,ready]);
 const navigate=to=>{
  const nextPath=withoutBase(to);
  history.pushState({},'',withBase(nextPath));
  setPath(nextPath);
  window.scrollTo({top:0,behavior:'smooth'});
 };
 const params=new URLSearchParams(path.split('?')[1]||'');
 const toggleFav=id=>setFavs(favs.includes(id)?favs.filter(x=>x!==id):[...favs,id]);
 const add=(p,size,color=p.color)=>{
  const key=p.id+'-'+size+'-'+color;
  setCart(c=>c.some(x=>x.key===key)?c.map(x=>x.key===key?{...x,qty:x.qty+1}:x):[...c,{key,id:p.id,name:p.name,category:p.category,image:p.image,price:p.price,color,size,qty:1}]);
 };
 const route=path.split('?')[0].replace(/\/+$/,'')||'/';
 let page;
 if(route==='/contacts')page=<ContactsPage navigate={navigate}/>;
 else if(route==='/about')page=<AboutPage/>;
 else if(route==='/delivery')page=<DeliveryPage/>;
 else if(route==='/help')page=<HelpPage/>;
 else if(route==='/journal')page=<JournalIndex navigate={navigate}/>;
 else if(route.startsWith('/journal/'))page=<JournalArticle post={getJournalPost(route.split('/').pop())} navigate={navigate} favs={favs} toggleFav={toggleFav}/>;
 else if(route==='/brands')page=<BrandsPage navigate={navigate}/>;
 else if(route.startsWith('/brands/')){
  const slug=route.split('/').pop();
  const brand=BRANDS.find(name=>slugifyBrand(name)===slug);
  page=<CategoryCatalog key={slug} route="/brands" brandName={brand||'Бренд не найден'} navigate={navigate} searchParams={params} favs={favs} toggleFav={toggleFav}/>;
 } else if(['/men','/shoes','/accessories','/sale'].includes(route))page=<CategoryCatalog key={route} route={route} navigate={navigate} searchParams={params} favs={favs} toggleFav={toggleFav}/>;
 else if(route==='/catalog')page=<Catalog navigate={navigate} favs={favs} toggleFav={toggleFav} searchParams={params}/>;
 else if(route.startsWith('/product/'))page=<Product key={route} id={route.split('/').pop()} navigate={navigate} add={add} favs={favs} toggleFav={toggleFav}/>;
 else if(route==='/cart')page=<Cart cart={cart} setCart={setCart} navigate={navigate}/>;
 else page=<Home navigate={navigate} favs={favs} toggleFav={toggleFav}/>;
 const isSupportCatalogRoute=['/catalog','/men','/shoes','/accessories','/sale'].includes(route)||(route.startsWith('/brands/')&&BRANDS.some(brand=>slugifyBrand(brand)===route.slice('/brands/'.length)));
 const isSupportProductRoute=route.startsWith('/product/');
 return <><Header navigate={navigate} cart={cart} favs={favs}/>{page}<Footer navigate={navigate}/>{(isSupportCatalogRoute||isSupportProductRoute)&&<SupportChat/>}</>;
}
