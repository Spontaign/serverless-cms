import Vue from "vue";
import Router from "vue-router";

import Home from './components/Home.vue';

import Publish from './components/Publish.vue';

import Pages from './components/Pages.vue';
import Page from './components/Page.vue';
import PageNew from './components/PageNew.vue';

import Snippets from './components/Snippets.vue';
import Snippet from './components/Snippet.vue';
import SnippetNew from './components/SnippetNew.vue';

import Layouts from './components/Layouts.vue';
import Layout from './components/Layout.vue';
import LayoutNew from './components/LayoutNew.vue';

import Assets from './components/Assets.vue';
import Asset from './components/Asset.vue';
import AssetNew from './components/AssetNew.vue';

import Products from './components/Products.vue';
import Product from './components/Product.vue';
import ProductFeatures from './components/ProductFeatures.vue';
import ProductNew from './components/ProductNew.vue';

import Header from './components/Header.vue';

import Images from './components/Images.vue';
import ImageNew from './components/ImageNew.vue';

import Settings from './components/Settings.vue';

Vue.use(Router);

export const router = new Router({ 
    mode: "history",
    routes: [
        { 
            path: '', 
            name: 'home', 
            components: {
                default: Home,
                'header-top': Header
            },
            meta: {
                title:'AWS Simple CMS Admin Module',
                requiresAuth: false
            } 
        },
        { 
            path: '/publish', 
            name: 'publish',
            components: {
                default: Publish,
                'header-top': Header
            },
            meta: {
                title:'Publish',
                requiresAuth: true
            } 
        },          
        { 
            path: '/pages', 
            name: 'pages',
            components: {
                default: Pages,
                'header-top': Header
            },
            meta: {
                title:'All Pages',
                requiresAuth: true
            } 
        },  
        { 
            path: '/page/:id', 
            name: 'page',
            components: {
                default: Page,
                'header-top': Header
            },
            meta: {
                title:'Page',
                requiresAuth: true
            } 
        },        
        { 
            path: '/page-new', 
            name: 'PageNew',
            components: {
                default: PageNew,
                'header-top': Header
            },
            meta: {
                title:'New Page',
                requiresAuth: true
            } 
        },                     
        { 
            path: '/snippets', 
            name: 'snippets',
            components: {
                default: Snippets,
                'header-top': Header
            },
            meta: {
                title:'All Snippets',
                requiresAuth: true
            } 
        },  
        { 
            path: '/snippet/:id', 
            name: 'snippet',
            components: {
                default: Snippet,
                'header-top': Header
            },
            meta: {
                title:'Snippet',
                requiresAuth: true
            } 
        },   
        { 
            path: '/snippet-new', 
            name: 'snippetNew',
            components: {
                default: SnippetNew,
                'header-top': Header
            },
            meta: {
                title:'Create New Snippet',
                requiresAuth: true} 
        },       
        { 
            path: '/layouts', 
            name: 'layouts',
            components: {
                default: Layouts,
                'header-top': Header
            },
            meta: {
                title:'All Layouts',
                requiresAuth: true
            } 
        },  
        { 
            path: '/layout/:id', 
            name: 'layout',
            components: {
                default: Layout,
                'header-top': Header
            },
            meta: {
                title:'Layout',
                requiresAuth: true
            } 
        },  
        { 
            path: '/layout-new', 
            name: 'layoutNew',
            components: {
                default: LayoutNew,
                'header-top': Header
            },
            meta: {
                title:'Create New Template',
                requiresAuth: true} 
        },   
        { 
            path: '/assets', 
            name: 'assets',
            components: {
                default: Assets,
                'header-top': Header
            },
            meta: {
                title:'All Assets',
                requiresAuth: true
            } 
        },  
        { 
            path: '/asset/:id', 
            name: 'asset',
            components: {
                default: Asset,
                'header-top': Header
            },
            meta: {
                title:'Asset',
                requiresAuth: true
            } 
        },  
        { 
            path: '/asset-new', 
            name: 'assetNew',
            components: {
                default: AssetNew,
                'header-top': Header
            },
            meta: {
                title:'Create New Template',
                requiresAuth: true} 
        },   
        { 
            path: '/products', 
            name: 'products',
            components: {
                default: Products,
                'header-top': Header
            },
            meta: {
                title:'All Products',
                requiresAuth: true
            } 
        },  
        { 
            path: '/product/:id', 
            name: 'product',
            components: {
                default: Product,
                'header-top': Header
            },
            meta: {
                title:'Product',
                requiresAuth: true
            } 
        },  
        { 
            path: '/product-features/:id', 
            name: 'productFeatures',
            components: {
                default: ProductFeatures,
                'header-top': Header
            },
            meta: {
                title:'Product Features',
                requiresAuth: true
            } 
        },          
        { 
            path: '/product-new', 
            name: 'productNew',
            components: {
                default: ProductNew,
                'header-top': Header
            },
            meta: {
                title:'Create New Template',
                requiresAuth: true} 
        },  
        { 
            path: '/settings', 
            name: 'settings',
            components: {
                default: Settings,
                'header-top': Header
            },
            meta: {
                title:'Settings',
                requiresAuth: true} 
        },   
        { 
            path: '/images', 
            name: 'images',
            components: {
                default: Images,
                'header-top': Header
            },
            meta: {
                title:'Images',
                requiresAuth: true} 
        },   

        { 
            path: '/image-new', 
            name: 'imageNew',
            components: {
                default: ImageNew,
                'header-top': Header
            },
            meta: {
                title:'Upload New Image',
                requiresAuth: true} 
        },   

        { path: '*', redirect: '/' }
    ]
});


router.beforeResolve(async (to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      console.log("about to check for authentication...")
      await Vue.prototype.$Amplify.Auth.currentAuthenticatedUser();
      console.log("passed auth...")
      next();
    } catch (e) {
      console.log("failed auth...")
      next({
        path: "/",
        query: {
          redirect: to.fullPath
        }
      });
    }
  }
  next();
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

