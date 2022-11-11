
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function() {
//     navigator.serviceWorker
//       .register("sw.js")
//       .then(res => console.log("service worker registered"))
//       .catch(err => console.log("service worker not registered", err))
//   })
// }




Vue.component('cr_class_card',{
    // beforeMount(){
    //     this.$store.commit('inc_deck_index',1)
    //     this.deck_loop=this.$store.getters.get_deck

    // },
    mounted(){
        // this.$store.commit('reset_cards_for_revision')
        // this.$store.commit('reset_decks_for_revision')
        this.contradictionID="CONTRADICTIT"+this.class_details.class_id+"CONTRADICTIT"

        this.d_room=this.class_details.room
        this.room=this.d_room
        this.subject=this.class_details.subject
        this.start_time=this.class_details.start_time
        this.end_time=this.class_details.end_time
        this.d_start_time=String(this.start_time)
        this.d_end_time=String(this.end_time)
        this.change_helper=this.class_details.status
        this.card_header=this.card_status[this.change_helper]
        this.card_header_style=this.card_header_styles[this.change_helper]
        this.last_updated=this.class_details.last_updated
        
        this.rm=this.room
        if (this.last_updated!=null){
            var js_date=new Date(this.last_updated.toString())
            // console.log("this.last_updated=",this.last_updated)
            // console.log("js_date=",js_date)
            var date=js_date.getDate()
            const months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
            var month=months[js_date.getMonth()]
            var hrs=js_date.getHours()
            var mins=js_date.getMinutes()
            this.last_updated=hrs.toString()+":"+mins.toString()+" ON "+month+" "+date.toString()
            
        }
        // console.log(this.date)
    },
    computed:{
        already_contradicted:function(){
            
            return this.class_details.contradicted
        },
    },
    data:function(){
        return{
            // deck_loop:"",
            subject:"",
            d_room:"",
            contradictionID:"",
            contradict_class:false,
            revised_time:"",
             card_status:['SCHEDULED','CONFIRMED','ABORTED','EXTRA'],
           card_header_styles:["card-header bg-warning text-white","card-header bg-success text-white","card-header bg-danger text-white","card-header bg-info text-white"],
            card_header:"",
            card_header_style:"",
            change_helper:0,
            last_updated:"",
            original_time:"",
            enable_updateForm:true,
            d_start_time:"",
            d_end_time:"",
            start_time:"",
            end_time:"",
            room:0,
            updateDone:false,
            only_pm:false,
            updateErrors:[],
            alert_class:"",
        }
    },

    props:['class_details'],
    
    template:`
            <div >
                <div class="modal fade" :id="contradictionID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="false" >
                
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" >Report Contradiction</h5>
                        
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          
                          <h6 >Sure about reporting contradiction for the class with id {{class_details.class_id}}?</h6>
                          
                          
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="contradict_class_confirmed()" >YES</button>
                        
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">NO</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card mb-3" style="max-width: 15rem;">
                    <div :class="card_header_style">
                    <h6 align="center">{{card_header}}</h6>
                    </div>
                    
                    <div class="card-body text-primary">
                        <h6 class="card-title" align="center">TIME: {{this.d_start_time}} TO {{this.d_end_time}}</h6>
                        
                        <ul class="list-group">
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Class ID
                            <span class="badge rounded-pill bg-primary">{{class_details.class_id}}</span>
                          </li>
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Room No.
                            <span class="badge rounded-pill bg-primary">{{d_room}}</span>
                          </li>
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Subject
                            <span class="badge rounded-pill bg-primary">{{subject}}</span>
                          </li>
                        </ul>
                        <br>
                        <div align="center">                    
                        <button type="button" v-if="!contradict_class && !already_contradicted" class="btn btn-danger btn-sm" data-bs-toggle="modal" :data-bs-target="'#'+contradictionID" >CONTRADICT</button>
                        <button type="button" v-if="contradict_class || already_contradicted" class="btn btn-danger btn-sm" data-bs-toggle="modal" disabled data-bs-target="'#'+contradictionID" >CONTRADICTED</button>
                        </div>
                        
                            

                    </div>
                      <div class="card-footer">
                        <div class="spinner-grow spinner-grow-sm text-primary" role="status"></div> Last Updated
                        <span class="badge rounded-pill bg-primary" v-if="this.last_updated">{{this.last_updated}}</span>
                        <br><span class="badge rounded-pill bg-secondary" v-if="this.last_updated==null">NOT YET UPDATED</span>
                        
                        
                      </div>
                    
                    
                </div>



            </div>`,
            methods:{
                contradict_class_confirmed:function(){
                    
                    
                    var data_sent={'requirement':'contradict','class_id':this.class_details.class_id}
                    
                    // console.log("in func =",e," and order=",order)
                     fetch(this.$store.getters.get_base_url+"/api/t/classes",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok contradict class");throw new Error();
                            }
                            else{return resp.json()}

                        })
                        .then(data=>{     
                            //check if cards get auto reset due to api
                            // Vue.set(this.deck_loop,"count_revisions",0)
                            // Vue.set(this.deck_loop,"count_correct_revisions",0)
                            // Vue.set(this.deck_loop,"last_revised",null)
                            this.contradict_class=true
                            // this.change_helper=1
                            this.$forceUpdate();
                        
                        })
                        .catch(error=>{
                            this.$parent.errors_main.push('Could not contradict class. Internal error')
                        })
                },
                },
            watch:{
                 change_helper:function(newVal,oldVal){
                    if(newVal!=-1){
                        this.card_header=this.card_status[newVal]
                        this.card_header_style=this.card_header_styles[newVal]}
                    else{
                        this.card_header=this.card_status[newVal+3]
                        this.card_header_style=this.card_header_styles[newVal+3]}
                },
                start_noon:function(newVal,oldVal){
                    if(newVal==1){this.only_pm=true}
                    else{this.only_pm=false}

                },
            },  
        
})



























