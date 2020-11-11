const filterByCategory = (e)=>{
  const category = $(e).val()
  if (window.location.search)
    window.location.href= `/products/${window.location.search}&category=${category}`
  else
    window.location.href= `/products?category=${category}`
  
}
$(()=>{
  $("#confirm_delete_modal").on("show.bs.modal", (e)=>{
    const button = $(e.relatedTarget)[0];

    let product = $(button).data('product');
    const url = $(button).data('url');
    if (!product){
        product = "the selected item(s)"
    }

    const modal = $(e.target);
    modal.find('.product_name').html(product);
    modal.find(".modal-footer button[type='submit']").attr('onclick', `window.location.href='${url}'`)
  })

})