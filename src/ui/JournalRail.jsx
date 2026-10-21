import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JOURNAL } from '../data/journal.js';
import { withBase } from '../utils/paths.js';

const FALLBACK_COVER = withBase('/images/journal/lbm1911/lbm1911_1.jpg');

export default function JournalRail({ navigate }) {
 const railRef = useRef(null);
 const dragRef = useRef(null);
 const suppressClickRef = useRef(false);
 const [edges, setEdges] = useState({ start:true, end:true });
 const posts = JOURNAL.filter(post => post.status === undefined ? post.published !== false : post.status === 'published');

 const updateEdges = useCallback(() => {
  const rail = railRef.current;
  if (!rail) return;
  setEdges({
   start: rail.scrollLeft <= 2,
   end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2,
  });
 }, []);

 useEffect(() => {
  updateEdges();
  const rail = railRef.current;
  if (!rail) return;
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateEdges) : null;
  observer?.observe(rail);
  rail.addEventListener('scroll', updateEdges, { passive:true });
  const onWheel = event => {
   if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && rail.scrollWidth > rail.clientWidth) {
    event.preventDefault();
    rail.scrollLeft += event.deltaY;
   }
  };
  rail.addEventListener('wheel', onWheel, { passive:false });
  window.addEventListener('resize', updateEdges);
  return () => {
   observer?.disconnect();
   rail.removeEventListener('scroll', updateEdges);
   rail.removeEventListener('wheel', onWheel);
   window.removeEventListener('resize', updateEdges);
  };
 }, [updateEdges, posts.length]);

 const scroll = direction => {
  const rail = railRef.current;
  if (rail) rail.scrollBy({ left: direction * rail.clientWidth * .8, behavior:'smooth' });
 };
 const onPointerDown = event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  dragRef.current = {
   id:event.pointerId,
   x:event.clientX,
   y:event.clientY,
   scrollLeft:railRef.current.scrollLeft,
   dragging:false,
  };
 };
 const onPointerMove = event => {
  const drag = dragRef.current;
  const rail = railRef.current;
  if (!drag || drag.id !== event.pointerId || !rail) return;
  const deltaX = event.clientX - drag.x;
  const deltaY = event.clientY - drag.y;
  if (!drag.dragging) {
   if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
   if (Math.abs(deltaY) > Math.abs(deltaX)) { dragRef.current=null; return; }
   drag.dragging=true;
   rail.classList.add('is-dragging');
   rail.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  rail.scrollLeft=drag.scrollLeft-deltaX;
 };
 const finishPointer = event => {
  const drag=dragRef.current;
  const rail=railRef.current;
  if (!drag || drag.id !== event.pointerId) return;
  dragRef.current=null;
  rail?.classList.remove('is-dragging');
  if (drag.dragging) {
   suppressClickRef.current=true;
   window.setTimeout(()=>{suppressClickRef.current=false},0);
  }
  if (rail?.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
 };
 const preventDraggedClick = event => {
  if (!suppressClickRef.current) return;
  event.preventDefault();
  event.stopPropagation();
  suppressClickRef.current=false;
 };
 if (!posts.length) return null;

 return <section className="section home-journal" aria-labelledby="home-journal-title">
  <div className="section-heading home-journal-heading">
   <div><p className="eyebrow">ЖУРНАЛ BOUTIQUE 5</p><h2 id="home-journal-title">Выбирайте своё</h2></div>
   <a className="text-link" href={withBase('/journal')} onClick={event=>{event.preventDefault();navigate('/journal')}}>Все подборки <span aria-hidden="true">↗</span></a>
  </div>
  <div className="journal-rail-wrap">
   <button className="journal-rail-control journal-rail-control-prev" type="button" aria-label="Прокрутить публикации назад" title="Назад" aria-controls="home-journal-rail" disabled={edges.start} onClick={()=>scroll(-1)}><ArrowLeft aria-hidden="true" size={19}/></button>
   <div className="journal-rail" id="home-journal-rail" ref={railRef} tabIndex={0} aria-label="Редакционные публикации" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={finishPointer} onPointerCancel={finishPointer} onLostPointerCapture={finishPointer} onClickCapture={preventDraggedClick} onDragStart={event=>event.preventDefault()}>
    {posts.map(post=>{
     const href=withBase(`/journal/${post.slug}`);
     const cover=withBase(post.coverImage?.src||FALLBACK_COVER);
     const alt=post.coverImage?.alt||`Обложка публикации «${post.title}»`;
     return <a className="journal-rail-card" href={href} key={post.slug} style={{backgroundImage:`url("${cover}")`}} onClick={event=>{event.preventDefault();navigate(`/journal/${post.slug}`)}} aria-label={`${post.title}. ${post.excerpt}`}>
      <img src={cover} alt={alt} loading="lazy" decoding="async" draggable="false" onError={event=>{const fallback=new URL(FALLBACK_COVER,window.location.origin).href;if(event.currentTarget.src!==fallback)event.currentTarget.src=FALLBACK_COVER}}/>
      <span className="journal-card-shade" aria-hidden="true"/>
      <span className="journal-rail-copy"><span className="journal-rail-kicker">ПОДБОРКА</span><span className="journal-rail-title">{post.title}</span><span className="journal-rail-excerpt">{post.excerpt}</span></span>
      <span className="journal-rail-arrow" aria-hidden="true">↗</span>
     </a>;
    })}
   </div>
   <button className="journal-rail-control journal-rail-control-next" type="button" aria-label="Прокрутить публикации вперёд" title="Вперёд" aria-controls="home-journal-rail" disabled={edges.end} onClick={()=>scroll(1)}><ArrowRight aria-hidden="true" size={19}/></button>
  </div>
 </section>;
}
