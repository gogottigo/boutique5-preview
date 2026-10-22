import React, { useEffect, useRef, useState } from 'react';
import { UserRound, X } from 'lucide-react';

export default function TryOnPanel({ open, onClose, image, productName, triggerRef }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setStatus('');

    const previousFocus = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...(panelRef.current?.querySelectorAll('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])') || [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
      document.documentElement.style.overflow = previousDocumentOverflow;
      if (triggerRef?.current) triggerRef.current.focus();
      else if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open]);

  const handleTryOn = () => {
    // TODO: connect the approved virtual try-on service here.
    setStatus('Виртуальная примерка пока недоступна. Подключение сервиса не выполнено.');
  };

  return <div className={`tryon-overlay${open ? ' is-open' : ''}`} aria-hidden={!open} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="tryon-panel" ref={panelRef} role="dialog" aria-modal={open || undefined} aria-labelledby="tryon-title" inert={!open}>
      <div className="tryon-topbar">
        <button className="tryon-profile" type="button" disabled aria-label="Профиль — авторизация пока не подключена" title="Авторизация пока не подключена"><UserRound aria-hidden="true"/></button>
        <button className="tryon-close" type="button" ref={closeRef} onClick={onClose} aria-label="Закрыть онлайн-примерку"><X aria-hidden="true"/></button>
      </div>
      <h2 id="tryon-title" className="tryon-title">Онлайн-примерка</h2>
      <div className="tryon-image-wrap"><img src={image} alt={`Демонстрационное изображение товара «${productName}»`} /></div>
      <div className="tryon-controls">
        <button className="tryon-submit" type="button" onClick={handleTryOn}>Примерить</button>
        {status && <p className="tryon-status" role="status">{status}</p>}
        <div className="tryon-footer"><span>Powered by Dresscode AI</span><button type="button" disabled title="Управление данными пока не подключено">Мои данные</button></div>
      </div>
    </section>
  </div>;
}
