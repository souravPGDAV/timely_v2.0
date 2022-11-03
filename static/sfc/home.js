const home={
    template:`<div>
                

                
              <div class="container">                   
                <div class="alert alert-warning" role="alert" v-if="give_errors.length>0">
                    <ul>
                        <li v-for="item in give_errors">
                            {{item}}
                        </li>
                    </ul>
                </div>
                </div>
                
                <br>
                <div align="right">
                <div align="center">
                          <div class="spinner-border text-primary" role="status" v-if="!this.modal_loaded" align="center" p-6 my-5>
                            <span class="visually-hidden">Loading...</span>
                </div>
                

                <button class="btn btn-outline-primary" v-if="!(g_doing || logged_in)" v-on:click="g_signin()"><img width="20px" style="margin-top:0px;margin-left:0px; margin-right:4px" alt="Google sign-in" 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />Google</button>
                <button class="btn btn-outline-primary disabled" v-if="this.g_doing && !this.logged_in"><div class="spinner-border text-primary" role="status" align="center" p-6 my-5>
                            <span class="visually-hidden">Loading...</span></div></button>
                <!--button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#forgotPass" v-if="this.loaded && !ls_check" v-on:click="p_reset_modal()">I Forgot Password :( </button-->
                <button class="btn btn-primary" @click="$router.push('dashboard')" v-if="this.logged_in">My Dashboard</router-link></button>
                <button class="btn btn-primary" @click="g_signout()" v-if="this.logged_in">Sign Out</button>
            

                
                </div>
                <div v-if="this.logged_in">Welcome {{this.given_name}}!</div>
                <hr>
                <div class="btn-group" role="group" aria-label="Basic example" align="left">
                  <button type="button" class="btn  btn-outline-primary" :disabled="day_choice==-1" @click="day_choice=-1">Yesterday</button>
                  <button type="button" class="btn  btn-outline-primary" :disabled="day_choice==0"  @click="day_choice=0">Today</button>
                  <button type="button" class="btn btn-outline-primary" :disabled="day_choice==1"  @click="day_choice=1">Tomorrow</button>
                </div>
                <h4 align="center" v-if="day_choice==0">Today's Classes:</h4>
                <h4 align="center" v-if="day_choice==-1">Yesterday's Classes:</h4>
                <h4 align="center" v-if="day_choice==1">Tomorrow's Classes:</h4>
                <br>
                <div align="center">
                          <div class="spinner-border text-primary" role="status" v-if="!this.class_loaded" align="center" p-6 my-5>
                            <span class="visually-hidden">Loading...</span>
                </div>
                

                <p align="center" ><i>Next <b>TIMELY</b> Teacher of the Week is being chosen. WAIT FOR IT!</i></p>
                <div v-if="Object.keys(classes).length==0">Hurray! No classes here.</div>
                <div class="row row-cols-2 row-cols-md-2 g-4" align="center" v-if="Object.keys(classes).length>0">
                        
                        <div   v-for="t in classes">
                            
                                <class_card :class_details="t" ></class_card>
                                
                        </div >
                        
                </div>
                </div>

                </div>
                </div>

              </div>`
        ,
    data:function(){
        return {
            email:"",
            password:"",
            class_loaded:false,
            modal_loaded:true,
            email_pass:"",
            alert_class:"alert alert-danger",
            modal_errors:[],
            login_done:false,
            loaded:true,
            classes:{},
            p_errors:[],
            p_modal_loaded:true,
            p_done:false,
            today:0,
            y_classes:{},
            tom_classes:{},
            t_classes:{},
            day_choice:0,
            g_doing:false,
            logged_in:false,
            given_name:"",
            role:-1,
        }

    },

   async mounted(){
            // function init() {
            // gapi.load('auth2', function() {
            // /* Ready. Make a call to gapi.auth2.init or some other API */
            // });
            // }
            // gapi.auth2.init({client_id:'973193860513-5oplql8s9618p5ddith5f6v3h9089sjn.apps.googleusercontent.com'})

            var ifConnected = window.navigator.onLine;
            this.$store.commit('empty_error')
            this.loaded=false
            if (!ifConnected){this.$store.commit('add_error',"YOU ARE OFFLINE!");return}
            this.today=new Date().getDay()-1

            if (!('given_name' in localStorage)){
                var type = window.location.hash.substring(1);
                if(type && type.length>=1){
                    var temp=type.substring(type.indexOf("access_token"),)
                    var ttl=type.substring(type.indexOf("expires_in"),)
                    if(temp && temp.length>=1 && ttl){
                        var access_token=temp.substring(temp.indexOf("=")+1,temp.indexOf("&"))
                        ttl=ttl.substring(ttl.indexOf("=")+1,ttl.indexOf("&"))
                        // var item={
                        //     'access_token':access_token,
                        //     'expiry':ttl
                        // }
                         this.g_doing=true
                         fetch(this.$store.getters.get_base_url+"/api/g_signin",{
                            headers:{'Content-Type':'application/json','Authorization':'Bearer '+access_token},method:"GET"
                        }).then(resp=>{
                            // console.log('here, received resp=',resp.json())
                            return resp.json()
                        }).then(data=>{
                            console.log('recvd=',data)
                            if (!data){
                                this.$store.commit('add_error','You don\'t seem to require a login to this application. Use it wisely!')
                                this.logged_in=false;this.g_doing=false;
                                var a=this.$store.getters.get_base_url
                                setInterval(function(){window.location.href=a;return},3000);
                            }
                            if('given_name' in data){

                                localStorage.setItem('given_name',data.given_name)
                                localStorage.setItem('u_id',data.u_id)
                                localStorage.setItem('email',data.email)
                                localStorage.setItem('verified_email',data.verified_email)
                                localStorage.setItem('family_name',data.family_name)
                                localStorage.setItem('hd',data.hd)
                                localStorage.setItem('role',data.role)
                                localStorage.setItem('token',data.token)
                                if(data.role=="student"){
                                    localStorage.setItem('votes',data.votes)
                                }

                                
                                // console.log('localStorage m role=',localStorage.role,' and this.role=',this.role)   
                                console.log('setting a_token=',localStorage.token)
                                
                                this.given_name=localStorage.given_name 
                                window.location.href=this.$store.getters.get_base_url
                            }

                        })
                    }

                }
            }

            else{
                this.logged_in=true;this.given_name=localStorage.given_name;this.$store.commit('set_a_token',localStorage.token)   
                if(localStorage.role=="teacher"){this.role=0}
                else{
                    if(localStorage.role=="student"){this.role=1}
                }
             }
            
           




            var b={'get_day':0}

                    fetch(this.$store.getters.get_base_url+"/api/classes",{
                            headers:{'Content-Type':'application/json'},method:"PUT",body:JSON.stringify(b)})
                        .then(resp=>{
                            this.loaded=true
                            if(!resp.ok){
                                // console.log("not ok");
                            this.errors.push('Could not fetch all classes. Contact Sourav');return false;
                            }

                            else{return resp.json()}

                        })
                        .then(data=>{
                            this.classes={}
                            for (var i in data) {

                                // this.check=''//for getting others updated
                                
                                this.classes[data[i].class_id]=data[i]
                                
                                
                                // console.log(data[i])
                            }
                            this.class_loaded=true
                            this.$forceUpdate();
                        })

                
            
    },
    computed:{
        name:function(){
            // console.log('in store current user=',this.$store.getters.get_current_user)
            console.log('in local rendering')
            return localStorage.given_name
        },
    },
    watch:{
        day_choice:function(newVal,oldVal){
            // var g_d=-1
            // if(day_choice==0){g_d=0}
                    this.classes={}
                    var b={'get_day':newVal}
                    fetch(this.$store.getters.get_base_url+"/api/classes",{
                            headers:{'Content-Type':'application/json'},method:"PUT",body:JSON.stringify(b)})
                        .then(resp=>{
                            this.loaded=true
                            if(!resp.ok){console.log("not ok");this.errors.push('Could not fetch all classes. Contact Sourav');return false;
                            }

                            else{return resp.json()}

                        })
                        .then(data=>{
                            this.classes={}
                            for (var i in data) {

                                // this.check=''//for getting others updated
                                
                                this.classes[data[i].class_id]=data[i]
                                
                                
                                // console.log(data[i])
                            }
                            this.class_loaded=true
                            this.$forceUpdate();
                        })

                

            
                },
      },
    
    computed:{
        give_errors:function(){
            return this.$store.getters.errors
        },
        ls_check:function(){if(!('email' in localStorage) || localStorage.email=="null"){return false};return true},
        // active_classes:function(){
        //     if(this.day_choice==0){
        //     return this.t_classes}
        //     else{
        //         if(this.day_choice==-1){
        //             return this.y_classes
        //         }
        //         else{
        //             return this.tom_classes
        //         }
        //     }
        // },
    },
    
    methods:{
            modal_reset:function(){
                this.email="";this.password=""
            },
            g_signout:function(){
                
                localStorage.clear()
                window.location.href=this.$store.getters.get_base_url

            },
            g_signin:function(){
                this.g_doing=true
                var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

                  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
                  var form = document.createElement('form');
                  form.setAttribute('method', 'GET'); // Send as a GET request.
                  form.setAttribute('action', oauth2Endpoint);

                  // Parameters to pass to OAuth 2.0 endpoint.
                  var params = {'client_id': '973193860513-5oplql8s9618p5ddith5f6v3h9089sjn.apps.googleusercontent.com',
                                'redirect_uri': 'http://localhost:5000',
                                'response_type': 'token',
                                'scope': 'https://www.googleapis.com/auth/userinfo.profile',
                                'include_granted_scopes': 'true',
                                'prompt':'select_account',
                                'hd':'pgdav.du.ac.in',
                                'state': 'pass-through value'};

                  // Add form parameters as hidden input values.
                  for (var p in params) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'hidden');
                    input.setAttribute('name', p);
                    input.setAttribute('value', params[p]);
                    form.appendChild(input);
                  }

                  // Add form to page and submit it to open the OAuth 2.0 endpoint.
                  document.body.appendChild(form);
                  form.submit();
            },
            p_reset_modal:function(){
                this.email_pass=""
                this.p_modal_loaded=true
                this.p_errors=[]
                this.p_done=false
            },
            get_new_pass: function(){
            this.p_modal_loaded=false
            const data_sent = new URLSearchParams()

            data_sent.append('email',this.email_pass)
            fetch(this.$store.getters.get_base_url+"/reset",{ method:'POST',body: data_sent })
                 .then(resp=>{
                    if(!resp.ok){
                        console.log("not okf")
                        // console.log(resp)
                        // throw new Error();
                        
                        
                    }
                    return resp.text()})
                 .then(data=>{
                    var parser = new DOMParser();

                    var doc = parser.parseFromString(data, "text/html");
                    // console.log(doc)
                    var returns=doc.querySelector('li').innerHTML
                    if (returns[2]=='s'){

                        this.alert_class="alert alert-success"
                        this.p_done=true
                    }
                    this.p_errors=[]
                    this.p_errors.push(returns)
                    this.p_modal_loaded=true
                })
            },
            loginSubmit: async function(){
                var ifConnected = window.navigator.onLine;
            
            if(ifConnected){

            this.modal_loaded=false
            var data={'email':this.email, 'password':this.password}


                //logging out already logged in sessions, if any
                await fetch(this.$store.getters.get_base_url+"/logout")
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
                fetch(this.$store.getters.get_base_url+"/login?include_auth_token",{ method:'POST',
                     headers:{'Content-Type':'application/json'},body: JSON.stringify(data) })
                 .then(resp=>{
                    if(!resp.ok){
                        console.log("not okf")
                        
                        
                    }
                    return resp.json()})
                 .then(data=>{

                    this.$store.commit('empty_error')//preparing for adding new errors, if any
                    
                    if('errors' in data.response){
                        this.modal_loaded=true
                        if('password' in data.response.errors){
                                this.$store.commit('empty_error')
                            this.$store.commit('add_error','Incorrect Credentials')
                            setTimeout(()=>this.$store.commit('empty_error'),4000)
                                
                        }
                        else if('email' in data.response.errors){
                            this.$store.commit('empty_error')
                            this.$store.commit('add_error','Incorrect Credentials')
                            setTimeout(()=>this.$store.commit('empty_error'),4000)
                        }
                    }
                    else if('user' in data.response){//correct credentials

                        this.$store.commit('set_a_token',data.response.user['authentication_token'])
                        localStorage.setItem('a_token',data.response.user['authentication_token'])
                        fetch(this.$store.getters.get_base_url+"/api/user",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"GET"})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");throw new Error();

                            }

                        return resp.json()})
                        .then(data=>{   

                            if(data){
                                // console.log(data)
                                this.$store.commit('set_auth',true)
                                // localStorage.setItem('set_auth',true)
                                localStorage.setItem('password',this.password)
                                localStorage.setItem('email',this.email)
                                for(var i in data){this.$store.commit('set_current_user',data[i]);localStorage.setItem('user',JSON.stringify(data[i])) }
                                this.modal_loaded=true
                                this.$store.commit('empty_error')
                                this.$store.commit('add_error',"Login Successful!")
                                setTimeout(()=>this.$store.commit('empty_error'),4000)
                                this.login_done=true
                                this.alert_class="alert alert-success"
                                this.$router.push({ name: 'dashboard' })

                            }                       
                        }).catch(error=>{
                            this.loaded=true
                            this.$store.commit('empty_error')
                            setTimeout(()=>this.$store.commit('empty_error'),4000)
                            this.errors=[]
                            this.$store.commit('add_error','Internal server Error. Try Again Later.')
                            // console.log("caught!")
                            // console.log(error)
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