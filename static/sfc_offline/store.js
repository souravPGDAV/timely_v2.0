
// Create a new store instance.
const store = new Vuex.Store({
  state: {
    errors:[],
    authenticated:false,
    a_token:"",
    all_registered:0,
    current_user:null,
  },
  mutations: {
    set_auth(state,b){
        state.authenticated=b
    },
    set_a_token(state,e){
        state.a_token=e
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
        state.current_user=e
    },
  },
  getters: {
    errors: function(state) {
        return state.errors
    },
    
    authentication_status: function(state){
        return state.authenticated
    },
    get_a_token:function(state){
        return state.a_token
    },
    get_all_registered(state){
        return state.all_registered
    },
    get_current_user(state){
        return state.current_user
    },
    
  },
  
})
export default store;