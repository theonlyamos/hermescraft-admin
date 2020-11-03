const filterByCategory = (e)=>{
  const category = $(e).val()
  if (window.location.search)
    window.location.href= `/products/${window.location.search}&category=${category}`
  else
    window.location.href= `/products?category=${category}`
  
}
$(()=>{
  
})