export default {
   install: (Vue) => {
     Vue.prototype.$format = {
       price(amount) {
         if (amount) {
           return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
         }
       },
       date(date) {
         if (date) {
           return date.toDate().toLocaleDateString('th')
         }
       },
     };
   }
 };