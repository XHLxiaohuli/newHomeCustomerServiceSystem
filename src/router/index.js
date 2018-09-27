import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Impage from '@/pages/impage'
import cookie from '@/assets/js/public/cookie'

Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       component: Index
//     },
//     {
//       path: '/impage',
//       component: Impage
//     }
//   ]
// })

const router = new Router({
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/impage',
      component: Impage
    }
  ]
});

// 全局路由守卫
router.beforeEach((to, from, next) => {

  // 登入状态
  // if(cookie.getCookie('userKey') == null && to.path !== '/'){
  //   router.push({ path:'/' });
  //   next();
  //   return;
  // }
  
  next();
});


export default  router;