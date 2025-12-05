// Public script: define una API simple de carrito en window.Cart
(function(){
  const KEY = 'shop_cart_v1';
  function read(){
    try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch(e){ return []; }
  }
  function write(c){
    localStorage.setItem(KEY, JSON.stringify(c));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: c }));
    // También emitimos evento por compatibilidad
    try{ document.dispatchEvent(new CustomEvent('cart-updated', { detail: c })); } catch(e){}
  }

  const Cart = {
    get(){ return read(); },
    add(item){
      const c = read();
      const idx = c.findIndex(x => x.id === item.id);
      if (idx >= 0) { c[idx].quantity = (c[idx].quantity || 1) + (item.quantity || 1); }
      else { c.push({ ...item, quantity: item.quantity || 1 }); }
      write(c);
    },
    update(id, quantity){
      const c = read();
      const idx = c.findIndex(x => x.id === id);
      if (idx >= 0) {
        if (quantity <= 0) c.splice(idx,1);
        else c[idx].quantity = quantity;
        write(c);
      }
    },
    remove(id){
      const c = read().filter(x => x.id !== id);
      write(c);
    },
    clear(){ write([]); }
  };

  window.Cart = Cart;

  // Handler global para botones "add-to-cart" delegados
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.add-to-cart');
    if (!btn) return;
    const dataset = btn.dataset || {};
    const item = {
      id: dataset.id,
      title: dataset.title,
      price: parseFloat(dataset.price || '0') || 0,
      image: dataset.image || '',
      quantity: 1
    };
    Cart.add(item);
    // Pequeña animación de confirmación
    btn.classList.add('btn-success');
    setTimeout(() => btn.classList.remove('btn-success'), 350);
  });
})();
