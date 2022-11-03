const register={
    template:`
    
        <div>
        <div class="alert alert-warning" role="alert" v-if="this.errors_comp.length>0">
                    <ul>
                        <li v-for="item in this.errors_comp">
                            {{item}}
                        </li>
                    </ul>
                </div>
        <div class="container mt-1" >
            <h3 align="center" class ="display-6">Teacher Registration</h3>
        </div>
        <div v-if="loaded==false">
            <div class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
        </div>
        <div class="container p-2 my-5 border" align="center" v-if="loaded!=false && all_registered==false">
            
            
            <h6>The Teacher Code provided to you was:</h6>
            <select @change="teacher_selected">
                <option value="-1">T_CODE</option>
                <option v-for="t in all_teachers" :value="t.t_id">{{t.t_id}}</option>
            </select>

            


            <div v-if="current_teacher">
                <h5>Welcome {{current_teacher.fname}}!</h5>
                <form v-on:submit="registerSubmit();"  id="login" >
                    <div class="container">
                        <div class="row">
                            <div class="col-sm">
                                <label>Firstname:
                                    <input type="text" name="fname" v-model="current_teacher.fname" disabled required/>
                                </label>
                            </div>
                            <div class="col-sm">
                                <label>Lastname:
                                    <input type="text" name="lname" v-model="current_teacher.lname" disabled/>
                                </label>
                            </div>
                            <div class="col-sm">
                                <label>Subject:
                                    <input type="text" name="subject" v-model="current_teacher.subject" disabled/>
                                </label>
                            </div>
                        </div>
                    <div class="row p-3">
                        <div class="col-sm">
                            <label>Email:     
                                <input type="email" v-model="email" :disabled="!loaded" required/>
                            </label>
                        </div>
                        <div class="col-sm">
                            <label>Password:
                                <input type="password" v-model="password" :disabled="!loaded" required/><br><br>
                            </label>
                        </div>
                    </div>
                    <div class="row">
                        <input type="submit" value="Submit" class="btn btn-primary" v-if="loaded">
                        <div v-if="loaded==false">
                            <div class="text-center">
                              <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>


                     
                </form>
            </div>        
        </div>
        <div class="container p-2 my-5 border" align="center" v-if="all_registered==true">

        All registrations already done!

        </div>

        <div id="guidelines" v-if="this.selection!=-1">
            <h4>{{heading}}</h4>
            <ol start="I"> 
                <li v-for="condition in this.conditions">
                    {{condition}}
                </li>
            </ol>
        </div>


    </div>
    </div>`,
    data:function(){
            return{
                selection:-1,
                conditions:[],
                all_good:[true,true,true,false],
                email:"",
                fname:"",
                lname:"",
                password:"",
                heading:"",
                errors_comp:[],
                loaded:true,
                all_registered:false,
                current_teacher:null,
                all_teachers:[]
            }
        
        },
    mounted(){
        // this.$store.commit('reset_cards_for_revision')
        // this.$store.commit('reset_decks_for_revision')
        // this.$parent.log_out(false)
        this.get_t_details()
        this.loaded=false
    },
    
    
    methods:{

       get_t_details:async function(e){
                    fetch("http://localhost:5000/api/teachers")
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");console.log(resp.json());throw new Error();
                            }

                            else{return resp.json()}
                        })
                        .then(data=>
                            
                            {for(var i in data){
                                if (!data[i]['registered']){
                                    console.log("this is unregistered=",data[i])
                                    this.all_registered=false
                                    this.all_teachers.push(data[i])
                                }

                            }
                            this.loaded=true
                            
                    })
                        // .catch(error=>{this.errors_main.push('Sorry! Registration is experiencing some errors at this moment. Try Later.')})
                                

       },
       teacher_selected(event){
            if(event.target.value==-1){this.current_teacher=null;return}
            this.loaded=false
            console.log('in func')
            for(var i in this.all_teachers){
                
                if(this.all_teachers[i].t_id==event.target.value){
                    console.log('here')
                    this.current_teacher=this.all_teachers[i]
                    break
                }
            }

            if(this.current_teacher==null){
                this.$store.commit('empty_error')
                this.$store.commit('add_error','Some internal error. Contact Sourav!')
                this.$router.push({name:'home'})
            }
            this.loaded=true
       },
       registerSubmit:function(e){
           this.loaded=false 
           this.errors_comp=[]
           // if(this.all_good[0]==false || this.all_good[1]==false || this.all_good[2]==false|| this.all_good[3]==false){
           //  // this.errors_comp.push("Cannot Submit... be mindful of fulfilling the conditions")
           //  // this.loaded=true
           //  continue
           // }
           // else{
            
            const data = new URLSearchParams()
            data.append('email',this.email)
            data.append('password',this.password)
            data.append('password_confirm',this.password)
            data.append('t_id',this.current_teacher.t_id)
            
            
            fetch("http://localhost:5000/register",{ method:'POST',
                 body: data })
             .then(resp=>{
                this.loaded=true
                if(!resp.ok){
                    this.errors_comp.push("Could not register. Try Contacting Sourav")
                }
                else{return resp.text()}
                })
             .then(data=>{
                
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");
                var returns=doc.querySelector('ul')
                if (returns){this.errors_comp.push(returns.querySelector('li').innerHTML)}
                else{
                    
                    var title=doc.querySelector('title').innerHTML
                    if(!title){
                        this.errors_comp.push("Could not register. Try Contacting Sourav")
                    }


                        this.$store.commit('empty_error')
                        this.$store.commit('add_error','Successfully registered.')
                        this.$router.push({name:'home'})
                    }
                

                })
           // }


            // event.preventDefault();
       }
    },
    // watch:{
        
    //     password:function(val){
    //         this.selection=1
    //         this.conditions=this.$parent.password_check(val)
    //         if(this.conditions.length==0){
    //             this.selection=4
    //             this.all_good[3]=true
    //             }
    //         else{this.all_good[3]=false}
    //     },
    //     email:function(val){
    //         this.selection=5
    //         this.conditions=[]
    //     },
    //     selection:function(newVal,oldVal){
    //         var headings=["Fulfill these conditions for email", "Fulfill these conditions for password","Fulfill these conditions for First name","Fulfill these conditions for Last Name","Good to go",""]
    //         this.heading=headings[newVal]
    //     }
    // },
}


export default register;


