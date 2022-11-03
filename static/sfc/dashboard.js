const dashboard={
    template:`
       <div>
        <div v-if="!is_cr">
            <!--For DELETING_USER-->
                <div class="modal fade" id="deleteUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="false" >
                
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" >Delete Account</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          <h3 >Sure about deleting your account?</h3>
                          
                          
                      </div>
                      <div class="modal-footer" >
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="delete_user_confirmed()" >YES</button>
                        
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">NO</button>
                      </div>
                    </div>
                  </div>
                </div>


            <div class="modal fade" id="new_class" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="false" >
                
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">New Class</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                            <div :class="alert_class" role="alert" v-if="this.updateErrors.length>0">
                                <ul>
                                    <li v-for="item in this.updateErrors">
                                        {{item}}
                                    </li>
                                </ul>
                            </div>
                          <form v-if="updateDone==false">
                            <label>Room:</label>
                            <input type="number" step="1" min="0" name="room" v-model="room" :disabled="!enable_updateForm" required/><br><br>
                            <label>Start Time:</label>
                            
                            <input type="time" name="start_time" :disabled="!enable_updateForm" v-model="start_time"  required/><br><br>
                            
                            <label>End Time: </label>
                            
                            <input type="time" m v-model="end_time" :disabled="!enable_updateForm" required/><br><br>

                          </form>
                          
                          <div v-if="enable_updateForm==false && updateDone==false">
                            <div class="text-center">
                              <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                         </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click="add_class_confirmed()" v-if="this.enable_updateForm">ADD</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CLOSE</button>
                      </div>
                    </div>
                  </div>
                </div>

            <h4 align="right">USER: {{current_user.fname}} {{current_user.lname}}{{check}}</h4>

            <div align="center">
            <div class="btn-group" role="group" aria-label="Basic outlined example" align="center" >
                <button type="button" class="btn btn-outline-primary" id="scheduleClass"  v-if="ls_check" data-bs-toggle="modal" data-bs-target="#new_class" v-on:click="reset_add_data()">+Add Class</button>
                <button class="btn btn-outline-primary" data-bs-toggle="modal" v-if="ls_check" data-bs-target="#deleteUser">Delete Account</button>
                <button class="btn btn-outline-primary" v-on:click="log_out();" v-if="ls_check" >Log Out</button>
                <button class="btn btn-primary" v-on:click="go_to_home">Home</button>
            </div>
            </div>
            <hr>
            <div align="right">
            <div class="btn-group" role="group" aria-label="Basic example" align="right">
              <button type="button" class="btn  btn-outline-primary" :disabled="day_choice==-1" @click="day_choice=-1">Yesterday</button>
              <button type="button" class="btn  btn-outline-primary" :disabled="day_choice==0"  @click="day_choice=0">Today</button>
              <button type="button" class="btn btn-outline-primary" :disabled="day_choice==1"  @click="day_choice=1">Tomorrow</button>
            </div>
            </div>
            <h4 align="center" v-if="day_choice==0">Today's Classes:</h4>
            <h4 align="center" v-if="day_choice==-1">Yesterday's Classes:</h4>
            <h4 align="center" v-if="day_choice==1">Tomorrow's Classes:</h4>
            
            <div align="center">
              <div class="spinner-border text-primary" role="status" v-if="!this.class_loaded" align="center" p-6 my-5>
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <p align="center"><i>Become the next <b>TIMELY</b> Teacher of the Week by timely confirming/aborting the classes & sticking to them!</i></p>
            <div v-if="Object.keys(classes).length==0" align="center">Hurray! No classes here.</div>
            <div class="row row-cols-2 row-cols-md-2 g-4" align="center" v-if="Object.keys(classes).length>0">
            
            
            <div  v-for="x in classes">
                                <class_card :class_details="x"></class_card>
            </div>

            </div>
            </div>

            <div v-if="is_cr">

            <h4 align="right">USER: {{current_user.fname}} {{current_user.lname}}{{check}}</h4>
            <div align="center">
            <div class="btn-group" role="group" aria-label="Basic outlined example" align="center" >
                <button class="btn btn-outline-primary" data-bs-toggle="modal" v-if="ls_check" data-bs-target="#deleteUser">Delete Account</button>
                <button class="btn btn-outline-primary" v-on:click="log_out();" v-if="ls_check" >Log Out</button>
                <button class="btn btn-primary" v-on:click="go_to_home">Home</button>
            </div>
            </div>
            <hr>
            
            <div align="right">
            <div class="btn-group" role="group" aria-label="Basic example" align="center">
              <button type="button" class="btn  btn-outline-primary" :disabled="day_choice==-1" @click="day_choice=-1">Yesterday</button>
              <button type="button" class="btn  btn-outline-primary" :disabled="day_choice==0"  @click="day_choice=0">Today</button>
              <button type="button" class="btn btn-outline-primary" :disabled="day_choice==1"  @click="day_choice=1">Tomorrow</button>
            </div>
            </div>
            
            <br>
            <h4 align="center" v-if="day_choice==0">Today's Classes:</h4>
            <h4 align="center" v-if="day_choice==-1">Yesterday's Classes:</h4>
            <h4 align="center" v-if="day_choice==1">Tomorrow's Classes:</h4>
            
            <div align="center">
              <div class="spinner-border text-primary" role="status" v-if="!this.class_loaded" align="center" p-6 my-5>
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <p align="center"><i>You are the lifeline of <b>TIMELY</b>. Help us get this better!</i></p>
            <div v-if="Object.keys(classes).length==0" align="center">Hurray! No classes here.</div>
            <div class="row row-cols-2 row-cols-md-2 g-4" align="center" v-if="Object.keys(classes).length>0">
                        
                       <div  v-for="y in classes">
                                <cr_class_card :class_details="y"></cr_class_card>
                        </div>

            </div>
            
            
            
            </div>
        </div>
        `,
        data:function(){
                return{
                    check:null,
                    current_user:null,
                    classes:{},
                    errors_main:[],
                    errors_modal:[],
                    start_time:"",
                    end_time:"",
                    room:"",
                    enable_updateForm:true,
                    updateDone:false,
                    updateErrors:[],
                    y_classes:{},
                    tom_classes:{},
                    today:0,
                    day_choice:0,
                    class_loaded:false
                    // is_cr:false
                }
            },
    computed:{
        fname:function(){
            // console.log('in store current user=',this.$store.getters.get_current_user)
            return this.$store.getters.get_current_user
        },
        lname:function(){
            return this.$store.getters.get_current_user
        },
        ls_check:function(){if(!('email' in localStorage) || localStorage.email=="null"){return false};return true},
        is_cr:function(){
            if(this.current_user.subject=="CR"){return true}
                return false
        }

    },
   
   
    async mounted(){
        
        this.today=new Date().getDay()-1
        // if(this.$store.getters.authentication_status==false){
        if(!('email' in localStorage) || localStorage.email=="null"){
        // if(false){
            this.$store.commit('empty_error')
            this.$store.commit('add_error', 'Need to login first')
            this.$router.push({ name: 'home' })

        }
        else{ var done=false;
             //  fetch(this.$store.getters.get_base_url+"/logout")
             // .then(resp=>{
             //    if(!resp.ok){
             //        console.log("not ok")
             //    }
             //    return resp.text()})
             // .then(data=>{})

                    
                 

                // function checkFlag() {
                //     console.log('in checkflag',done)
                //     if(done === false) {
                //        window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
                //     } else {
                        
                //     }
                // }
                // checkFlag()
                // while(done==false){console.log('c')}






            this.$store.commit('set_current_user',JSON.parse(localStorage.user))
            this.current_user=this.$store.getters.get_current_user
            // if(localStorage.password!=null){this.$store.commit.set_a_token(localStorage.a_token);this.$store.commit.set_auth(localStorage.authenticated)}
            this.$store.commit('set_a_token',localStorage.token)    
            //fetch the scheduled classes
            // console.log('here hai')
            if(!this.is_cr){
                var data_sent={'requirement':'get','get_day':0}
                    
                    // console.log("in func =",e," and order=",order)
                     fetch(this.$store.getters.get_base_url+"/api/t/classes",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok confirm class");throw new Error();
                            }
                            else{return resp.json()}

                        })
                        .then(data=>{     
                            this.classes={}
                                for (var i in data) {
                                 
                                this.classes[data[i].class_id]=data[i]
                                }
                                this.class_loaded=true
                                this.$forceUpdate();
                            })
            }
            else{
                var b={'get_day':0}
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
                                
                                
                                // console.log(i)
                            }
                            // console.log('done data=',this.classes)
                            this.class_loaded=true
                            this.$forceUpdate();
                        })


            }
            
        }
    },
    watch:{
        errors_main:function(val){
            setTimeout(()=>this.errors_main=[],4000)
      },
      day_choice:function(newVal,oldVal){
            // var g_d=-1
            // if(day_choice==0){g_d=0}
                var link_cr="/api/classes"
                this.class_loaded=false
                var link=""
                    this.classes={}
                    var data_sent={'requirement':'get','get_day':newVal}
                    // console.log('sending=',data_sent)
                    
                    // console.log("in func =",e," and order=",order)
                    if (!this.is_cr){link=this.$store.getters.get_base_url+"/api/t/classes"}
                    else{link=this.$store.getters.get_base_url+link_cr}
                     fetch(link,{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok confirm class");throw new Error();
                            }
                            else{return resp.json()}

                        })
                        .then(data=>{     
                            this.classes={}
                                for (var i in data) {
                                    // console.lo
                                 
                                this.classes[data[i].class_id]=data[i]
                                }
                                this.class_loaded=true
                                this.$forceUpdate();
                            })

                

            
                },
    },
    methods:{
        log_out:function(){
            this.$parent.log_out()
        },
        reset_add_data:function(){
                    
                    this.room=""
                    this.updateDone=false
                    this.enable_updateForm=true
                    this.updateErrors=[]
        },
        go_to_home:function(){
            this.$router.push({ name: 'home' })
        },
        empty_errors_modal:function(){
            this.errors_modal=[]
        },
        add_class_confirmed:function(){
                    // console.log('entered!')
                    this.updateErrors=[]
                    this.enable_updateForm=false
                    this.revised_time=new Date()        
                    this.original_time=new Date(this.revised_time)
                    let current_mins=this.revised_time.getMinutes()
                    let current_hrs=this.revised_time.getHours()
                    
                    if(30-current_mins>0){
                        this.revised_time.setMinutes(current_mins+30)
                        this.revised_time.setHours(current_hrs+5)
                    }
                    else{
                        this.revised_time.setHours(current_hrs+6);
                        this.revised_time.setMinutes(current_mins-30)
                    }
                    
                    // for(var c in this.start_time){
                    //     if(this.start_time.charCodeAt(c)<48 || this.start_time.charCodeAt(c)>57){
                    //         this.alert_class='alert alert-danger'
                    //         this.updateErrors=[]
                    //         this.updateErrors.push('Enter only numbers in range 0-2359. This is TIME!')
                    //         this.enable_updateForm=true
                    //         return;
                    //     }
                    // }
                    // for(var c in this.end_time){
                    //     if(this.end_time.charCodeAt(c)<48 || this.end_time.charCodeAt(c)>57){
                    //         this.alert_class='alert alert-danger'
                    //         this.updateErrors=[]
                    //         this.updateErrors.push('Enter only numbers in range 0-2359. This is TIME!')
                    //         this.enable_updateForm=true
                    //         return;
                    //     }
                    // }

                    if(this.start_time>=this.end_time){
                        this.alert_class='alert alert-danger'
                        this.updateErrors=[]
                        this.updateErrors.push('Calibrate the time properly!')
                        this.enable_updateForm=true
                        return;
                    }
                    // console.log(typeof(this.room))
                    for(var c in this.room){
                        if(this.room.charCodeAt(c)<48 || this.room.charCodeAt(c)>57 || this.room.length==0){
                            this.alert_class='alert alert-danger'
                            this.updateErrors=[]
                            this.updateErrors.push('Room can only be an integer>=0. If you wish to hold class in a lab, enter 0.')
                            this.enable_updateForm=true
                            return;
                        }
                    }
                    
                    // console.log('everything cleared')
                    var data_sent={'time':this.revised_time.toJSON(),
                    'room':this.room,'start_time':this.start_time,'end_time':this.end_time}
                    // console.log("in func =",e," and order=",order)
                     fetch(this.$store.getters.get_base_url+"/api/t/classes",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"POST",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok abort class");throw new Error();
                            }
                            else{return resp.json()}

                        })
                        .then(data=>{    
                                    // console.log("received=",data)
                                    this.updateDone=true
                                    // this.$forceUpdate()
                                    var date=this.original_time.getDate()
                                    const months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
                                    var month=months[this.original_time.getMonth()]
                                    var hrs=this.original_time.getHours()
                                    var mins=this.original_time.getMinutes()
                                    this.last_updated=hrs.toString()+":"+mins.toString()+" ON "+month+" "+date.toString()
                                    this.alert_class='alert alert-success'
                                    this.updateErrors=[]
                                    this.updateErrors.push("Class Added Sucessfully!")
                                    // console.log("Added successfully, data=",data)
                                    for(var i in data){
                                        this.classes[i]=data[i]
                                    }
                                    // console.log("now classes=",this.classes)
                                    this.$forceUpdate()



                        }).catch(error=>{
                            this.updateErrors.push('Could not add class. Internal error')
                        })

                },
        delete_user_confirmed: function(){

                     fetch(this.$store.getters.get_base_url+"/api/user",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"DELETE"})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");throw new Error();
                            }
                        else{return resp}
                        })
                        .then(data=>{     
                            this.$store.commit('add_error','Account deleted successfully')
                            localStorage.clear()
                            this.$router.push({'name':'home'})
                        })
                        .catch(error=>{this.errors_main.push('Could not delete your account. Contact Sourav')})
        },
        asked_for_revision:async function(){
             var data_sent={'requirement':'get','order':this.order }
                     fetch(this.$store.getters.get_base_url+"/api/decks",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");throw new Error();
                            }

                            else{return resp.json()}
                        })
                        .then(data=>{
                            for(var i in data){this.$store.commit('add_deck_for_revision',data[i])}
                            this.$router.push({'name':'revise_component',params:{'helper':0}})
                            // console.log(data)
                    }).catch(error=>{this.errors_main.push('Could not fetch you decks for revision.')})
                                
        },
        
    },

}
export default dashboard;