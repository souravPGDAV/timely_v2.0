const home={
    template:`<div>
                <div class="container">
                <div class="modal fade" id="login" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" >Login</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                      <div :class="alert_class" role="alert" v-if="this.errors.length>0">
                            <ul>
                                <li v-for="item in this.errors">
                                    {{item}}
                                </li>
                            </ul>
                      </div>

                            <div class="row">
                            <div class="col-sm">

                           <label>Email:
                            <input type="text" v-model="email" required :disabled="!this.modal_loaded"/>
                            </label>
                            </div>
                            
                            <div class="col-sm">
                            <label>Password:
                            <input type="password" v-model="password" :disabled="!this.modal_loaded" required/>
                            </label>
                            </div>
                            </div>
                      </div>
                      <div class="modal-footer">
                          <div class="spinner-border text-primary" role="status" v-if="!this.modal_loaded" align="center" p-6 my-5>
                            <span class="visually-hidden">Loading...</span>
                            </div>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="reset_modal()" v-if="this.modal_loaded">Close</button>
                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="loginSubmit()" v-if="this.modal_loaded">LOGIN</button>
                        
                      </div>
                    </div>
                  </div>
                </div>

                </div>
              <div class="container">                   
                <div class="alert alert-warning" role="alert" v-if="give_errors.length>0 && this.loaded">
                    <ul>
                        <li v-for="item in give_errors">
                            {{item}}
                        </li>
                    </ul>
                </div>
                <br>
                <div align="right">
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#login" v-if="this.loaded">Login</button>
                
                <button class="btn btn-primary" @click="$router.push('register')">Unregistered?</router-link></button>
                </div>
                <hr>
                <h4 align="center">Today's Classes:</h4>
                <br>
                    <div class="row row-cols-2 row-cols-md-2 g-4">
                        
                        <div  v-for="x in classes">
                                <o_class_card :class_details="x"></o_class_card>
                        </div>
                    </div>
                </div>
              </div>`
        ,
    data:function(){
        return {
            email:"",
            password:"",
            modal_loaded:true,
            email_pass:"",
            alert_class:"alert alert-danger",
            errors:[],
            done:false,
            loaded:true,
            classes:{},
        }
    },
   async mounted(){
            fetch("http://localhost:5000/api/classes",{
                            headers:{'Content-Type':'application/json'},method:"GET"})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");this.errors.push('Could not fetch all classes. Contact Sourav');return false;
                            }

                            else{return resp.json()}

                        })
                        .then(data=>{
                            for (var i in data) {
                                // this.check=''//for getting others updated
                                this.classes[data[i].class_id]=data[i]
                                console.log(data[i])
                            }
                            
                            this.$forceUpdate();
                        })

            
    },
    
    computed:{
        give_errors:function(){
            return this.$store.getters.errors
        }
    },

    methods:{
            loginSubmit: async function(){
                var ifConnected = window.navigator.onLine;
            
            if(ifConnected){

            this.loaded=false
            var data={'email':this.email, 'password':this.password}


                //logging out already logged in sessions, if any
                await fetch("http://localhost:5000/logout")
                 .then(resp=>{
                    if(!resp.ok){
                        console.log("not ok")
                    }
                    return resp.text()})
                 .then(data=>{
                    
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(data, "text/html");
                    var title=doc.querySelector('title').innerHTML
                    if(title=="Home Page"){
                        console.log("succes slog out")
                        
                        this.$store.commit('set_auth',false)
                        this.$store.commit('set_a_token',"")
                        
                    }
                    
                })
                
                //fetching the auth token now
                fetch("http://localhost:5000/login?include_auth_token",{ method:'POST',
                     headers:{'Content-Type':'application/json'},body: JSON.stringify(data) })
                 .then(resp=>{
                    if(!resp.ok){
                        console.log("not okf")
                        
                        
                    }
                    return resp.json()})
                 .then(data=>{

                    this.$store.commit('empty_error')//preparing for adding new errors, if any
                    
                    if('errors' in data.response){
                        this.loaded=true
                        if('password' in data.response.errors){
                                this.errors=[]
                                this.errors.push('Incorrect Credentials')
                                
                        }
                        else if('email' in data.response.errors){
                            this.errors=[]
                            this.errors.push('Incorrect Credentials')
                        }
                    }
                    else if('user' in data.response){//correct credentials

                        this.$store.commit('set_a_token',data.response.user['authentication_token'])
                        
                        fetch("http://localhost:5000/api/user",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"GET"})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");throw new Error();

                            }

                        return resp.json()})
                        .then(data=>{   

                            if(data){
                                console.log(data)
                                this.$store.commit('set_auth',true)
                                for(var i in data){this.$store.commit('set_current_user',data[i]) }
                                
                                this.$router.push({ name: 'dashboard' })
                                this.loaded=true
                            }                       
                        }).catch(error=>{
                            this.loaded=true
                            this.$store.commit('empty_error')
                            this.errors=[]
                            this.errors.push('Internal server Error. Try Again Later.')
                            // console.log("caught!")
                            console.log(error)
                         });
                    }
                
                })
                
            }
            else{
                this.$store.commit('empty_error')
                this.$store.commit('add_error','You\'re offline')
                console.log("not connected")
            }

            },
        },
            
    }

export default home;