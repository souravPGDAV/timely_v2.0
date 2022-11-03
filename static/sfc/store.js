// import createPersistedState from "vuex-persistedstate";

// Create a new store instance.
const store = new Vuex.Store({
  state: {
    errors:[],
    authenticated:false,
    a_token:"",
    all_registered:0,
    current_user:null,
    base_url:"",
  },
  // plugins: [Vuex.createPersistedState],
  mutations: {
    set_auth(state,b){
        state.authenticated=b
        // document.cookie = "authenticated="+String(b);
        // localStorage.setItem('authenticated', b);
    },
    set_a_token(state,e){
        console.log('setting a_token=',e)
        state.a_token=e
        // document.cookie = "a_token="+String(e);
        // localStorage.setItem('a_token', e);
    },
    set_all_registered(state,e){
        //0 for Not set, 1 for yes all done, -1 not all done
        state.all_registered=e
    },
    empty_error(state){
        state.errors=[]
    },
    add_error(state,e){
        state.errors.push(e)
    },
    set_current_user(state,e){
        // document.cookie = "current_user="+e;
        // localStorage.setItem('current_user', JSON.stringify(e));
        state.current_user=e
    },
    set_base_url(state,e){
      state.base_url=e
    }
  },
  getters: {
    errors: function(state) {
        return state.errors
    },
    
    authentication_status: function(state){
        
        return state.authenticated
    },
    get_a_token:function(state){
        console.log('sending a_token=',state.a_token)
        return state.a_token
    },
    get_all_registered(state){
        return state.all_registered
    },
    get_current_user(state){
        return state.current_user
    },
    get_base_url(state){
        return state.base_url
    },
  },
  
})
export default store;