Vue.component('o_class_card',{
    mounted(){
        if(this.class_details.status==-1){this.card_header_style=this.card_header_styles[2];this.card_header=this.card_status[2]}
        else{this.card_header_style=this.card_header_styles[this.class_details.status];this.card_header=this.card_status[this.class_details.status]}
        this.last_updated=this.class_details.last_updated
        if (this.last_updated!=null){
            var js_date=new Date(this.last_updated.toString())
            // console.log("this.last_updated=",this.last_updated)
            // console.log("js_date=",js_date)
            var date=js_date.getDate()
            const months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
            var month=months[js_date.getMonth()]
            var hrs=js_date.getHours()
            var mins=js_date.getMinutes()
            this.last_updated=hrs.toString()+":"+mins.toString()+" ON "+month+" "+date.toString()
            
        }
    },
    computed:{
        
    },
    data:function(){
        return{
           card_status:['SCHEDULED','CONFIRMED','ABORTED','EXTRA'],
           card_header_styles:["card-header bg-warning text-white","card-header bg-success text-white","card-header bg-danger text-white","card-header bg-info text-white"],
           card_header:"",
           card_header_style:"",
           last_updated:"",
        }

    },

    props:['class_details'],
    
    template:`<div>
                 <div class="card mb-3" style="max-width: 15rem;">
                    <div :class="card_header_style">
                    <h6 align="center">{{card_header}}</h6>
                    </div>
                    
                    <div class="card-body text-primary">
                        <h6 class="card-title" align="center">TIME: {{class_details.start_time}} TO {{class_details.end_time}}</h6>
                        
                        <ul class="list-group">
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Subject
                            <span class="badge rounded-pill bg-primary">{{class_details.subject}}</span>
                          </li>
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Teacher
                            <span class="badge rounded-pill bg-primary">{{class_details.t_fname}} {{class_details.t_lname}}</span>
                          </li>
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Room No.
                            <span class="badge rounded-pill bg-primary">{{class_details.room}}</span>
                          </li>
                        </ul>
                      
                            

                    </div>
                      <div class="card-footer">
                        <div class="spinner-grow spinner-grow-sm text-primary" role="status"></div> Last Updated
                        <span class="badge rounded-pill bg-primary" v-if="this.last_updated">{{this.last_updated}}</span>
                        <br><span class="badge rounded-pill bg-secondary" v-if="this.last_updated==null">NOT YET UPDATED</span>
                        
                        
                      </div>
                    
                    
                </div>
                </div>
        `})



























