import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, MoreHorizontal, Send, X } from 'lucide-react';

const initialMessages = [
  { id: 'welcome', from: 'support', text: 'Здравствуйте! Поможем с выбором размера, расскажем о коллекции и ответим на вопросы.', time: 'Сейчас' },
];

const quickReplies = ['Подобрать размер', 'Доставка и возврат'];

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const closeTimer = useRef(null);

  const close = () => {
    if (!open || closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }, 180);
  };

  const show = () => {
    setClosing(false);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const send = value => {
    const text = value.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setMessages(current => [...current, { id: `${Date.now()}-user`, from: 'visitor', text, time: now }]);
    setDraft('');
  };

  return <div className="support-chat">
    {open && <section className={`support-panel${closing ? ' is-closing' : ''}`} role="dialog" aria-modal="false" aria-labelledby="support-chat-title">
      <header className="support-header">
        <span className="support-mark" aria-hidden="true">B5</span>
        <div className="support-heading">
          <h2 id="support-chat-title">Поддержка BOUTIQUE 5</h2>
          <p><span className="support-online-dot"/>На связи</p>
        </div>
        <button className="support-action" type="button" aria-label="Начать новый диалог" title="Начать новый диалог" onClick={() => setMessages(initialMessages)}><MoreHorizontal aria-hidden="true"/></button>
        <button className="support-action support-close" type="button" aria-label="Закрыть чат" title="Закрыть чат" onClick={close}><X aria-hidden="true"/></button>
      </header>

      <div className="support-messages" aria-live="polite" aria-label="Сообщения чата">
        <p className="support-date-divider">Сегодня</p>
        {messages.map(message => <div className={`support-message-row is-${message.from}`} key={message.id}>
          {message.from === 'support' && <span className="support-avatar" aria-hidden="true">B5</span>}
          <div className="support-message-wrap"><p className="support-message">{message.text}</p><time>{message.time}</time></div>
        </div>)}
        {messages.length === 1 && <div className="support-quick-replies">{quickReplies.map(reply=><button key={reply} type="button" onClick={()=>send(reply)}>{reply}</button>)}</div>}
      </div>

      <form className="support-composer" onSubmit={event=>{event.preventDefault();send(draft)}}>
        <label className="support-composer-label" htmlFor="support-chat-input">Сообщение</label>
        <input ref={inputRef} id="support-chat-input" type="text" autoComplete="off" placeholder="Напишите сообщение…" value={draft} onChange={event=>setDraft(event.target.value)}/>
        <button type="submit" aria-label="Отправить сообщение" title="Отправить" disabled={!draft.trim()}><Send aria-hidden="true"/></button>
      </form>
      <p className="support-demo-note">Демонстрационный чат · сообщения не отправляются</p>
    </section>}

    {!open && <button ref={triggerRef} className="support-launcher" type="button" aria-label="Открыть чат поддержки" title="Чат поддержки" onClick={show}><MessageCircle aria-hidden="true"/></button>}
  </div>;
}
