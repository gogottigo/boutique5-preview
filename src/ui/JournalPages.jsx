import React from 'react';
import { JOURNAL } from '../data/journal.js';
import { products } from '../data/store.js';
import { EmptyState, ProductGrid } from './StorePages.jsx';
import { withBase } from '../utils/paths.js';

const formatDate = value => new Intl.DateTimeFormat('ru-RU', { day:'numeric', month:'long', year:'numeric' }).format(new Date(`${value}T12:00:00`));
const postHref = slug => `/journal/${slug}`;
const emphasizedTerms = ['L.B.M. 1911','Luigi Bianchi Mantova','Barba Napoli','G.D. Scarpa','L.B.M.','Radi Perugia','Richard J. Brown','Franceschetti','Gimo’s','Hetrego','Briglia 1949','Dents'];
const escapedTerms = emphasizedTerms.map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
const emphasisPattern = new RegExp(`(${escapedTerms.join('|')})`,'g');
const editorialText = value => value.split(emphasisPattern).map((part,index)=>emphasizedTerms.includes(part)?<strong key={`${part}-${index}`}>{part}</strong>:part);

function Breadcrumbs({ navigate, current }) {
 return <nav className="journal-breadcrumbs" aria-label="Хлебные крошки">
  <a href={withBase('/')} onClick={event=>{event.preventDefault();navigate('/')}}>Главная</a><span>/</span>
  <a href={withBase('/journal')} onClick={event=>{event.preventDefault();navigate('/journal')}}>Журнал</a>
  {current&&<><span>/</span><span aria-current="page">{current}</span></>}
 </nav>;
}

export function JournalIndex({ navigate }) {
 return <main className="journal-page section">
  <Breadcrumbs navigate={navigate}/>
  <header className="journal-heading"><p className="eyebrow">BOUTIQUE 5 · FASHION JOURNAL</p><h1>Журнал</h1><p>Идеи образов, сочетания вещей и рекомендации для современного мужского гардероба.</p></header>
  <p className="journal-demo-note">Редакционный раздел · примерный контент для демонстрации</p>
  <div className="journal-grid">{JOURNAL.map((post,index)=><article className={`journal-card journal-card-${index+1}`} key={post.slug}>
   <a className="journal-card-cover" href={withBase(postHref(post.slug))} onClick={event=>{event.preventDefault();navigate(postHref(post.slug))}}><img src={withBase(post.coverImage.src)} alt={post.coverImage.alt} loading="lazy"/><span aria-hidden="true">↗</span></a>
   <div className="journal-card-copy"><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time><h2><a href={withBase(postHref(post.slug))} onClick={event=>{event.preventDefault();navigate(postHref(post.slug))}}>{post.title}</a></h2><p>{post.excerpt}</p><a className="journal-read-link" href={withBase(postHref(post.slug))} onClick={event=>{event.preventDefault();navigate(postHref(post.slug))}}>Читать <span aria-hidden="true">↗</span></a></div>
  </article>)}</div>
 </main>;
}

export function JournalArticle({ post, navigate, favs, toggleFav }) {
 if(!post)return <main className="journal-page section"><Breadcrumbs navigate={navigate} current="Публикация"/><EmptyState title="Публикация не найдена" description="Материал мог быть перемещён." onReset={()=>navigate('/journal')}/></main>;
 const articleProducts=post.productIds.map(id=>products.find(item=>item.id===id)).filter(Boolean);
 const related=JOURNAL.filter(item=>item.slug!==post.slug).slice(0,3);
 return <main className={`journal-article section${post.slug==='osenniy-garderob'?' journal-story-coat':''}${post.slug==='iskusstvo-mnogosloynosti'?' journal-story-puffer':''}`}>
  <Breadcrumbs navigate={navigate} current={post.title}/>
  <article>
   <header className="journal-article-heading">{!post.intro&&<time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}<p className="eyebrow">BOUTIQUE 5 · ПОДБОРКА</p><h1>{post.title}</h1><p className="journal-deck">{post.excerpt}</p>{post.intro&&<time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}</header>
   <figure className="journal-hero-image"><img src={withBase(post.coverImage.src)} alt={post.coverImage.alt}/><figcaption>Редакционный образ BOUTIQUE 5</figcaption></figure>
   <div className="journal-article-body">
    {post.intro&&(Array.isArray(post.intro)
     ? <div className="journal-intro">{post.intro.map((paragraph,index)=><p key={index}>{editorialText(paragraph)}</p>)}</div>
     : <p className="journal-intro">{editorialText(post.intro)}</p>)}
    {post.subheading&&<h2 className="journal-article-subheading">{post.subheading}</h2>}
    {post.body.map((section,index)=>{
     const sectionImageData=post.images[index];
     const imageSequence=Array.isArray(sectionImageData)
      ? <div className={`journal-image-sequence${sectionImageData.length>1?' is-pair':''}`}>{sectionImageData.map(image=><figure className="journal-inline-image" key={image.src}><img src={withBase(image.src)} alt={image.alt} loading="lazy"/><figcaption>{image.alt}</figcaption></figure>)}</div>
      : sectionImageData&&<figure className="journal-inline-image"><img src={withBase(sectionImageData.src)} alt={sectionImageData.alt}/><figcaption>{sectionImageData.alt}</figcaption></figure>;
     return <React.Fragment key={`${section.heading}-${index}`}><section>{section.heading&&<h2>{section.heading}</h2>}{section.standfirst&&<p className="journal-look-standfirst">{section.standfirst}</p>}{section.text&&<p>{editorialText(section.text)}</p>}</section>{imageSequence}</React.Fragment>;
    })}
    {post.closing&&<aside className="journal-article-closing"><p><strong>{post.closing[0]}</strong></p>{post.closing[1]&&<p>{post.closing[1]}</p>}</aside>}
   </div>
   {post.productIds.length>0&&<section className="journal-products"><div className="journal-section-heading"><p className="eyebrow">РЕДАКЦИОННАЯ ПОДБОРКА</p><h2>Вещи из этого образа</h2><p>Товары и цены приведены для демонстрации и не подтверждают фактическое наличие.</p></div>{articleProducts.length?<ProductGrid items={articleProducts} navigate={navigate} favs={favs} toggleFav={toggleFav}/>:<EmptyState title="Подборка скоро появится" description="Для этого материала пока не выбраны демонстрационные товары."/>}<a className="button journal-shop-cta" href={withBase('/catalog')} onClick={event=>{event.preventDefault();navigate('/catalog')}}>Перейти к покупкам <span>↗</span></a></section>}
  </article>
  <aside className="journal-related"><div className="journal-section-heading"><p className="eyebrow">ПРОДОЛЖИТЬ ЧТЕНИЕ</p><h2>Похожие материалы</h2></div><div className="journal-related-grid">{related.map(item=><a className="journal-related-card" key={item.slug} href={withBase(postHref(item.slug))} onClick={event=>{event.preventDefault();navigate(postHref(item.slug))}}><img src={withBase(item.coverImage.src)} alt={item.coverImage.alt} loading="lazy"/><time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time><h3>{item.title}</h3><span>Читать ↗</span></a>)}</div></aside>
 </main>;
}