Vue.component('class_card',{
    // beforeMount(){
    //     this.$store.commit('inc_deck_index',1)
    //     this.deck_loop=this.$store.getters.get_deck

    // },
    mounted(){
        // this.$store.commit('reset_cards_for_revision')
        // this.$store.commit('reset_decks_for_revision')
        // this.updationID="UPDATEIT"+this.deck_loop.deckCode+"UPDATEIT"
        if('role' in localStorage){
            // console.log('role=',localStorage.role)
            if(localStorage.role=="student"){this.c_role=1}
            else{
                if(localStorage.role=="teacher"){
                    if(this.class_details.teacher_id==localStorage.u_id){this.c_role=0}
                }
            }
            
        }
        this.updationID="UPDATEIT"+this.class_details.class_id+"UPDATEIT"
        this.confirmationID="COMFIRMIT"+this.class_details.class_id+"COMFIRMIT"
        // now=new Date()      
        // now=new Date(this.revised_time)
        // if (now.getHours()>this.start_time)
        this.d_room=this.class_details.room
        this.room=this.d_room
        this.start_time=this.class_details.start_time
        this.end_time=this.class_details.end_time
        this.d_start_time=String(this.start_time)
        this.d_end_time=String(this.end_time)
        this.change_helper=this.class_details.status
        this.card_header=this.card_status[this.change_helper]
        this.card_header_style=this.card_header_styles[this.change_helper]
        this.last_updated=this.class_details.last_updated
        if(localStorage.role=="student" && localStorage.votes.indexOf(this.class_details.class_id)!=-1){this.voted_class=true;}
        this.rm=this.room
        if (this.last_updated!=null){
            var js_date=new Date(this.last_updated.toString())
            // console.log("this.last_updated=",this.last_updated)
            // console.log("js_date=",js_date)
            var date=js_date.getDate()
            const months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
            var month=months[js_date.getMonth()]
            var hrs=js_date.getHours()
            var mins=js_date.getMinutes()
            this.last_updated=hrs.toString()+":"+mins.toString()+" ON "+month+" "+date.toString()
            
        }
        if (this.class_details.chances=='Low'){
            this.class_chance_class='text-danger'
        }
        // console.log()
        if(this.class_details.chances=='High'){
            this.class_chance_class='text-success'
        }
        // console.log(this.date)
    },
    computed:{
        // deck_loop:function(){
        //     console.log("in computed",this.$store.getters.get_deck)
        //     return this.$store.getters.get_deck
        // },
    },
    data:function(){
        return{
            // deck_loop:"",
            errors:[],
            updationID:"",
            d_room:"",
            confirmationID:"",
            confirm_class:false,
            revised_time:"",
             card_status:['SCHEDULED','CONFIRMED','ABORTED','EXTRA'],
           card_header_styles:["card-header bg-warning text-white","card-header bg-success text-white","card-header bg-danger text-white","card-header bg-info text-white"],
            card_header:"",
            card_header_style:"",
            change_helper:0,
            last_updated:"",
            original_time:"",
            enable_updateForm:true,
            d_start_time:"",
            d_end_time:"",
            start_time:"",
            end_time:"",
            room:0,
            updateDone:false,
            only_pm:false,
            updateErrors:[],
            alert_class:"",
            c_role:-1,
            voted_class:false,
            my_vote:0,
            class_chance_class:'text-primary',
            time_passed:false,
        }
    },

    props:['class_details'],
    
    template:`
            <div >
                <div class="modal fade" :id="confirmationID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="false" >
                
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" v-if="this.confirm_class==true">Confirm Class</h5>
                        <h5 class="modal-title" v-else="this.confirm_class==false">Abort Class</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          <h6 v-if="this.confirm_class==true">Sure about confirming the class at {{class_details.start_time}}-{{class_details.end_time}}?</h6>
                          <h6 v-if="this.confirm_class==false">Sure about aborting the class at {{class_details.start_time}}-{{class_details.end_time}}?</h6>
                          
                          
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="confirm_class_confirmed()" v-if="this.confirm_class==true">YES</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="abort_class_confirmed()" v-if="this.confirm_class==false">YES</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">NO</button>
                      </div>
                    </div>
                  </div>
                </div>


                <div class="modal fade" :id="updationID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="false" >
                
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Update Class</h5>
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
                            
                            <input type="time"  v-model="end_time" :disabled="!enable_updateForm" required/><br><br>

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
                        <button type="button" class="btn btn-primary" v-on:click="update_class_confirmed()" v-if="this.enable_updateForm">UPDATE</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CLOSE</button>
                      </div>
                    </div>
                  </div>
                </div>

                

                <div class="card mb-3" style="max-width: 15rem;">
                    <div :class="card_header_style">
                    <h6 align="center">{{card_header}}</h6>
                    </div>
                    
                    <div class="card-body text-primary">
                        <h6 class="card-title" align="center">TIME: {{this.d_start_time}} TO {{this.d_end_time}}</h6>
                        
                        <ul class="list-group">
                          <!--li class="list-group-item d-flex justify-content-between align-items-center">
                            Class ID
                            <span class="badge rounded-pill bg-primary">{{class_details.class_id}}</span>
                          </li-->
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Room No.
                            <span class="badge rounded-pill bg-primary">{{d_room}}</span>
                          </li>
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Teacher
                            <span class="badge rounded-pill bg-primary">{{class_details.t_fname}} {{class_details.t_lname}}</span>
                          </li>
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                            Subject
                            <span class="badge rounded-pill bg-primary">{{class_details.subject}}</span>
                          </li>
                        </ul>
                        <br>
                        <div v-if="change_helper!=-1 && this.c_role==0 && this.$parent.day_choice!=-1">
                        <button type="button" class="btn btn-success btn-sm" v-if="change_helper!=1 && change_helper!=3" data-bs-toggle="modal" :data-bs-target="'#'+confirmationID" v-on:click="want_to_confirm()">CONFIRM!</button>
                        <button type="button" class="btn btn-danger btn-sm" v-if="change_helper!=-1" data-bs-toggle="modal" :data-bs-target="'#'+confirmationID" v-on:click="want_to_abort()">ABORT :(</button>
                        <button type="button" class="btn btn-info btn-sm" v-if="change_helper==1 || change_helper==3" data-bs-toggle="modal" :data-bs-target="'#'+updationID" v-on:click="reset_update_data()">UPDATE</button>
                        </div>
                        <div v-if="this.c_role==1">
                            <button type="button" class="btn btn-outline-secondary" v-on:click="voted()"  v-if="!this.voted_class && this.$parent.day_choice!=-1">Am not coming</button>
                            <div  v-if="this.voted_class" class="alert alert-dark" role="alert">
                              NOT ATTENDING
                              <br>
                            </div>
                            
                            
                        </div>
                        Voted to Not Attend : {{class_details.absence}}%
                        <span :class="class_chance_class"><b>{{class_details.chances}}</b></span> chances of happening.
                    </div>
                      <div class="card-footer">
                        <div class="spinner-grow spinner-grow-sm text-primary" role="status"></div> Last Updated
                        <span class="badge rounded-pill bg-primary" v-if="this.last_updated">{{this.last_updated}}</span>
                        <br><span class="badge rounded-pill bg-secondary" v-if="this.last_updated==null">NOT YET UPDATED</span>
                        
                        
                      </div>
                    
                    
                </div>



            </div>`,
            methods:{
                confirm_class_confirmed:function(){
                    if(this.change_helper==-1){this.$parent.errors_main.push("INVALID REQUEST");return}
                    this.revised_time=new Date()      
                    this.original_time=new Date(this.revised_time)
                    let current_mins=this.revised_time.getMinutes()
                    let current_hrs=this.revised_time.getHours()
                    // console.log("originial time for js=",this.revised_time)
                    if(30-current_mins>0){
                        this.revised_time.setMinutes(current_mins+30)
                        this.revised_time.setHours(current_hrs+5)
                    }
                    else{
                        this.revised_time.setHours(current_hrs+6);
                        this.revised_time.setMinutes(current_mins-30)
                    }
                    // console.log('at start')
                    // console.log(this.revised_time)
                    var data_sent={'requirement':'confirm','class_id':this.class_details.class_id,'time':this.revised_time.toJSON()}
                    
                    // console.log("in func and atoken=",this.$store.getters.get_a_token)
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
                            //check if cards get auto reset due to api
                            // Vue.set(this.deck_loop,"count_revisions",0)
                            // Vue.set(this.deck_loop,"count_correct_revisions",0)
                            // Vue.set(this.deck_loop,"last_revised",null)
                            // console.log('after receving data')
                            // console.log(this.original_time)
                            var date=this.original_time.getDate()
                            const months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
                            var month=months[this.original_time.getMonth()]
                            var hrs=this.original_time.getHours()
                            var mins=this.original_time.getMinutes()
                            this.last_updated=hrs.toString()+":"+mins.toString()+" ON "+month+" "+date.toString()


                            // this.decks[e].count_revisions=0
                            // this.decks[e].count_correct_revisions=0
                            // this.decks[e].last_revised=null
                            this.confirm_class=true
                            this.change_helper=1
                            this.class_details.chances=data.chances
                            if (this.class_details.chances=='Low'){
                                this.class_chance_class='text-danger'
                            }
                            // console.log()
                            if(this.class_details.chances=='High'){
                                this.class_chance_class='text-success'
                            }
                            if(this.class_details.chances=='Medium'){
                                this.class_chance_class='text-primary'
                            }
                            this.$forceUpdate();
                        
                        })
                        .catch(error=>{
                            this.$parent.errors_main.push('Could not confirm class. Internal error')
                        })
                
            },
                voted:function(){
                    var data_sent={'requirement':'vote','class_id':this.class_details.class_id,'s_id':localStorage.u_id}
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
                            // this.change_helper=4
                            this.voted_class=true
                            localStorage.votes+=this.class_details.class_id.toString()
                            // console.log('now localStorage.votes=',localStorage.votes)

                            location.reload()
                        })
                        // .catch(error=>{
                        //     this.$parent.errors_main.push('Could not secure your vote. Internal error')
                        // })
                },
                reset_update_data:function(){
                    this.start_time=this.d_start_time
                    this.end_time=this.d_end_time
                    this.room=this.d_room
                    this.updateDone=false
                    this.enable_updateForm=true
                    this.updateErrors=[]
                },
                update_class_confirmed:function(){
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
                    var data_sent={'requirement':'update','class_id':this.class_details.class_id,'time':this.revised_time.toJSON(),
                    'room':this.room,'start_time':this.start_time,'end_time':this.end_time}
                    // console.log("in func =",e," and order=",order)
                     fetch(this.$store.getters.get_base_url+"/api/t/classes",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok abort class");throw new Error();
                            }
                            else{return resp.json()}

                        })
                        .then(data=>{    
                                    this.d_room=this.room
                                    this.d_start_time=this.start_time
                                    this.d_end_time=this.end_time
                                    // this.enable_updateForm=true
                                    this.updateDone=true
                                    this.$forceUpdate()
                                    var date=this.original_time.getDate()
                                    const months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
                                    var month=months[this.original_time.getMonth()]
                                    var hrs=this.original_time.getHours()
                                    var mins=this.original_time.getMinutes()
                                    this.last_updated=hrs.toString()+":"+mins.toString()+" ON "+month+" "+date.toString()
                                    this.alert_class='alert alert-success'
                                    this.updateErrors=[]
                                    this.updateErrors.push("Updated Sucessfully!")


                        }).catch(error=>{
                            this.$parent.errors_main.push('Could not abort class. Internal error')
                        })

                },
                abort_class_confirmed:function(){
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
                    // console.log('at start')
                    // console.log(this.revised_time)
                    var data_sent={'requirement':'abort','class_id':this.class_details.class_id,'time':this.revised_time.toJSON()}
                    // console.log("in func =",e," and order=",order)
                     fetch(this.$store.getters.get_base_url+"/api/t/classes",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok abort class");throw new Error();
                            }
                            else{return resp.json()}

                        })
                        .then(data=>{     
                            //check if cards get auto reset due to api
                            // Vue.set(this.deck_loop,"count_revisions",0)
                            // Vue.set(this.deck_loop,"count_correct_revisions",0)
                            // Vue.set(this.deck_loop,"last_revised",null)
                            // console.log('after receving data')
                            console.log(this.original_time)
                            var date=this.original_time.getDate()
                            const months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
                            var month=months[this.original_time.getMonth()]
                            var hrs=this.original_time.getHours()
                            var mins=this.original_time.getMinutes()
                            this.last_updated=hrs.toString()+":"+mins.toString()+" ON "+month+" "+date.toString()
                            // this.decks[e].count_revisions=0
                            // this.decks[e].count_correct_revisions=0
                            // this.decks[e].last_revised=null
                            this.confirm_class=false
                            // console.log('got data=',data)
                            this.class_details.chances=data.chances
                            if (this.class_details.chances=='Low'){
                                this.class_chance_class='text-danger'
                            }
                            // console.log()
                            if(this.class_details.chances=='High'){
                                this.class_chance_class='text-success'
                            }
                            if(this.class_details.chances=='Medium'){
                                this.class_chance_class='text-primary'
                            }
                            this.change_helper=-1
                            this.$forceUpdate();
                        
                        })
                        .catch(error=>{
                            this.$parent.errors_main.push('Could not abort class. Internal error')
                        })
                },
                want_to_confirm:function(){
                    this.confirm_class=true
                },
                want_to_abort:function(){
                    this.confirm_class=false
                },
            },
            watch:{
                 change_helper:function(newVal,oldVal){
                    if(newVal!=-1){
                        this.card_header=this.card_status[newVal]
                        this.card_header_style=this.card_header_styles[newVal]}
                    else{
                        this.card_header=this.card_status[newVal+3]
                        this.card_header_style=this.card_header_styles[newVal+3]}
                },
                start_noon:function(newVal,oldVal){
                    if(newVal==1){this.only_pm=true}
                    else{this.only_pm=false}

                },
            },  
})















import store from './store.js'
import home from './home.js'
import dashboard from './dashboard.js'
// import deck from './deck.js'
// import revise from './revise.js'
import register from './register.js'



const routes=[
    {path:"/register",name:'register',component:register},
    {path:"/",name:'home',component:home},
    {path:"/dashboard",name:'dashboard',component:dashboard},
    // {path:'/deck/:deckCode',component:deck,name:'deck',props:true},    
    // {path:"/pls_wait",name:'mediator',components:mediator},
    // {path:"/revise/:helper",name:'revise_component',component:revise,props:true},
 
 
]

const router=new VueRouter({
    routes,
    mode: 'history',
    base:'/',
})

const app=new Vue({
    el:'#app',
    delimiters:['${','}'],
    router,
    store,
    data:{
        username:"",
        authenticated:false,
        auth_token:"",
        errors:[],
    },
    methods:{
        log_out:function(show_ok=true){
            
            fetch(this.$store.getters.get_base_url+"/logout")
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
                    //console.log("succes slog out")
                    if(show_ok){
                        this.$store.commit('empty_error')
                        
                        this.$store.commit('add_error','Successfully logged out.')
                        
                        this.$router.push({name:'home'})        
                    }
                    this.$store.commit('set_auth',false)
                    this.$store.commit('set_a_token',"")
                    localStorage.setItem('password',null)
                    localStorage.setItem('email',null)
                    localStorage.setItem('user',null)
                    localStorage.setItem('a_token',null)
                }
                else{
                    alert("some internal error")
                }
            })
            //console.log("out from logout") 
        },
         getCookie: function(cname) {
          let name = cname + "=";
          let ca = document.cookie.split(';');
          for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
            }
          }
          return "";
        },
        get_new_auth:function(){
                var data={'email':localStorage.email, 'password':localStorage.password}
                                     fetch(this.$store.getters.get_base_url+"/login?include_auth_token",{ method:'POST',
                                         headers:{'Content-Type':'application/json'},body: JSON.stringify(data) })
                                     .then(resp=>{
                                        if(!resp.ok){
                                            console.log("not okf")
                                            
                                            
                                        }
                                        return resp.json()})
                                     .then(data=>{
                                        // console.log("in db, data=",data)
                                        if('user' in data.response){this.$store.commit('set_a_token',data.response.user['authentication_token']);localStorage.a_token=data.response.user['authentication_token']}
                                        else{throw Error}
                                    })
        },
    },
    mounted(){
        // this.$store.commit('set_auth',false);
        // console.log('from main, ls=',localStorage)
        var b_u=window.location.origin
        this.$store.commit('set_base_url',b_u);
        // var auth=this.getCookie('authenticated')
        // var a_token=this.getCookie('a_token')
        // console.log("c_auth=",auth)
        // if (auth=="true"){
        //     this.$store.commit('set_auth',true)
        //     this.$store.commit('set_a_token',a_token)
        //     this.$router.push({name:'dashboard'})
        // }

        
    },

})
